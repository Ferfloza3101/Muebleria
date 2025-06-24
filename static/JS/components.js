/**
 * Componentes Globales JavaScript
 * Funciones y componentes reutilizables para toda la aplicación
 */

//funciones de modal
window.ModalManager = {
 
    open: function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            Utils.dispatchEvent(CONSTANTS.EVENTS.MODAL_OPENED, { modalId });
        }
    },


    close: function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            Utils.dispatchEvent(CONSTANTS.EVENTS.MODAL_CLOSED, { modalId });
        }
    },

    closeAll: function() {
        const modals = document.querySelectorAll('.product-modal, .modal-overlay');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = 'auto';
    },

    init: function() {
        // Cerrar modal al hacer click fuera
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('product-modal') || e.target.classList.contains('modal-overlay')) {
                ModalManager.closeAll();
            }
        });

        // Cerrar modal con Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                ModalManager.closeAll();
            }
        });

        // Botones de cerrar modal
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('close-modal') || e.target.classList.contains('modal-close')) {
                const modal = e.target.closest('.product-modal, .modal-overlay');
                if (modal) {
                    ModalManager.close(modal.id);
                }
            }
        });
    }
};

// Carrusel
window.CarouselManager = {
  
    init: function(containerId, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const defaultOptions = {
            autoPlay: true,
            interval: 5000,
            showArrows: true,
            showDots: true
        };

        const config = { ...defaultOptions, ...options };
        const images = container.querySelectorAll('img[data-images]');
        
        images.forEach(img => {
            const imagesData = JSON.parse(img.dataset.images || '[]');
            if (imagesData.length > 1) {
                this.setupCarousel(img, imagesData, config);
            }
        });
    },

    // Configurar carrusel individual
    setupCarousel: function(imgElement, images, config) {
        let currentIndex = 0;
        const dotsContainer = imgElement.parentElement.querySelector('.image-dots');
        
        // Crear dots si no existen
        if (config.showDots && dotsContainer && dotsContainer.children.length === 0) {
            images.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.className = `dot${index === 0 ? ' active' : ''}`;
                dot.onclick = () => this.goToImage(imgElement, images, index);
                dotsContainer.appendChild(dot);
            });
        }

        // Configurar flechas
        const prevArrow = imgElement.parentElement.querySelector('.prev-arrow');
        const nextArrow = imgElement.parentElement.querySelector('.next-arrow');
        
        if (prevArrow) {
            prevArrow.onclick = (e) => {
                e.stopPropagation();
                this.navigateImage(imgElement, images, -1);
            };
        }
        
        if (nextArrow) {
            nextArrow.onclick = (e) => {
                e.stopPropagation();
                this.navigateImage(imgElement, images, 1);
            };
        }

        // Auto-play
        if (config.autoPlay) {
            setInterval(() => {
                this.navigateImage(imgElement, images, 1);
            }, config.interval);
        }
    },

    // Navegar a la siguiente/anterior imagen
    navigateImage: function(imgElement, images, direction) {
        let currentIndex = parseInt(imgElement.dataset.currentImage || 0);
        currentIndex = (currentIndex + direction + images.length) % images.length;
        this.goToImage(imgElement, images, currentIndex);
    },

    // Ir a una imagen específica
    goToImage: function(imgElement, images, index) {
        if (index >= 0 && index < images.length) {
            imgElement.src = images[index].url;
            imgElement.dataset.currentImage = index;
            
            // Actualizar dots
            const dotsContainer = imgElement.parentElement.querySelector('.image-dots');
            if (dotsContainer) {
                const dots = dotsContainer.querySelectorAll('.dot');
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
            }
        }
    }
};

// Funciones de formularios
window.FormManager = {
    // Validar formulario
    validate: function(formElement) {
        const inputs = formElement.querySelectorAll('input[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                this.showError(input, 'Este campo es requerido');
                isValid = false;
            } else {
                this.clearError(input);
            }
        });

        return isValid;
    },

    // Mostrar error en un campo
    showError: function(input, message) {
        this.clearError(input);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#c62828';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '4px';
        
        input.parentNode.appendChild(errorDiv);
        input.style.borderColor = '#c62828';
    },

    // Limpiar error de un campo
    clearError: function(input) {
        const existingError = input.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        input.style.borderColor = '';
    },

    // Inicializar validación de formularios
    init: function() {
        document.addEventListener('submit', function(e) {
            if (e.target.tagName === 'FORM') {
                if (!FormManager.validate(e.target)) {
                    e.preventDefault();
                }
            }
        });
    }
};

