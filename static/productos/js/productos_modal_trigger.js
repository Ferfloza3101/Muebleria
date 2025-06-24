/*
Maneja la apertura de los modales de productos al hacer clic en la tarjeta
*/

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.product-card.open-modal-btn').forEach(card => {
        card.addEventListener('click', function(e) {
            // Evita abrir el modal si se hace click en un botón de acción
            if (e.target.closest('button')) return;
            const productId = this.getAttribute('data-product-id');
            if (productId) openProductModal(productId);
        });
    });
}); 