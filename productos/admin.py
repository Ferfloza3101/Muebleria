from django.contrib import admin
from .models import Producto, Categoria, Inventario, Carrito, ItemCarrito, ImagenProducto, Wishlist

class ImagenProductoInline(admin.TabularInline):
    model = ImagenProducto
    extra = 1

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'categoria', 'precio', 'precio_oferta', 'oferta_activa', 'activo')
    list_filter = ('categoria', 'oferta_activa', 'activo')
    search_fields = ('nombre', 'descripcion')
    inlines = [ImagenProductoInline]

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'slug')
    prepopulated_fields = {'slug': ('nombre',)}

@admin.register(Inventario)
class InventarioAdmin(admin.ModelAdmin):
    list_display = ('producto', 'stock', 'stock_minimo', 'stock_maximo')
    list_filter = ('stock_minimo', 'stock_maximo')
    search_fields = ('producto__nombre',)

@admin.register(Carrito)
class CarritoAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'productos_en_carrito')
    search_fields = ('usuario__username',)
    def productos_en_carrito(self, obj):
        items = ItemCarrito.objects.filter(carrito=obj).select_related('producto')
        if not items:
            return '(Vacío)'
        return ', '.join([f"{item.producto.nombre} (x{item.cantidad})" for item in items])
    productos_en_carrito.short_description = 'Productos en carrito'

@admin.register(ItemCarrito)
class ItemCarritoAdmin(admin.ModelAdmin):
    list_display = ('carrito', 'producto', 'cantidad', 'precio_unitario')
    list_filter = ('carrito',)
    search_fields = ('producto__nombre', 'carrito__usuario__username')

@admin.register(ImagenProducto)
class ImagenProductoAdmin(admin.ModelAdmin):
    list_display = ('producto', 'orden', 'fecha_creacion')
    list_filter = ('producto',)
    search_fields = ('producto__nombre',)
    ordering = ('producto', 'orden', 'fecha_creacion')

@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'productos_count')
    search_fields = ('usuario__username', 'productos__nombre')
    filter_horizontal = ('productos',)
    def productos_count(self, obj):
        return obj.productos.count()
    productos_count.short_description = 'N° de productos'