// Funciones de animación
window.AnimationManager = {
    // Añadir animación pop a un elemento
    addPopAnimation: function(element, className = 'pop') {
        element.classList.add(className);
        setTimeout(() => {
            element.classList.remove(className);
        }, 350);
    },

    fadeIn: function(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = Math.min(progress / duration, 1);
            
            element.style.opacity = opacity;
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    },

    fadeOut: function(element, duration = 300) {
        let start = null;
        const initialOpacity = parseFloat(getComputedStyle(element).opacity);
        
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = Math.max(initialOpacity - (progress / duration), 0);
            
            element.style.opacity = opacity;
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        };
        
        requestAnimationFrame(animate);
    }
};

// Funciones de API
window.ApiManager = {
    // Obtener el token CSRF
    getCSRFToken: function() {
        const meta = document.querySelector('meta[name="csrf-token"]');
        return meta ? meta.getAttribute('content') : '';
    },

    // Realizar una petición fetch con configuración estándar
    request: function(url, options = {}) {
        const defaultOptions = {
            method: 'GET',
            headers: {
                'X-CSRFToken': this.getCSRFToken(),
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json'
            }
        };

        const config = { ...defaultOptions, ...options };

        return fetch(url, config)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .catch(error => {
                Utils.handleError(error, 'API request');
                throw error;
            });
    },

    // POST request
    post: function(url, data = {}) {
        return this.request(url, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    // GET request
    get: function(url) {
        return this.request(url, {
            method: 'GET'
        });
    }
};

// Funciones de productos
window.ProductManager = {
    // Añadir producto al carrito
    addToCart: function(productId, quantity = 1) {
        return ApiManager.post(`/productos/carrito/add/${productId}/`, { cantidad: quantity })
            .then(response => {
                Utils.showNotification(CONSTANTS.MESSAGES.SUCCESS.CART_ADDED, 'success');
                Utils.dispatchEvent(CONSTANTS.EVENTS.CART_UPDATED, response);
                return response;
            });
    },

    // Añadir producto a favoritos
    addToWishlist: function(productId) {
        return ApiManager.post(`/productos/wishlist/add/${productId}/`)
            .then(response => {
                Utils.showNotification(CONSTANTS.MESSAGES.SUCCESS.WISHLIST_ADDED, 'success');
                Utils.dispatchEvent(CONSTANTS.EVENTS.WISHLIST_UPDATED, response);
                return response;
            });
    },

    // Remover producto del carrito
    removeFromCart: function(productId) {
        return ApiManager.post(`/productos/carrito/remove/${productId}/`)
            .then(response => {
                Utils.showNotification(CONSTANTS.MESSAGES.SUCCESS.CART_REMOVED, 'success');
                Utils.dispatchEvent(CONSTANTS.EVENTS.CART_UPDATED, response);
                return response;
            });
    },

    // Remover producto de favoritos
    removeFromWishlist: function(productId) {
        return ApiManager.post(`/productos/wishlist/remove/${productId}/`)
            .then(response => {
                Utils.showNotification(CONSTANTS.MESSAGES.SUCCESS.WISHLIST_REMOVED, 'success');
                Utils.dispatchEvent(CONSTANTS.EVENTS.WISHLIST_UPDATED, response);
                return response;
            });
    }
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar componentes
    ModalManager.init();
    FormManager.init();
    
    // Configurar eventos globales de productos
    document.addEventListener('click', function(e) {
        // Botones de carrito
        if (e.target.closest('.cart-btn, .modal-cart-btn')) {
            e.preventDefault();
            e.stopPropagation();
            
            const button = e.target.closest('.cart-btn, .modal-cart-btn');
            const productId = button.dataset.productId;
            
            if (productId) {
                AnimationManager.addPopAnimation(button);
                ProductManager.addToCart(productId);
            }
        }
        
        // Botones de wishlist
        if (e.target.closest('.wishlist-btn, .modal-wishlist-btn')) {
            e.preventDefault();
            e.stopPropagation();
            
            const button = e.target.closest('.wishlist-btn, .modal-wishlist-btn');
            const productId = button.dataset.productId;
            
            if (productId) {
                AnimationManager.addPopAnimation(button);
                
                if (button.classList.contains('active')) {
                    ProductManager.removeFromWishlist(productId);
                } else {
                    ProductManager.addToWishlist(productId);
                }
            }
        }
        
        // Botones de modal
        if (e.target.closest('.open-modal-btn')) {
            e.preventDefault();
            const button = e.target.closest('.open-modal-btn');
            const productId = button.dataset.productId;
            
            if (productId) {
                ModalManager.open(`modal-${productId}`);
            }
        }
    });
}); 