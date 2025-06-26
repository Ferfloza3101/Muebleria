
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.perfil-dashboard__acceso').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const section = document.querySelector(href);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    
    const accesos = document.querySelectorAll('.perfil-dashboard__acceso');
    accesos.forEach(link => {
        link.addEventListener('click', function() {
            accesos.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    const sidebar = document.getElementById('perfilSidebar');
    const toggle = document.getElementById('perfilDrawerToggle');
    const overlay = document.getElementById('perfilDrawerOverlay');
    const links = document.querySelectorAll('.perfil-sidebar__link');
    const sectionViews = document.querySelectorAll('.perfil-section-view');

    function openDrawer() {
        sidebar.classList.add('open');
        overlay.style.display = 'block';
    }
    function closeDrawer() {
        sidebar.classList.remove('open');
        overlay.style.display = 'none';
    }
    if (toggle) {
        toggle.addEventListener('click', openDrawer);
    }
    if (overlay) {
        overlay.addEventListener('click', closeDrawer);
    }
    // Cerrar drawer al hacer clic en un link
    links.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 700) closeDrawer();
        });
    });

    // SPA: mostrar solo la sección seleccionada
    function showSection(section) {
        sectionViews.forEach(view => {
            view.classList.remove('active');
        });
        const target = document.getElementById('view-' + section);
        if (target) target.classList.add('active');
        // Resaltar link activo
        links.forEach(link => {
            if (link.dataset.section === section) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    function getSectionFromHash() {
        const hash = window.location.hash.replace('#', '');
        const valid = ['info-personal','pedidos','direcciones','metodos-pago','seguridad','contacto'];
        return valid.includes(hash) ? hash : 'info-personal';
    }
    function handleHashChange() {
        showSection(getSectionFromHash());
    }
    window.addEventListener('hashchange', handleHashChange);
    showSection(getSectionFromHash());


    const formDireccion = document.getElementById('form-direccion');
    const listaDirecciones = document.getElementById('direcciones-lista');
    const exitoDireccion = document.getElementById('direccion-exito');
    let direcciones = [];
    if (formDireccion) {
        formDireccion.addEventListener('submit', function(e) {
            e.preventDefault();
            const data = {
                nombre: formDireccion['nombre'].value,
                calle: formDireccion['calle'].value,
                numero: formDireccion['numero'].value,
                colonia: formDireccion['colonia'].value,
                ciudad: formDireccion['ciudad'].value,
                estado: formDireccion['estado'].value,
                cp: formDireccion['cp'].value,
                telefono: formDireccion['telefono'].value
            };
            direcciones.push(data);
            renderDirecciones();
            formDireccion.reset();
            exitoDireccion.style.display = 'block';
            setTimeout(() => { exitoDireccion.style.display = 'none'; }, 1800);
        });
    }
    function renderDirecciones() {
        if (!listaDirecciones) return;
        if (direcciones.length === 0) {
            listaDirecciones.innerHTML = '<div class="perfil-placeholder">No tienes direcciones guardadas.</div>';
        } else {
            listaDirecciones.innerHTML = direcciones.map(dir => `
                <div class="perfil-placeholder" style="background:#f7f7f7; color:#222; text-align:left; margin-bottom:10px;">
                    <strong>${dir.nombre}</strong><br>
                    ${dir.calle} #${dir.numero}, ${dir.colonia}<br>
                    ${dir.ciudad}, ${dir.estado}, CP ${dir.cp}<br>
                    Tel: ${dir.telefono}
                </div>
            `).join('');
        }
    }

    const formPago = document.getElementById('form-pago');
    const listaPagos = document.getElementById('pagos-lista');
    const exitoPago = document.getElementById('pago-exito');
    let pagos = [];
    if (formPago) {
        formPago.addEventListener('submit', function(e) {
            e.preventDefault();
            const data = {
                nombre: formPago['nombre'].value,
                numero: formPago['numero'].value.replace(/\s+/g, '').replace(/(\d{4})(?=\d)/g, '$1 '),
                vencimiento: formPago['vencimiento'].value,
                cvc: formPago['cvc'].value
            };
            pagos.push(data);
            renderPagos();
            formPago.reset();
            exitoPago.style.display = 'block';
            setTimeout(() => { exitoPago.style.display = 'none'; }, 1800);
        });
    }
    function renderPagos() {
        if (!listaPagos) return;
        if (pagos.length === 0) {
            listaPagos.innerHTML = '<div class="perfil-placeholder">No tienes métodos de pago guardados.</div>';
        } else {
            listaPagos.innerHTML = pagos.map(pago => `
                <div class="perfil-placeholder" style="background:#f7f7f7; color:#222; text-align:left; margin-bottom:10px;">
                    <strong>${pago.nombre}</strong><br>
                    **** **** **** ${pago.numero.slice(-4)}<br>
                    Vence: ${pago.vencimiento}
                </div>
            `).join('');
        }
    }
}); 