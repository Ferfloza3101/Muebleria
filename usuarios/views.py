from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import Http404

# Create your views here.

@login_required
def perfil(request):
    # Ejemplo: mostrar perfil del usuario autenticado
    return render(request, 'usuarios/perfil.html', {'usuario': request.user, 'mensaje': 'Perfil de usuario'})

@login_required
def editar_usuario(request, user_id):
    usuario = get_object_or_404(User, id=user_id)
    if request.user != usuario:
        raise Http404('No tienes permiso para editar este usuario')
    if request.method == 'POST':
        # Lógica de edición y validación
        return redirect('perfil')
    return render(request, 'usuarios/editar_usuario.html', {'usuario': usuario, 'mensaje': 'Editar usuario'})

@login_required
def registrar_usuario(request):
    if request.method == 'POST':
        # Lógica de registro y validación
        # Si hay error:
        # return render(request, 'usuarios/registrar_usuario.html', {'mensaje': 'Error al registrar usuario'})
        return redirect('perfil')
    return render(request, 'usuarios/registrar_usuario.html', {'mensaje': 'Formulario de registro'})

@login_required
def eliminar_usuario(request, user_id):
    usuario = get_object_or_404(User, id=user_id)
    if request.user != usuario:
        raise Http404('No tienes permiso para eliminar este usuario')
    if request.method == 'POST':
        usuario.delete()
        return redirect('login')
    return render(request, 'usuarios/eliminar_usuario.html', {'usuario': usuario, 'mensaje': '¿Seguro que deseas eliminar tu usuario?'})
