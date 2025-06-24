/**
 * Funcionalidad del template base.html
 * Maneja dropdowns, búsqueda y funcionalidad general de navegación
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeDropdowns();
    initializeSearch();
    initializeModal();
});

// Inicializar los dropdowns de favoritos y carrito
function initializeDropdowns() {
    // Dropdown de favoritos
    const favDropdown = document.getElementById('wishlistDropdown');
    const dropdownMenu = favDropdown ? favDropdown.querySelector('.dropdown-wishlist') : null;
    let favMenuHover = false;
    
    if (favDropdown && dropdownMenu) {
        function openMenu() { 
            favDropdown.classList.add('active'); 
        }
        
        function closeMenu() { 
            favDropdown.classList.remove('active'); 
        }
        
        favDropdown.addEventListener('mouseenter', openMenu);
        favDropdown.addEventListener('mouseleave', function() {
            setTimeout(() => { 
                if (!favMenuHover) closeMenu(); 
            }, 80);
        });
        
        dropdownMenu.addEventListener('mouseenter', function() {
            favMenuHover = true;
            openMenu();
        });
        
        dropdownMenu.addEventListener('mouseleave', function() {
            favMenuHover = false;
            closeMenu();
        });
    }
    
    // Dropdown del carrito
    const cartDropdown = document.getElementById('cartDropdown');
    const cartMenu = cartDropdown ? cartDropdown.querySelector('.dropdown-cart') : null;
    let cartMenuHover = false;
    
    if (cartDropdown && cartMenu) {
        function openCartMenu() { 
            cartDropdown.classList.add('active'); 
        }
        
        function closeCartMenu() { 
            cartDropdown.classList.remove('active'); 
        }
        
        cartDropdown.addEventListener('mouseenter', openCartMenu);
        cartDropdown.addEventListener('mouseleave', function() {
            setTimeout(() => { 
                if (!cartMenuHover) closeCartMenu(); 
            }, 80);
        });
        
        cartMenu.addEventListener('mouseenter', function() {
            cartMenuHover = true;
            openCartMenu();
        });
        
        cartMenu.addEventListener('mouseleave', function() {
            cartMenuHover = false;
            closeCartMenu();
        });
    }
}

// Inicializar la funcionalidad de búsqueda
function initializeSearch() {
    const searchToggle = document.querySelector('.search-toggle');
    const searchForm = document.querySelector('.search-form');
    
    if (searchToggle && searchForm) {
        searchToggle.addEventListener('click', function(e) {
            e.preventDefault();
            toggleSearchForm();
        });
        
        // Cierra la barra si se hace click fuera
        document.addEventListener('click', function(e) {
            if (!searchForm.contains(e.target) && !searchToggle.contains(e.target)) {
                searchForm.style.display = 'none';
            }
        });
        
        // Maneja el envío del formulario con Enter
        const searchInput = searchForm.querySelector('input');
        if (searchInput) {
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    searchForm.submit();
                }
            });
        }
    }
}

// Alternar la visibilidad del formulario de búsqueda
function toggleSearchForm() {
    const searchForm = document.querySelector('.search-form');
    if (searchForm.style.display === 'block') {
        searchForm.style.display = 'none';
    } else {
        searchForm.style.display = 'block';
        const input = searchForm.querySelector('input');
        if (input) {
            input.focus();
        }
    }
}

// Inicializar la funcionalidad del modal
function initializeModal() {
    const modal = document.getElementById('product-modal');
    const closeBtn = modal ? modal.querySelector('.close-modal') : null;
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            closeProductModal();
        });
    }
    
    // Cerrar modal al hacer click fuera
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeProductModal();
            }
        });
    }
    
    // Cerrar modal con Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeProductModal();
        }
    });
}

// Abrir el modal de productos
function openProductModal() {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Previene scroll
    }
}

// Cerrar el modal de productos
function closeProductModal() {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restaura scroll
        
        // Limpia el contenido del modal
        const contentWrapper = modal.querySelector('.modal-content-wrapper');
        if (contentWrapper) {
            contentWrapper.innerHTML = '';
        }
    }
}

// Mostrar el spinner de carga en el modal
function showModalSpinner() {
    const modal = document.getElementById('product-modal');
    if (modal) {
        const spinner = modal.querySelector('.loading-spinner');
        const contentWrapper = modal.querySelector('.modal-content-wrapper');
        
        if (spinner) spinner.style.display = 'block';
        if (contentWrapper) contentWrapper.innerHTML = '';
    }
}

// Ocultar el spinner de carga en el modal
function hideModalSpinner() {
    const modal = document.getElementById('product-modal');
    if (modal) {
        const spinner = modal.querySelector('.loading-spinner');
        if (spinner) spinner.style.display = 'none';
    }
}

// Actualizar el badge del carrito
function updateCartBadge(count) {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        if (count > 0) {
            badge.textContent = count;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

// Actualizar el badge de favoritos
function updateWishlistBadge(count) {
    const badge = document.getElementById('wishlist-badge');
    if (badge) {
        if (count > 0) {
            badge.textContent = count;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

    // Exportar funciones para uso en otros módulos
window.baseUtils = {
    openProductModal,
    closeProductModal,
    showModalSpinner,
    hideModalSpinner,
    updateCartBadge,
    updateWishlistBadge,
    toggleSearchForm
}; 