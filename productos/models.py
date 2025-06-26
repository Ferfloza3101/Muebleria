from django.db import models
from django.contrib.auth.models import User
from decimal import Decimal

class Categoria(models.Model):
    nombre = models.CharField(max_length=50)
    descripcion = models.TextField(blank=True, null=True)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name_plural = "Categorias"

class Producto(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    precio_oferta = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    oferta_activa = models.BooleanField(default=False)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True)
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True, related_name='productos')
    imagen_principal = models.ImageField(upload_to='productos/', null=False, blank=False, default='productos/default.jpg')
    ventas = models.PositiveIntegerField(default=0, help_text='Cantidad de veces que este producto ha sido vendido')

    def __str__(self):
        return self.nombre

    def precio_actual(self):
        if self.oferta_activa and self.precio_oferta:
            return self.precio_oferta
        return self.precio

    @property
    def imagenes(self):
        return self.imagenes_producto.all()

class ImagenProducto(models.Model):
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name='imagenes_producto')
    imagen = models.ImageField(upload_to='productos/')
    orden = models.PositiveIntegerField(default=0)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['orden', 'fecha_creacion']

    def __str__(self):
        return f"Imagen de {self.producto.nombre}"

class Inventario(models.Model):
    producto = models.OneToOneField(Producto, on_delete=models.CASCADE, related_name='inventario')
    stock = models.PositiveIntegerField(default=0)
    stock_minimo = models.PositiveIntegerField(default=0)
    stock_maximo = models.PositiveIntegerField(default=100)

    def __str__(self):
        return f"Inventario de {self.producto.nombre}"

class Carrito(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE)
    productos = models.ManyToManyField(Producto, through='ItemCarrito')

class ItemCarrito(models.Model):
    carrito = models.ForeignKey(Carrito, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField(default=1)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        unique_together = ('carrito', 'producto')

class Wishlist(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE)
    productos = models.ManyToManyField(Producto, related_name='wishlists')

    def __str__(self):
        return f"Wishlist de {self.usuario.username}"
