from productos.models import Producto
from django.db import transaction

def fix_image_extensions():
    # Mapeo: nombre en la base de datos -> nombre real del archivo
    cambios = {
        'Sillón Vintage': 'sillon_vintage.jpeg',
        'Mesa de Comedor': 'mesa_comedor.jpeg',
        'Mesa Redonda': 'mesa_redonda.png',
        'Mesa Auxiliar': 'mesa_auxiliar.jpeg',
        'Cama King Size': 'cama_KingSize.jpg',
        'Sillón Puff': 'sillon_puff.jpeg',
        'Espejo Decorativo': 'espejo_decorativo.jpeg',
    }
    with transaction.atomic():
        count = 0
        for nombre, archivo in cambios.items():
            producto = Producto.objects.filter(nombre__iexact=nombre).first()
            if producto:
                producto.imagen = f'productos/{archivo}'
                producto.save()
                print(f'Corregido: {producto.nombre} -> productos/{archivo}')
                count += 1
            else:
                print(f'No encontrado: {nombre}')
        print(f'Rutas corregidas para {count} productos.') 