"""
Vistas para la aplicación de productos.
Contiene todas las vistas relacionadas con productos, carrito y wishlist.
"""

from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponse
from django.views.decorators.http import require_POST, require_GET
from django.template.loader import render_to_string
from django.db.models import Q
import random

from .models import Producto, Categoria, Wishlist, Carrito, ItemCarrito
from .utils import get_wishlist_ids, get_product_stock, get_cart_total_items, prepare_product_images
from .mixins import WishlistMixin, CartMixin, ProductMixin


# Instancias de mixins para usar en las vistas
wishlist_mixin = WishlistMixin()
cart_mixin = CartMixin()
product_mixin = ProductMixin()


def home(request):
    """
    Vista de inicio que muestra productos aleatorios en el carrusel y grid, y top productos.
    """
    # Obtener productos para el carrusel (3 productos aleatorios)
    productos_aleatorios = list(Producto.objects.filter(activo=True).order_by('?')[:3])
    
    # Preparar imágenes para cada producto del carrusel
    for producto in productos_aleatorios:
        producto.imagenes_list = prepare_product_images(producto)
    
    # Obtener productos para el grid (8 productos, excluyendo los del carrusel)
    productos_carrusel_ids = [p.id for p in productos_aleatorios]
    productos_grid = list(Producto.objects.filter(
        activo=True
    ).exclude(
        id__in=productos_carrusel_ids
    ).order_by('-ventas', '-fecha_creacion')[:8])

    # Obtener top 6 productos por ventas
    top_productos = list(Producto.objects.filter(activo=True).order_by('-ventas', '-fecha_creacion')[:6])
    if all(p.ventas == 0 for p in top_productos):
        # Si todos tienen 0 ventas, mostrar 6 aleatorios
        top_productos = list(Producto.objects.filter(activo=True).order_by('?')[:6])
    
    context = {
        'productos_carrusel': productos_aleatorios,
        'productos_grid': productos_grid,
        'top_productos': top_productos,
    }
    return render(request, 'inicio.html', context)


def lista_productos(request, categoria_slug=None):
    """
    Vista para listar productos con filtros por categoría y búsqueda.
    """
    # Si no viene en los parámetros de URL, intentar obtenerlo de GET
    if categoria_slug is None:
        categoria_slug = request.GET.get('categoria')
    
    query = request.GET.get('q')
    productos = Producto.objects.filter(activo=True)
    categorias = Categoria.objects.all()
    
    # Aplicar filtros
    if categoria_slug:
        categoria = get_object_or_404(Categoria, slug=categoria_slug)
        productos = productos.filter(categoria=categoria)
    
    if query:
        productos = productos.filter(nombre__icontains=query)

    # Obtener contexto de wishlist
    wishlist_context = wishlist_mixin.get_wishlist_context(request.user)

    return render(request, 'productos/lista_productos.html', {
        'productos': productos,
        'categorias': categorias,
        'categoria_actual': categoria_slug,
        'query': query,
        **wishlist_context,
    })


@login_required
def detalle_producto(request, producto_id):
    """
    Vista para mostrar el detalle completo de un producto.
    """
    producto, imagenes = product_mixin.get_product_with_images(producto_id)
    stock = get_product_stock(producto)
    
    return render(request, 'productos/detalle_producto.html', {
        'producto': producto,
        'imagenes': imagenes,
        'stock': stock,
        'mensaje': 'Detalle del producto',
    })


@login_required
def agregar_producto(request):
    """
    Vista para agregar un nuevo producto (placeholder).
    """
    if request.method == 'POST':
        # Lógica de validación y guardado
        return redirect('lista_productos')
    return render(request, 'productos/agregar_producto.html', {'mensaje': 'Formulario para agregar producto'})


