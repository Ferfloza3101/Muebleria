from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import Http404
from django.contrib.auth import update_session_auth_hash
from django.contrib import messages
import re

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

@login_required
def cambiar_contrasena(request):
    if request.method == 'POST':
        actual = request.POST.get('actual')
        nueva = request.POST.get('nueva')
        confirmar = request.POST.get('confirmar')
        user = request.user
        errores = []
        # Validar contraseña actual
        if not user.check_password(actual):
            errores.append('La contraseña actual es incorrecta.')
        # Validar que la nueva no sea igual a la anterior
        if actual == nueva:
            errores.append('La nueva contraseña no puede ser igual a la anterior.')
        # Validar reglas de seguridad
        if len(nueva) < 8:
            errores.append('La contraseña debe tener al menos 8 caracteres.')
        if not re.search(r'[A-Z]', nueva):
            errores.append('Debe contener al menos una letra mayúscula.')
        if not re.search(r'[^A-Za-z0-9]', nueva):
            errores.append('Debe contener al menos un carácter especial.')
        if nueva != confirmar:
            errores.append('Las contraseñas no coinciden.')
        if errores:
            return render(request, 'usuarios/cambiar_contrasena.html', {'errores': errores})
        # Cambiar contraseña
        user.set_password(nueva)
        user.save()
        update_session_auth_hash(request, user)
        return render(request, 'usuarios/cambiar_contrasena.html', {'exito': True})
    return render(request, 'usuarios/cambiar_contrasena.html')
