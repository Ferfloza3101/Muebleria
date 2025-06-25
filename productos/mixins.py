"""
Mixins para la aplicación de productos.
Contiene funcionalidades comunes que se pueden reutilizar en las vistas.
"""

from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from .models import Producto, Wishlist, Carrito, ItemCarrito
from .utils import get_wishlist_ids, get_product_stock, get_cart_total_items


class WishlistMixin:
    """
    Mixin para funcionalidades relacionadas con la wishlist.
    """
    
    def get_wishlist_context(self, user):
        """
        Obtiene el contexto de wishlist para las vistas.
        
        Args:
            user: Usuario autenticado
            
        Returns:
            dict: Contexto con wishlist_ids
        """
        return {'wishlist_ids': get_wishlist_ids(user)}


class CartMixin:
    """
    Mixin para funcionalidades relacionadas con el carrito.
    """
    
    def get_or_create_cart(self, user):
        """
        Obtiene o crea el carrito del usuario.
        
        Args:
            user: Usuario autenticado
            
        Returns:
            Carrito: Instancia del carrito
        """
        return Carrito.objects.get_or_create(usuario=user)[0]
    
    def get_cart_item(self, carrito, producto):
        """
        Obtiene un item del carrito.
        
        Args:
            carrito: Instancia del carrito
            producto: Instancia del producto
            
        Returns:
            ItemCarrito: Item del carrito o None
        """
        try:
            return ItemCarrito.objects.get(carrito=carrito, producto=producto)
        except ItemCarrito.DoesNotExist:
            return None
    
    def update_cart_item(self, carrito, producto, cantidad):
        """
        Actualiza o crea un item en el carrito.
        
        Args:
            carrito: Instancia del carrito
            producto: Instancia del producto
            cantidad: Cantidad a agregar
            
        Returns:
            tuple: (item, created)
        """
        item, created = ItemCarrito.objects.get_or_create(
            carrito=carrito, 
            producto=producto
        )
        
        if not created:
            item.cantidad += cantidad
        else:
            item.cantidad = cantidad
            
        item.precio_unitario = producto.precio_actual()
        item.save()
        
        return item, created


class ProductMixin:
    """
    Mixin para funcionalidades relacionadas con productos.
    """
    
    def get_product_with_stock(self, producto_id):
        """
        Obtiene un producto con su información de stock.
        
        Args:
            producto_id: ID del producto
            
        Returns:
            tuple: (producto, stock)
        """
        producto = get_object_or_404(Producto, id=producto_id)
        stock = get_product_stock(producto)
        return producto, stock
    
    def get_product_with_images(self, producto_id):
        """
        Obtiene un producto con sus imágenes preparadas.
        
        Args:
            producto_id: ID del producto
            
        Returns:
            tuple: (producto, imagenes)
        """
        from .utils import prepare_product_images
        producto = get_object_or_404(Producto, id=producto_id)
        imagenes = prepare_product_images(producto)
        return producto, imagenes 