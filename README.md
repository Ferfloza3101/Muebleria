# Mueblería - Proyecto Django

## Descripción
Sistema de gestión de mueblería en línea con funcionalidades de catálogo, carrito de compras, wishlist y blog.

## Estructura del Proyecto

### Apps Principales
- **productos**: Gestión de productos, carrito y wishlist
- **login**: Sistema de autenticación
- **usuarios**: Gestión de perfiles de usuario
- **blog**: Sistema de blog

### Estructura Refactorizada

#### Archivos de Utilidades
- `productos/utils.py`: Funciones auxiliares comunes
- `productos/mixins.py`: Mixins para funcionalidades reutilizables
- `productos/context_processors.py`: Context processors para datos globales

#### Vistas Optimizadas
- `productos/views.py`: Vistas refactorizadas usando mixins y utils
- Eliminación de código duplicado
- Documentación completa de cada vista
- Separación clara de responsabilidades

## Instalación

1. Clonar el repositorio
2. Crear entorno virtual: `python -m venv env`
3. Activar entorno virtual: `source env/bin/activate` (Linux/Mac) o `env\Scripts\activate` (Windows)
4. Instalar dependencias: `pip install -r requirements.txt`
5. Ejecutar migraciones: `python manage.py migrate`
6. Crear superusuario: `python manage.py createsuperuser`
7. Ejecutar servidor: `python manage.py runserver`

## Dependencias

Ver `requirements.txt` para la lista completa de dependencias.

## Funcionalidades Principales

### Productos
- Catálogo de productos con filtros por categoría
- Detalle de productos con galería de imágenes
- Sistema de ofertas y precios
- Gestión de inventario

### Carrito de Compras
- Agregar/quitar productos
- Modificar cantidades
- Cálculo automático de subtotales
- Persistencia de datos por usuario

### Wishlist/Favoritos
- Agregar productos a favoritos
- Vista dedicada de favoritos
- Menú desplegable en navbar
- Sincronización en tiempo real

### Usuarios
- Sistema de registro y login
- Perfiles de usuario
- Gestión de datos personales

### Blog
- Sistema de artículos
- Gestión de contenido
- Interacción de usuarios

## Estructura de Archivos

```
Muebleria-main/
├── manage.py
├── requirements.txt
├── README.md
├── muebleria/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── productos/
│   ├── __init__.py
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   ├── utils.py
│   ├── mixins.py
│   ├── context_processors.py
│   ├── admin.py
│   └── templates/
│       └── productos/
├── login/
├── usuarios/
├── blog/
├── templates/
├── static/
└── media/
```

## Mejoras Implementadas

### Refactorización de Vistas
- **Eliminación de duplicaciones**: Código común extraído a utils y mixins
- **Mejor organización**: Separación clara de responsabilidades
- **Documentación**: Docstrings completos para todas las funciones
- **Mantenibilidad**: Código más fácil de mantener y extender

### Optimización de Código
- **Utils**: Funciones auxiliares reutilizables
- **Mixins**: Funcionalidades comunes encapsuladas
- **Context Processors**: Datos globales centralizados
- **Eliminación de archivos vacíos**: Limpieza de templates no utilizados

### Gestión de Dependencias
- **requirements.txt**: Lista completa de dependencias del proyecto
- **Configuración centralizada**: Settings unificados en un solo archivo

## Comandos Útiles

```bash
# Verificar integridad del proyecto
python manage.py check

# Ejecutar tests (cuando se implementen)
python manage.py test

# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Recolectar archivos estáticos
python manage.py collectstatic
```

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles. 