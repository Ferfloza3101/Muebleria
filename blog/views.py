from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, Http404
from .models import Blog  # Asegúrate de tener este modelo

# Create your views here.

def listado_blog(request):
    # Ejemplo de obtención de blogs
    blogs = Blog.objects.all()
    return render(request, 'blog/listado_blog.html', {'blogs': blogs, 'mensaje': 'Listado de blogs'})

@login_required
def detalle_blog(request, blog_id):
    blog = get_object_or_404(Blog, id=blog_id)
    return render(request, 'blog/detalle_blog.html', {'blog': blog, 'mensaje': 'Detalle del blog'})

@login_required
def crear_blog(request):
    if request.method == 'POST':
        # Aquí iría la lógica de validación y guardado
        # Si hay error:
        # return render(request, 'blog/crear_blog.html', {'mensaje': 'Error al crear blog'})
        return redirect('listado_blog')
    return render(request, 'blog/crear_blog.html', {'mensaje': 'Formulario para crear blog'})

@login_required
def editar_blog(request, blog_id):
    blog = get_object_or_404(Blog, id=blog_id)
    if request.method == 'POST':
        # Lógica de edición y validación
        return redirect('detalle_blog', blog_id=blog.id)
    return render(request, 'blog/editar_blog.html', {'blog': blog, 'mensaje': 'Editar blog'})

@login_required
def eliminar_blog(request, blog_id):
    blog = get_object_or_404(Blog, id=blog_id)
    if request.method == 'POST':
        blog.delete()
        return redirect('listado_blog')
    return render(request, 'blog/eliminar_blog.html', {'blog': blog, 'mensaje': '¿Seguro que deseas eliminar este blog?'})

@login_required
def like_blog(request, blog_id):
    if request.method == 'POST' and request.is_ajax():
        try:
            blog = Blog.objects.get(id=blog_id)
            # Lógica para dar like
            return JsonResponse({'success': True, 'mensaje': 'Like registrado'})
        except Blog.DoesNotExist:
            return JsonResponse({'success': False, 'mensaje': 'Blog no encontrado'})
    raise Http404('Solo se permite método POST AJAX')
