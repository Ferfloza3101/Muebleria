/**
 * Archivo principal de JavaScript
 * Organiza y carga todos los scripts necesarios para el proyecto
 */

// Esperar a que se cargue la configuración
document.addEventListener('DOMContentLoaded', function() {
    // Verificar que la configuración esté disponible
    if (typeof Utils === 'undefined') {
        console.error('Error: Utils no está disponible. Asegúrate de cargar config.js antes que main.js');
        return;
    }
    
    Utils.log('Inicializando aplicación...');
    
    try {
        // Inicializar módulos en orden
        initializeApplication();
        
    } catch (error) {
        Utils.handleError(error, 'inicialización de la aplicación');
    }
});

/**
 * Inicializa todos los módulos de la aplicación
 */
function initializeApplication() {
    // 1. Inicializar funcionalidad base
    initializeBase();
    
    // 2. Inicializar navegación
    initializeNavigation();
    
    // 3. Inicializar productos
    initializeProducts();
    
    // 4. Inicializar eventos globales
    initializeGlobalEvents();
    
    Utils.log('Aplicación inicializada correctamente');
}

/**
 * Inicializa la funcionalidad base
 */
function initializeBase() {
    Utils.log('Inicializando funcionalidad base...');
    
    // Verificar si las funciones base están disponibles
    if (typeof initializeDropdowns === 'function') {
        initializeDropdowns();
    }
    
    if (typeof initializeSearch === 'function') {
        initializeSearch();
    }
    
    if (typeof initializeModal === 'function') {
        initializeModal();
    }
}

/**
 * Inicializa la navegación
 */
function initializeNavigation() {
    Utils.log('Inicializando navegación...');
    
    // Verificar si las funciones de navegación están disponibles
    if (typeof initializeNav === 'function') {
        initializeNav();
    }
}

/**
 * Inicializa la funcionalidad de productos
 */
function initializeProducts() {
    Utils.log('Inicializando productos...');
    
    // Verificar si las funciones de productos están disponibles
    if (typeof initializeProductModal === 'function') {
        initializeProductModal();
    }
    
    if (typeof initializeCart === 'function') {
        initializeCart();
    }
    
    if (typeof initializeWishlist === 'function') {
        initializeWishlist();
    }
}

/**
 * Inicializa eventos globales
 */
function initializeGlobalEvents() {
    Utils.log('Inicializando eventos globales...');
    
    // Evento de actualización del carrito
    document.addEventListener(CONSTANTS.EVENTS.CART_UPDATED, function(event) {
        Utils.log('Carrito actualizado', event.detail);
        updateCartBadge(event.detail.count || 0);
    });
    
    // Evento de actualización de favoritos
    document.addEventListener(CONSTANTS.EVENTS.WISHLIST_UPDATED, function(event) {
        Utils.log('Favoritos actualizados', event.detail);
        updateWishlistBadge(event.detail.count || 0);
    });
    
    // Evento de apertura de modal
    document.addEventListener(CONSTANTS.EVENTS.MODAL_OPENED, function(event) {
        Utils.log('Modal abierto', event.detail);
    });
    
    // Evento de cierre de modal
    document.addEventListener(CONSTANTS.EVENTS.MODAL_CLOSED, function(event) {
        Utils.log('Modal cerrado', event.detail);
    });
    
    // Evento de búsqueda
    document.addEventListener(CONSTANTS.EVENTS.SEARCH_PERFORMED, function(event) {
        Utils.log('Búsqueda realizada', event.detail);
    });
    
    // Manejo de errores global
    window.addEventListener('error', function(event) {
        Utils.handleError(event.error, 'error global');
    });
    
    // Manejo de promesas rechazadas
    window.addEventListener('unhandledrejection', function(event) {
        Utils.handleError(event.reason, 'promesa rechazada');
    });
    
    // Manejo de cambios de tamaño de ventana
    const debouncedResize = Utils.debounce(function() {
        Utils.dispatchEvent('window:resized', {
            width: window.innerWidth,
            height: window.innerHeight,
            isMobile: Utils.isMobile(),
            isTablet: Utils.isTablet(),
            isDesktop: Utils.isDesktop()
        });
    }, 250);
    
    window.addEventListener('resize', debouncedResize);
}

/**
 * Actualiza el badge del carrito
 */
function updateCartBadge(count) {
    const badge = Utils.getElement(APP_CONFIG.selectors.cartBadge);
    if (badge) {
        if (count > 0) {
            badge.textContent = count;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

/**
 * Actualiza el badge de favoritos
 */
function updateWishlistBadge(count) {
    const badge = Utils.getElement(APP_CONFIG.selectors.wishlistBadge);
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
window.AppInitializer = {
    initializeApplication,
    initializeBase,
    initializeNavigation,
    initializeProducts,
    initializeGlobalEvents,
    updateCartBadge,
    updateWishlistBadge
}; 