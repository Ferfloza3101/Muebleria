document.querySelectorAll('.product-card').forEach(card => {
  const imgEl   = card.querySelector('.product-image');
  const prev    = card.querySelector('.prev-arrow');
  const next    = card.querySelector('.next-arrow');
  const dots    = Array.from(card.querySelectorAll('.dot'));
  const images  = JSON.parse(card.dataset.images); // [{url:...},…]
  let current   = 0;

  function render() {
    imgEl.classList.add('fade');
    setTimeout(() => {
      imgEl.src = images[current].url;
      dots.forEach((d,i) => d.classList.toggle('active', i===current));
      imgEl.classList.remove('fade');
    }, 200);
  }

  prev.addEventListener('click', () => {
    current = (current - 1 + images.length) % images.length;
    render();
  });
  next.addEventListener('click', () => {
    current = (current + 1) % images.length;
    render();
  });
  dots.forEach((d,i) => d.addEventListener('click', () => {
    current = i;
    render();
  }));

  render();
});

// Función para abrir el modal del producto
function openProductModal(productId) {
    const modal = document.getElementById(`product-modal-${productId}`);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Previene el scroll del body
        initializeModalGallery(productId);
    }
}

// Función para cerrar el modal
function closeProductModal(productId) {
    const modal = document.getElementById(`product-modal-${productId}`);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restaura el scroll del body
    }
}

// Inicializar todos los modales
document.addEventListener('DOMContentLoaded', function() {
    // Agregar event listeners para cerrar modales
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.product-modal');
            const productId = modal.id.split('-').pop();
            closeProductModal(productId);
        });
    });

    // Cerrar modal al hacer clic fuera del contenido
    document.querySelectorAll('.product-modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                const productId = this.id.split('-').pop();
                closeProductModal(productId);
            }
        });
    });

    // Cerrar modal con la tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.product-modal').forEach(modal => {
                if (modal.style.display === 'block') {
                    const productId = modal.id.split('-').pop();
                    closeProductModal(productId);
                }
            });
        }
    });
});

// Función para inicializar la galería de imágenes en el modal
function initializeModalGallery(productId) {
    const modal = document.getElementById(`product-modal-${productId}`);
    if (!modal) return;

    const imageWrapper = modal.querySelector('.modal-image-wrapper');
    const image = modal.querySelector('.modal-product-image');
    const dots = modal.querySelectorAll('.modal-dot');
    const prevArrow = modal.querySelector('.prev-arrow');
    const nextArrow = modal.querySelector('.next-arrow');
    
    let currentImageIndex = 0;
    const images = JSON.parse(modal.closest('.product-card').dataset.images);

    // Función para actualizar la imagen
    function updateImage(index) {
        image.src = images[index].url;
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        currentImageIndex = index;
    }

    // Event listeners para las flechas
    if (prevArrow) {
        prevArrow.addEventListener('click', (e) => {
            e.stopPropagation();
            const newIndex = (currentImageIndex - 1 + images.length) % images.length;
            updateImage(newIndex);
        });
    }

    if (nextArrow) {
        nextArrow.addEventListener('click', (e) => {
            e.stopPropagation();
            const newIndex = (currentImageIndex + 1) % images.length;
            updateImage(newIndex);
        });
    }

    // Event listeners para los dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', (e) => {
            e.stopPropagation();
            updateImage(index);
        });
    });

    // Inicializar con la primera imagen
    updateImage(0);
}

// Prevenir que los clics en los botones de acción propaguen al modal
document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}); 