from productos.models import Producto
from django.db import transaction

def fix_image_paths():
    with transaction.atomic():
        productos = Producto.objects.all()
        count = 0
        for producto in productos:
            if producto.imagen and str(producto.imagen).startswith('static/ASSETS/productos/'):
                nueva_ruta = 'productos/' + str(producto.imagen).split('/')[-1]
                producto.imagen = nueva_ruta
                producto.save()
                count += 1
        print(f'Rutas de imagen corregidas para {count} productos.')

# Para ejecutar desde shell:
# python manage.py shell < productos/scripts/fix_image_paths.py
if __name__ == "__main__":
    fix_image_paths() 