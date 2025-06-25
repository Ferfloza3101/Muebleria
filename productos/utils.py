"""
Utilidades comunes para la aplicación de productos.
Contiene funciones auxiliares que se utilizan en múltiples vistas.
"""

from .models import Wishlist, Carrito, ItemCarrito


def get_wishlist_ids(user):
    """
    Obtiene los IDs de productos en la wishlist del usuario.
    
    Args:
        user: Usuario autenticado
        
    Returns:
        list: Lista de IDs de productos en la wishlist
    """
    if user.is_authenticated:
        wishlist, _ = Wishlist.objects.get_or_create(usuario=user)
        return list(wishlist.productos.values_list('id', flat=True))
    return []


def get_product_stock(producto):
    """
    Obtiene el stock disponible de un producto.
    
    Args:
        producto: Instancia del modelo Producto
        
    Returns:
        int: Cantidad de stock disponible
    """
    return producto.inventario.stock if hasattr(producto, 'inventario') else 0


def get_cart_total_items(carrito):
    """
    Calcula el total de items en el carrito.
    
    Args:
        carrito: Instancia del modelo Carrito
        
    Returns:
        int: Total de items en el carrito
    """
    return sum(item.cantidad for item in ItemCarrito.objects.filter(carrito=carrito))


def prepare_product_images(producto):
    """
    Prepara la lista de imágenes de un producto para el contexto.
    
    Args:
        producto: Instancia del modelo Producto
        
    Returns:
        list: Lista de imágenes del producto
    """
    imagenes_list = list(producto.imagenes)
    if not imagenes_list:
        imagenes_list = [{'imagen': producto.imagen_principal}]
    return imagenes_list 