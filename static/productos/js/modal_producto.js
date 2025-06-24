/*
 Controla la apertura, cierre y navegación de imágenes en los modales de productos en la página de inicio. Incluye eventos para botones, clics fuera del modal y la tecla ESC.
*/

function openProductModal(id) {
    const modal = document.getElementById(`modal-${id}`);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeProductModal(id) {
    const modal = document.getElementById(`modal-${id}`);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function navigateModalImage(productId, direction) {
    const modal = document.getElementById(`modal-${productId}`);
    if (!modal) return;
    const img = modal.querySelector('.modal-product-image');
    if (!img) return;
    const currentIndex = parseInt(img.dataset.currentImage || 0);
    const images = [{"url": img.src}]; // Por ahora solo usamos la imagen principal
    const totalImages = images.length;
    let newIndex;
    if (direction === 'next') {
        newIndex = (currentIndex + 1) % totalImages;
    } else {
        newIndex = (currentIndex - 1 + totalImages) % totalImages;
    }
    img.src = images[newIndex].url;
    img.dataset.currentImage = newIndex;
}

document.addEventListener('DOMContentLoaded', function() {
    // Manejar clics en los botones "Ver Producto"
    document.querySelectorAll('.slide-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.getAttribute('data-product-id');
            openProductModal(productId);
        });
    });

    // Configurar eventos de cierre para todos los modales
    document.querySelectorAll('.product-modal').forEach(modal => {
        // Cerrar al hacer clic en el botón de cerrar
        const closeButton = modal.querySelector('.close-modal');
        if (closeButton) {
            closeButton.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = modal.id.split('-')[1];
                closeProductModal(productId);
            });
        }
        // Cerrar al hacer clic fuera del contenido
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                const productId = modal.id.split('-')[1];
                closeProductModal(productId);
            }
        });
    });

    // Cerrar modal con la tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.product-modal.active');
            if (activeModal) {
                const productId = activeModal.id.split('-')[1];
                closeProductModal(productId);
            }
        }
    });
}); 