@login_required
def editar_producto(request, producto_id):
    """
    Vista para editar un producto existente (placeholder).
    """
    producto = get_object_or_404(Producto, id=producto_id)
    if request.method == 'POST':
        # Lógica de edición y validación
        return redirect('detalle_producto', producto_id=producto.id)
    return render(request, 'productos/editar_producto.html', {'producto': producto, 'mensaje': 'Editar producto'})


@login_required
def eliminar_producto(request, producto_id):
    """
    Vista para eliminar un producto.
    """
    producto = get_object_or_404(Producto, id=producto_id)
    if request.method == 'POST':
        producto.delete()
        return redirect('lista_productos')
    return render(request, 'productos/eliminar_producto.html', {'producto': producto, 'mensaje': '¿Seguro que deseas eliminar este producto?'})


@login_required
def ver_carrito(request):
    """
    Vista para mostrar el carrito real del usuario.
    """
    carrito = Carrito.objects.filter(usuario=request.user).first()
    items = []
    total = 0
    if carrito:
        items = ItemCarrito.objects.filter(carrito=carrito).select_related('producto')
        for item in items:
            item.subtotal = item.cantidad * item.precio_unitario
        total = sum(item.subtotal for item in items)
    return render(request, 'productos/ver_carrito.html', {
        'items': items,
        'total': total,
    })


@login_required
def comprar_producto(request, producto_id):
    """
    Vista para comprar un producto específico (placeholder).
    """
    producto = get_object_or_404(Producto, id=producto_id)
    if request.method == 'POST':
        # Lógica de compra
        return redirect('ver_carrito')
    return render(request, 'productos/comprar_producto.html', {'producto': producto, 'mensaje': 'Comprar producto'})


def detalle_producto_modal(request, producto_id):
    """
    Vista para cargar el detalle del producto en el modal via AJAX.
    """
    producto = get_object_or_404(Producto, id=producto_id, activo=True)
    stock = get_product_stock(producto)
    
    # Obtener contexto de wishlist
    wishlist_context = wishlist_mixin.get_wishlist_context(request.user)
    
    return render(request, 'productos/detalle_producto_modal.html', {
        'producto': producto,
        'stock': stock,
        **wishlist_context,
    })


@login_required
@require_POST
def toggle_wishlist(request, pk):
    """
    Vista AJAX para agregar/quitar productos de la wishlist.
    """
    producto = get_object_or_404(Producto, pk=pk)
    wishlist, created = Wishlist.objects.get_or_create(usuario=request.user)
    
    if producto in wishlist.productos.all():
        wishlist.productos.remove(producto)
        added = False
    else:
        wishlist.productos.add(producto)
        added = True
    
    return JsonResponse({'added': added})


@login_required
def ver_favoritos(request):
    """
    Vista para mostrar todos los productos en la wishlist del usuario.
    """
    wishlist, _ = Wishlist.objects.get_or_create(usuario=request.user)
    return render(request, 'productos/favoritos.html', {'wishlist': wishlist})


@require_GET
def wishlist_menu_ajax(request):
    """
    Vista AJAX para cargar el menú de wishlist.
    """
    if not request.user.is_authenticated:
        return HttpResponse('<div class="wishlist-empty">No tienes favoritos aún.</div>')
    
    wishlist, _ = Wishlist.objects.get_or_create(usuario=request.user)
    html = render_to_string('productos/partials/wishlist_menu.html', {'wishlist_menu': wishlist})
    return HttpResponse(html)


@login_required
@require_POST
def agregar_al_carrito(request, pk):
    """
    Vista AJAX para agregar productos al carrito.
    """
    producto = get_object_or_404(Producto, pk=pk)
    carrito = cart_mixin.get_or_create_cart(request.user)
    
    try:
        cantidad = int(request.POST.get('cantidad', 1))
    except (ValueError, TypeError):
        cantidad = 1
    if cantidad < 1:
        return JsonResponse({'ok': False, 'error': 'Cantidad inválida.'}, status=400)

    stock = get_product_stock(producto)
    item = cart_mixin.get_cart_item(carrito, producto)
    cantidad_actual = item.cantidad if item else 0
    if cantidad_actual + cantidad > stock:
        return JsonResponse({'ok': False, 'error': f'Solo hay {stock} unidades disponibles.'}, status=400)
    
    cart_mixin.update_cart_item(carrito, producto, cantidad)
    total_items = get_cart_total_items(carrito)
    return JsonResponse({'ok': True, 'count': total_items})


