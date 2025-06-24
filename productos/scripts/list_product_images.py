from productos.models import Producto

def list_product_images():
    for p in Producto.objects.all():
        print(f'{p.id} | {p.nombre} | {p.imagen}')
 
# Para ejecutar desde shell interactivo:
# from productos.scripts.list_product_images import list_product_images; list_product_images() 