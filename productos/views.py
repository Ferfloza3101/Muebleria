from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.http import Http404, JsonResponse, HttpResponse
from .models import Producto, Categoria, Wishlist, Carrito, ItemCarrito
import json
from django.views.generic import ListView, DetailView
from django.db.models import Q
import random
from django.views.decorators.http import require_POST, require_GET
from django.template import RequestContext
from django.template.loader import render_to_string
from django.views.decorators.csrf import csrf_exempt
from django.utils.safestring import mark_safe

# Create your views here.

# Vista de inicio pública

def prepare_image_data(producto):
    if producto.imagenes.exists():
        images = [{"url": img.imagen.url} for img in producto.imagenes.all()]
    else:
        images = [{"url": producto.imagen_principal.url}]
    return json.dumps(images)

def home(request):
    # Obtener 3 productos aleatorios activos
    productos_aleatorios = list(Producto.objects.filter(activo=True).order_by('?')[:3])
    
    # Para cada producto, obtener sus imágenes
    for producto in productos_aleatorios:
        producto.imagenes_list = list(producto.imagenes)
        if not producto.imagenes_list:
            producto.imagenes_list = [{'imagen': producto.imagen_principal}]
    
    context = {
        'productos_carrusel': productos_aleatorios,
    }
    return render(request, 'inicio.html', context)

def lista_productos(request):
    categoria_slug = request.GET.get('categoria')
    query = request.GET.get('q')
    productos = Producto.objects.filter(activo=True)
    categorias = Categoria.objects.all()
    
    if categoria_slug:
        categoria = get_object_or_404(Categoria, slug=categoria_slug)
        productos = productos.filter(categoria=categoria)
    
    if query:
        productos = productos.filter(nombre__icontains=query)

    wishlist_ids = []
    if request.user.is_authenticated:
        from .models import Wishlist
        wishlist, _ = Wishlist.objects.get_or_create(usuario=request.user)
        wishlist_ids = list(wishlist.productos.values_list('id', flat=True))

    return render(request, 'productos/lista_productos.html', {
        'productos': productos,
        'categorias': categorias,
        'categoria_actual': categoria_slug,
        'query': query,
        'wishlist_ids': wishlist_ids,
    })

@login_required
def detalle_producto(request, producto_id):
    producto = get_object_or_404(Producto, id=producto_id)
    imagenes = list(producto.imagenes)
    stock = producto.inventario.stock if hasattr(producto, 'inventario') else 0
    return render(request, 'productos/detalle_producto.html', {
        'producto': producto,
        'imagenes': imagenes,
        'stock': stock,
        'mensaje': 'Detalle del producto',
    })

@login_required
def agregar_producto(request):
    if request.method == 'POST':
        # Lógica de validación y guardado
        return redirect('lista_productos')
    return render(request, 'productos/agregar_producto.html', {'mensaje': 'Formulario para agregar producto'})

@login_required
def editar_producto(request, producto_id):
    producto = get_object_or_404(Producto, id=producto_id)
    if request.method == 'POST':
        # Lógica de edición y validación
        return redirect('detalle_producto', producto_id=producto.id)
    return render(request, 'productos/editar_producto.html', {'producto': producto, 'mensaje': 'Editar producto'})

@login_required
def eliminar_producto(request, producto_id):
    producto = get_object_or_404(Producto, id=producto_id)
    if request.method == 'POST':
        producto.delete()
        return redirect('lista_productos')
    return render(request, 'productos/eliminar_producto.html', {'producto': producto, 'mensaje': '¿Seguro que deseas eliminar este producto?'})

@login_required
def ver_carrito(request):
    # Lógica para mostrar el carrito del usuario
    return render(request, 'productos/ver_carrito.html', {'mensaje': 'Carrito de compras'})

@login_required
def comprar_producto(request, producto_id):
    producto = get_object_or_404(Producto, id=producto_id)
    if request.method == 'POST':
        # Lógica de compra
        return redirect('ver_carrito')
    return render(request, 'productos/comprar_producto.html', {'producto': producto, 'mensaje': 'Comprar producto'})

def detalle_producto_modal(request, producto_id):
    """Vista para cargar el detalle del producto en el modal via AJAX"""
    producto = get_object_or_404(Producto, id=producto_id, activo=True)
    stock = producto.inventario.stock if hasattr(producto, 'inventario') else 0
    wishlist_ids = []
    if request.user.is_authenticated:
        from .models import Wishlist
        wishlist, _ = Wishlist.objects.get_or_create(usuario=request.user)
        wishlist_ids = list(wishlist.productos.values_list('id', flat=True))
    return render(request, 'productos/detalle_producto_modal.html', {
        'producto': producto,
        'stock': stock,
        'wishlist_ids': wishlist_ids,
    })

