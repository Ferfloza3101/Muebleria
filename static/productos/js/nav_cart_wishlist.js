/*Controla la interacción de los menús de favoritos (wishlist), carrito y barra de búsqueda en la navegación principal.*/

document.addEventListener('DOMContentLoaded', function() {
  // Wishlist
  const favDropdown = document.getElementById('wishlistDropdown');
  const dropdownMenu = favDropdown ? favDropdown.querySelector('.dropdown-wishlist') : null;
  let favMenuHover = false;
  if (favDropdown && dropdownMenu) {
    function openMenu() { favDropdown.classList.add('active'); }
    function closeMenu() { favDropdown.classList.remove('active'); }
    favDropdown.addEventListener('mouseenter', openMenu);
    favDropdown.addEventListener('mouseleave', function() {
      setTimeout(() => { if (!favMenuHover) closeMenu(); }, 80);
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
  // Carrito
  const cartDropdown = document.getElementById('cartDropdown');
  const cartMenu = cartDropdown ? cartDropdown.querySelector('.dropdown-cart') : null;
  let cartMenuHover = false;
  if (cartDropdown && cartMenu) {
    function openCartMenu() { cartDropdown.classList.add('active'); }
    function closeCartMenu() { cartDropdown.classList.remove('active'); }
    cartDropdown.addEventListener('mouseenter', openCartMenu);
    cartDropdown.addEventListener('mouseleave', function() {
      setTimeout(() => { if (!cartMenuHover) closeCartMenu(); }, 80);
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
  // Perfil
  const profileDropdown = document.getElementById('profileDropdown');
  const profileMenu = profileDropdown ? profileDropdown.querySelector('.dropdown-profile') : null;
  let profileMenuHover = false;
  if (profileDropdown && profileMenu) {
    function openProfileMenu() { profileDropdown.classList.add('active'); }
    function closeProfileMenu() { profileDropdown.classList.remove('active'); }
    profileDropdown.addEventListener('mouseenter', openProfileMenu);
    profileDropdown.addEventListener('mouseleave', function() {
      setTimeout(() => { if (!profileMenuHover) closeProfileMenu(); }, 80);
    });
    profileMenu.addEventListener('mouseenter', function() {
      profileMenuHover = true;
      openProfileMenu();
    });
    profileMenu.addEventListener('mouseleave', function() {
      profileMenuHover = false;
      closeProfileMenu();
    });
  }
  // Búsqueda
  const searchToggle = document.querySelector('.search-toggle');
  const searchForm = document.querySelector('.search-form');
  if (searchToggle && searchForm) {
    searchToggle.addEventListener('click', function(e) {
      e.preventDefault();
      if (searchForm.style.display === 'block') {
        searchForm.style.display = 'none';
      } else {
        searchForm.style.display = 'block';
        searchForm.querySelector('input').focus();
      }
    });
    // Cierra la barra si se hace click fuera
    document.addEventListener('click', function(e) {
      if (!searchForm.contains(e.target) && !searchToggle.contains(e.target)) {
        searchForm.style.display = 'none';
      }
    });
  }
  // Lógica para aumentar/disminuir cantidad en el menú de carrito
  document.querySelectorAll('.cart-qty-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const item = btn.closest('.cart-item-row');
      const cantidadSpan = item.querySelector('.cart-qty');
      const productoId = btn.dataset.productId;
      const action = btn.classList.contains('cart-qty-plus') ? 'increase' : 'decrease';
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
            } else {
              item.remove();
            }
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

  // Lógica para eliminar producto en el menú de carrito
  document.querySelectorAll('.cart-remove-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const item = btn.closest('.cart-item-row');
      const productoId = btn.dataset.productId;
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
        } else {
          alert(data.error || 'No se pudo eliminar el producto.');
        }
      })
      .catch(() => {
        alert('Error al eliminar el producto.');
      });
    });
  });

  // Lógica para vaciar carrito en el menú de carrito
  const vaciarBtn = document.querySelector('.cart-clear-btn');
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
          document.querySelectorAll('.cart-item-row').forEach(item => item.remove());
        } else {
          alert('No se pudo vaciar el carrito.');
        }
      })
      .catch(() => {
        alert('Error al vaciar el carrito.');
      });
    });
  }
});

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