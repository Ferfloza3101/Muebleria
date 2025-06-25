from productos.models import Producto
from django.db import transaction

def fix_specific_images():
    archivos = [
        'sillon_vintage.jpeg',
        'mesa_comedor.jpeg',
        'mesa_redonda.png',
        'mesa_auxiliar.jpeg',
        'cama_KingSize.jpg',
        'sillon_puff.jpeg',
        'espejo_decorativo.jpeg'
    ]
    with transaction.atomic():
        count = 0
        for archivo in archivos:
            producto = Producto.objects.filter(imagen__icontains=archivo).first()
            if producto:
                producto.imagen = f'productos/{archivo}'
                producto.save()
                print(f'Corregido: {producto.nombre} -> productos/{archivo}')
                count += 1
            else:
                print(f'No encontrado: {archivo}')
        print(f'Rutas corregidas para {count} productos.') 