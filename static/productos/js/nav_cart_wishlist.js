/*
 Controla la interacción de los menús de favoritos (wishlist), carrito y barra de búsqueda en la navegación principal. Incluye eventos de hover, clic y cierre automático.
*/

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
  // Función para obtener el CSRF token desde meta
  function getCSRFToken() {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? meta.getAttribute('content') : '';
  }
  // Lógica para los botones + y - del carrito
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('cart-qty-plus')) {
      e.preventDefault();
      const productId = e.target.getAttribute('data-product-id');
      fetch(`/productos/carrito/add/${productId}/`, {
        method: 'POST',
        headers: {
          'X-CSRFToken': getCSRFToken(),
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: new URLSearchParams({cantidad: 1})
      })
      .then(r => r.json())
      .then(() => recargarCarritoMenu());
    }
    if (e.target.classList.contains('cart-qty-minus')) {
      e.preventDefault();
      const productId = e.target.getAttribute('data-product-id');
      fetch(`/productos/carrito/decrease/${productId}/`, {
        method: 'POST',
        headers: {
          'X-CSRFToken': getCSRFToken(),
          'X-Requested-With': 'XMLHttpRequest',
        }
      })
      .then(r => r.json())
      .then(() => recargarCarritoMenu());
    }
  });

  function recargarCarritoMenu() {
    fetch('/productos/carrito/menu/')
      .then(r => r.text())
      .then(html => {
        const cartMenu = document.querySelector('.dropdown-cart');
        if (cartMenu) cartMenu.innerHTML = html;
      });
  }
}); 