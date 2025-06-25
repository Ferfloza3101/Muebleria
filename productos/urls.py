# productos/urls.py
from django.urls import path
from . import views

app_name = 'productos'

urlpatterns = [
    path('', views.lista_productos, name='lista_productos'),
    path('categoria/<slug:categoria_slug>/', views.lista_productos, name='lista_por_categoria'),
    path('<int:producto_id>/', views.detalle_producto, name='detalle_producto'),
    path('agregar/', views.agregar_producto, name='agregar_producto'),
    path('editar/<int:producto_id>/', views.editar_producto, name='editar_producto'),
    path('eliminar/<int:producto_id>/', views.eliminar_producto, name='eliminar_producto'),
    path('carrito/', views.ver_carrito, name='ver_carrito'),
    path('comprar/<int:producto_id>/', views.comprar_producto, name='comprar_producto'),
    path('detalle/<int:producto_id>/', views.detalle_producto_modal, name='detalle_producto_modal'),
    path('wishlist/toggle/<int:pk>/', views.toggle_wishlist, name='toggle_wishlist'),
    path('favoritos/', views.ver_favoritos, name='ver_favoritos'),
    path('wishlist/menu/', views.wishlist_menu_ajax, name='wishlist_menu_ajax'),
    path('carrito/add/<int:pk>/', views.agregar_al_carrito, name='agregar_al_carrito'),
    path('carrito/menu/', views.carrito_menu_ajax, name='carrito_menu_ajax'),
    path('carrito/remove/<int:pk>/', views.eliminar_del_carrito, name='eliminar_del_carrito'),
    path('carrito/clear/', views.vaciar_carrito, name='vaciar_carrito'),
    path('carrito/decrease/<int:pk>/', views.disminuir_cantidad_carrito, name='disminuir_cantidad_carrito'),
]
