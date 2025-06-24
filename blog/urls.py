# blog/urls.py
from django.urls import path
from . import views

app_name = 'blog'

urlpatterns = [
    path('', views.listado_blog, name='listado_blog'),
    path('<int:blog_id>/', views.detalle_blog, name='detalle_blog'),
    path('crear/', views.crear_blog, name='crear_blog'),
    path('editar/<int:blog_id>/', views.editar_blog, name='editar_blog'),
    path('eliminar/<int:blog_id>/', views.eliminar_blog, name='eliminar_blog'),
    path('like/<int:blog_id>/', views.like_blog, name='like_blog'),  # Función AJAX para dar like
]
