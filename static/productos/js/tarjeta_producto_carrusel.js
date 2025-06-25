/*
Lógica para el carrusel de imágenes en las tarjetas de producto y modales, usando todas las imágenes adicionales del producto.
*/

document.addEventListener('DOMContentLoaded', function() {
    // Carrusel en tarjetas de producto
    document.querySelectorAll('.product-card .product-image').forEach(function(img) {
        const images = JSON.parse(img.getAttribute('data-images'));
        let current = 0;
        const wrapper = img.closest('.product-image-wrapper');
        const dotsContainer = wrapper.parentElement.querySelector('.image-dots');
        if (!dotsContainer) return;
        // Generar dots
        dotsContainer.innerHTML = '';
        images.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', function(e) {
                e.stopPropagation();
                current = i;
                updateImage();
            });
            dotsContainer.appendChild(dot);
        });
        // Flechas
        const prev = wrapper.querySelector('.prev-arrow');
        const next = wrapper.querySelector('.next-arrow');
        if (prev && next) {
            prev.addEventListener('click', function(e) {
                e.stopPropagation();
                current = (current - 1 + images.length) % images.length;
                updateImage();
            });
            next.addEventListener('click', function(e) {
                e.stopPropagation();
                current = (current + 1) % images.length;
                updateImage();
            });
        }
        function updateImage() {
            img.src = images[current].url;
            img.setAttribute('data-current-image', current);
            dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === current);
            });
        }
    });

    // Carrusel en modales de producto
    document.querySelectorAll('.modal-product-image').forEach(function(img) {
        const images = JSON.parse(img.getAttribute('data-images'));
        let current = 0;
        const wrapper = img.closest('.modal-image-wrapper');
        const dotsContainer = wrapper.parentElement.querySelector('.modal-image-dots');
        if (!dotsContainer) return;
        // Generar dots
        dotsContainer.innerHTML = '';
        images.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.className = 'modal-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', function(e) {
                e.stopPropagation();
                current = i;
                updateImage();
            });
            dotsContainer.appendChild(dot);
        });
        // Flechas
        const prev = wrapper.querySelector('.prev-arrow');
        const next = wrapper.querySelector('.next-arrow');
        if (prev && next) {
            prev.addEventListener('click', function(e) {
                e.stopPropagation();
                current = (current - 1 + images.length) % images.length;
                updateImage();
            });
            next.addEventListener('click', function(e) {
                e.stopPropagation();
                current = (current + 1) % images.length;
                updateImage();
            });
        }
        function updateImage() {
            img.src = images[current].url;
            img.setAttribute('data-current-image', current);
            dotsContainer.querySelectorAll('.modal-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === current);
            });
        }
    });
}); 