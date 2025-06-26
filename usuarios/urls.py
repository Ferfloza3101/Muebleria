# usuarios/urls.py
from django.urls import path
from . import views

app_name = 'usuarios'

urlpatterns = [
    path('', views.perfil, name='perfil'),
    path('editar/<int:user_id>/', views.editar_usuario, name='editar_usuario'),
    path('registrar/', views.registrar_usuario, name='registrar_usuario'),
    path('eliminar/<int:user_id>/', views.eliminar_usuario, name='eliminar_usuario'),
    path('cambiar_contrasena/', views.cambiar_contrasena, name='cambiar_contrasena'),
]
