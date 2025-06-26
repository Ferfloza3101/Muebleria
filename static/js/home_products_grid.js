/** JavaScript para el grid de productos de la página de inicio*/

document.addEventListener('DOMContentLoaded', function() {
    // Función para agregar efectos de hover a las tarjetas
    function addHoverEffects() {
        const cards = document.querySelectorAll('.home-product-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.02)';
                this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            });
        });
    }

    // Función para agregar eventos de clic a las tarjetas de producto (abrir modal)
    function addModalOpenEvents() {
        document.querySelectorAll('.open-modal-btn').forEach(card => {
            card.addEventListener('click', function(e) {
                const productId = this.dataset.productId;
                if (productId) {
                    // Abrir modal del producto
                    if (typeof openProductModal === 'function') {
                        openProductModal(productId);
                    } else if (typeof openProductModalGlobal === 'function') {
                        openProductModalGlobal(productId);
                    }
                }
            });
        });
    }

    // Función para hacer el grid responsive
    function makeGridResponsive() {
        const grid = document.querySelector('.home-products-grid');
        if (!grid) return;

        function updateGridLayout() {
            const width = window.innerWidth;
            
            if (width <= 768) {
                grid.style.gridTemplateColumns = '1fr';
                grid.style.gridTemplateRows = 'repeat(8, 250px)';
            } else if (width <= 1200) {
                grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
                grid.style.gridTemplateRows = 'repeat(4, 300px)';
            } else {
                grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
                grid.style.gridTemplateRows = 'repeat(2, 350px)';
            }
        }
        updateGridLayout();
        window.addEventListener('resize', updateGridLayout);
    }

    function addSmoothTransitions() {
        const cards = document.querySelectorAll('.home-product-card');
        
        cards.forEach(card => {
            const img = card.querySelector('img');
            if (img) {
                img.addEventListener('mouseenter', function() {
                    this.style.transform = 'scale(1.05)';
                });
                
                img.addEventListener('mouseleave', function() {
                    this.style.transform = 'scale(1)';
                });
            }
        });
    }

    // Inicializar funcionalidades
    function init() {
        // Agregar efectos de hover
        addHoverEffects();
        
        // Agregar eventos de clic SOLO a las tarjetas de producto con modal
        addModalOpenEvents();
        
        // Hacer el grid responsive
        makeGridResponsive();
        
        // Agregar transiciones
        addSmoothTransitions();
    }

    // Iniciar cuando el DOM esté listo
    init();
});

// Función global para abrir modales (compatible con el sistema existente)
function openProductModalGlobal(productId) {
    // Usar el modal 
    if (typeof openProductModal === 'function') {
        openProductModal(productId);
    } else {
        window.location.href = `/productos/detalle/${productId}/`;
    }
}
