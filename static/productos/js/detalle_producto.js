/*
 Lógica para la galería de imágenes en la vista de detalle de un producto.
*/

document.addEventListener('DOMContentLoaded', function() {
    var imagenes = window.imagenesDetalleProducto || [];
    if (!imagenes.length && window.imagenPrincipalDetalle) {
        imagenes = [window.imagenPrincipalDetalle];
    }
    var imagenActual = 0;
    function mostrarImagen(idx) {
        imagenActual = idx;
        document.getElementById('detalle-imagen').src = imagenes[imagenActual];
        document.querySelectorAll('.dot').forEach(function(dot, i) {
            dot.classList.toggle('active', i === imagenActual);
        });
    }
    window.cambiarImagen = function(delta) {
        imagenActual = (imagenActual + delta + imagenes.length) % imagenes.length;
        mostrarImagen(imagenActual);
    };
    window.seleccionarImagen = function(idx) {
        mostrarImagen(idx);
    };
    // Inicializar la galería si es que metimos imágenes
    if (imagenes.length) {
        mostrarImagen(0);
    }
}); 