@login_required
@require_POST
def toggle_wishlist(request, pk):
    producto = get_object_or_404(Producto, pk=pk)
    wishlist, created = Wishlist.objects.get_or_create(usuario=request.user)
    if producto in wishlist.productos.all():
        wishlist.productos.remove(producto)
        added = False
    else:
        wishlist.productos.add(producto)
        added = True
    return JsonResponse({'added': added})

def wishlist_menu_context(request):
    if request.user.is_authenticated:
        wishlist, _ = Wishlist.objects.get_or_create(usuario=request.user)
        return {'wishlist_menu': wishlist}
    return {'wishlist_menu': None}

@login_required
def ver_favoritos(request):
    wishlist, _ = Wishlist.objects.get_or_create(usuario=request.user)
    return render(request, 'productos/favoritos.html', {'wishlist': wishlist})

@require_GET
def wishlist_menu_ajax(request):
    if not request.user.is_authenticated:
        return HttpResponse('<div class="wishlist-empty">No tienes favoritos aún.</div>')
    wishlist, _ = Wishlist.objects.get_or_create(usuario=request.user)
    html = render_to_string('productos/partials/wishlist_menu.html', {'wishlist_menu': wishlist})
    return HttpResponse(html)

@login_required
def agregar_al_carrito(request, pk):
    if request.method != 'POST':
        return JsonResponse({'ok': False, 'error': 'Método no permitido'}, status=405)
    producto = get_object_or_404(Producto, pk=pk)
    carrito, _ = Carrito.objects.get_or_create(usuario=request.user)
    item, creado = ItemCarrito.objects.get_or_create(carrito=carrito, producto=producto)
    try:
        cantidad = int(request.POST.get('cantidad', 1))
    except (ValueError, TypeError):
        cantidad = 1
    if not creado:
        item.cantidad += cantidad
    else:
        item.cantidad = cantidad
    item.precio_unitario = producto.precio_actual()
    item.save()
    total_items = ItemCarrito.objects.filter(carrito=carrito).count()
    return JsonResponse({'ok': True, 'count': total_items})

@require_GET
def carrito_menu_ajax(request):
    if not request.user.is_authenticated:
        return HttpResponse('<div class="cart-empty">No hay productos en el carrito.</div>')
    carrito, _ = Carrito.objects.get_or_create(usuario=request.user)
    items = ItemCarrito.objects.filter(carrito=carrito).select_related('producto')
    subtotal = sum(item.cantidad * item.precio_unitario for item in items)
    html = render_to_string('productos/partials/carrito_menu.html', {'carrito': carrito, 'items': items, 'subtotal': subtotal})
    return HttpResponse(html)

@login_required
@require_POST
def eliminar_del_carrito(request, pk):
    producto = get_object_or_404(Producto, pk=pk)
    carrito, _ = Carrito.objects.get_or_create(usuario=request.user)
    try:
        item = ItemCarrito.objects.get(carrito=carrito, producto=producto)
        item.delete()
        total_items = sum(i.cantidad for i in ItemCarrito.objects.filter(carrito=carrito))
        return JsonResponse({'ok': True, 'count': total_items})
    except ItemCarrito.DoesNotExist:
        return JsonResponse({'ok': False, 'error': 'Producto no está en el carrito'})

@login_required
@require_POST
def vaciar_carrito(request):
    carrito, _ = Carrito.objects.get_or_create(usuario=request.user)
    ItemCarrito.objects.filter(carrito=carrito).delete()
    return JsonResponse({'ok': True, 'count': 0})

@login_required
@require_POST
def disminuir_cantidad_carrito(request, pk):
    producto = get_object_or_404(Producto, pk=pk)
    carrito, _ = Carrito.objects.get_or_create(usuario=request.user)
    try:
        item = ItemCarrito.objects.get(carrito=carrito, producto=producto)
        if item.cantidad > 1:
            item.cantidad -= 1
            item.save()
        else:
            item.delete()
        total_items = sum(i.cantidad for i in ItemCarrito.objects.filter(carrito=carrito))
        return JsonResponse({'ok': True, 'count': total_items})
    except ItemCarrito.DoesNotExist:
        return JsonResponse({'ok': False, 'error': 'Producto no está en el carrito'})
