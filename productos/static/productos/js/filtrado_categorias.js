document.addEventListener('DOMContentLoaded', function() {
    const categorias = document.querySelectorAll('.categorias-list a');
    const gridContainer = document.getElementById('productos-grid-container');
    let categoriaActual = '';

    function filtrarProductos(categoria) {
        const params = new URLSearchParams();
        if (categoria) params.append('categoria', categoria);
        fetch('/productos/filtrar/?' + params.toString(), {
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        })
        .then(response => response.json())
        .then(data => {
            gridContainer.innerHTML = data.html;
        });
    }

    categorias.forEach(cat => {
        cat.addEventListener('click', function(e) {
            e.preventDefault();
            categorias.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            categoriaActual = this.dataset.categoria || '';
            filtrarProductos(categoriaActual);
        });
    });
}); 