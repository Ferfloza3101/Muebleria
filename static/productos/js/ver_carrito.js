document.addEventListener('DOMContentLoaded', function() {
    // Aumentar/disminuir cantidad (AJAX real)
    document.querySelectorAll('.carrito-btn-cantidad').forEach(btn => {
        btn.addEventListener('click', function() {
            const item = btn.closest('.carrito-item');
            const cantidadSpan = item.querySelector('.cantidad');
            const productoId = item.dataset.id;
            const action = btn.dataset.action;
            if (action === 'increase') {
                fetch(`/productos/carrito/add/${productoId}/`, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': getCSRFToken(),
                        'X-Requested-With': 'XMLHttpRequest',
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    credentials: 'same-origin',
                    body: 'cantidad=1',
                })
                .then(response => response.json())
                .then(data => {
                    if (data.ok) {
                        let cantidad = parseInt(cantidadSpan.textContent);
                        cantidad++;
                        cantidadSpan.textContent = cantidad;
                        const precio = parseFloat(item.querySelector('.carrito-item-precio').textContent.replace('$',''));
                        item.querySelector('.carrito-item-subtotal').textContent = 'Subtotal: $' + (cantidad * precio).toFixed(2);
                        actualizarTotal();
                    } else {
                        alert(data.error || 'No se pudo aumentar la cantidad.');
                    }
                })
                .catch(() => {
                    alert('Error al aumentar la cantidad.');
                });
            } else if (action === 'decrease') {
                fetch(`/productos/carrito/decrease/${productoId}/`, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': getCSRFToken(),
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    credentials: 'same-origin',
                })
                .then(response => response.json())
                .then(data => {
                    if (data.ok) {
                        let cantidad = parseInt(cantidadSpan.textContent);
                        if (cantidad > 1) {
                            cantidad--;
                            cantidadSpan.textContent = cantidad;
                            const precio = parseFloat(item.querySelector('.carrito-item-precio').textContent.replace('$',''));
                            item.querySelector('.carrito-item-subtotal').textContent = 'Subtotal: $' + (cantidad * precio).toFixed(2);
                        } else {
                            item.remove();
                            mostrarVacioSiEsNecesario();
                        }
                        actualizarTotal();
                    } else {
                        alert(data.error || 'No se pudo disminuir la cantidad.');
                    }
                })
                .catch(() => {
                    alert('Error al disminuir la cantidad.');
                });
            }
        });
    });
    // Eliminar producto (AJAX real)
    document.querySelectorAll('.carrito-btn-eliminar').forEach(btn => {
        btn.addEventListener('click', function() {
            const item = btn.closest('.carrito-item');
            const productoId = item.dataset.id;
            fetch(`/productos/carrito/remove/${productoId}/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCSRFToken(),
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
            })
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    item.remove();
                    actualizarTotal();
                    mostrarVacioSiEsNecesario();
                } else {
                    alert(data.error || 'No se pudo eliminar el producto.');
                }
            })
            .catch(() => {
                alert('Error al eliminar el producto.');
            });
        });
    });
    // Vaciar carrito
    const vaciarBtn = document.getElementById('vaciarCarrito');
    if (vaciarBtn) {
        vaciarBtn.addEventListener('click', function() {
            fetch('/productos/carrito/clear/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCSRFToken(),
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
            })
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    document.querySelectorAll('.carrito-item').forEach(item => item.remove());
                    actualizarTotal();
                    mostrarVacioSiEsNecesario();
                } else {
                    alert('No se pudo vaciar el carrito.');
                }
            })
            .catch(() => {
                alert('Error al vaciar el carrito.');
            });
        });
    }
    function actualizarTotal() {
        let total = 0;
        document.querySelectorAll('.carrito-item').forEach(item => {
            const cantidad = parseInt(item.querySelector('.cantidad').textContent);
            const precio = parseFloat(item.querySelector('.carrito-item-precio').textContent.replace('$',''));
            total += cantidad * precio;
        });
        document.querySelector('.carrito-total-monto').textContent = '$' + total.toFixed(2);
    }
    function mostrarVacioSiEsNecesario() {
        if (document.querySelectorAll('.carrito-item').length === 0) {
            document.querySelector('.carrito-lista').remove();
            document.querySelector('.carrito-total').remove();
            document.querySelector('.carrito-acciones').remove();
            const vacio = document.createElement('div');
            vacio.className = 'carrito-vacio';
            vacio.textContent = 'Tu carrito está vacío.';
            document.querySelector('.carrito-container').insertBefore(vacio, document.querySelector('.carrito-links'));
        }
    }
    // Función para obtener el token CSRF de la cookie
    function getCSRFToken() {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, 10) === ('csrftoken=')) {
                    cookieValue = decodeURIComponent(cookie.substring(10));
                    break;
                }
            }
        }
        return cookieValue;
    }
}); 