@require_GET
def carrito_menu_ajax(request):
    """
    Vista AJAX para cargar el menú del carrito.
    """
    if not request.user.is_authenticated:
        return HttpResponse('<div class="cart-empty">No hay productos en el carrito.</div>')
    
    carrito = cart_mixin.get_or_create_cart(request.user)
    items = ItemCarrito.objects.filter(carrito=carrito).select_related('producto')
    subtotal = sum(item.cantidad * item.precio_unitario for item in items)
    
    html = render_to_string('productos/partials/carrito_menu.html', {
        'carrito': carrito, 
        'items': items, 
        'subtotal': subtotal
    })
    return HttpResponse(html)


@login_required
@require_POST
def eliminar_del_carrito(request, pk):
    """
    Vista AJAX para eliminar productos del carrito.
    """
    producto = get_object_or_404(Producto, pk=pk)
    carrito = cart_mixin.get_or_create_cart(request.user)
    item = cart_mixin.get_cart_item(carrito, producto)
    if item:
        item.delete()
        total_items = get_cart_total_items(carrito)
        return JsonResponse({'ok': True, 'count': total_items, 'removed': True})
    else:
        return JsonResponse({'ok': False, 'error': 'Producto no está en el carrito'})


@login_required
@require_POST
def vaciar_carrito(request):
    """
    Vista AJAX para vaciar completamente el carrito.
    """
    carrito = cart_mixin.get_or_create_cart(request.user)
    ItemCarrito.objects.filter(carrito=carrito).delete()
    return JsonResponse({'ok': True, 'count': 0})


@login_required
@require_POST
def disminuir_cantidad_carrito(request, pk):
    """
    Vista AJAX para disminuir la cantidad de un producto en el carrito.
    """
    producto = get_object_or_404(Producto, pk=pk)
    carrito = cart_mixin.get_or_create_cart(request.user)
    item = cart_mixin.get_cart_item(carrito, producto)
    if item:
        if item.cantidad > 1:
            item.cantidad -= 1
            item.save()
            total_items = get_cart_total_items(carrito)
            return JsonResponse({'ok': True, 'count': total_items})
        else:
            item.delete()
            total_items = get_cart_total_items(carrito)
            return JsonResponse({'ok': True, 'count': total_items, 'removed': True})
    else:
        return JsonResponse({'ok': False, 'error': 'Producto no está en el carrito'})


# Context processor para la wishlist
def wishlist_menu_context(request):
    """
    Context processor para proporcionar datos de wishlist a todas las vistas.
    """
    if request.user.is_authenticated:
        wishlist, _ = Wishlist.objects.get_or_create(usuario=request.user)
        return {'wishlist_menu': wishlist}
    return {'wishlist_menu': None}


@require_GET
def filtrado_productos_ajax(request):
    categoria_slug = request.GET.get('categoria')
    query = request.GET.get('q')
    productos = Producto.objects.filter(activo=True)
    if categoria_slug:
        categoria = get_object_or_404(Categoria, slug=categoria_slug)
        productos = productos.filter(categoria=categoria)
    if query:
        productos = productos.filter(nombre__icontains=query)
    categorias = Categoria.objects.all()
    wishlist_context = wishlist_mixin.get_wishlist_context(request.user)
    html = render_to_string('productos/partials/grid_productos.html', {
        'productos': productos,
        'wishlist_ids': wishlist_context.get('wishlist_ids', []),
    }, request=request)
    return JsonResponse({'html': html})
