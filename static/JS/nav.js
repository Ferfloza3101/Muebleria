document.addEventListener("DOMContentLoaded", function() {
    const navbar = document.querySelector(".nav-center");
    let lastScrollTop = 0;

    // Función para manejar el scroll y fijar la barra de navegación
    window.addEventListener("scroll", function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Añadir clase fixed cuando hacemos scroll
        if (scrollTop > 50) {
            navbar.classList.add("fixed-nav");
        } else {
            navbar.classList.remove("fixed-nav");
        }
        
        lastScrollTop = scrollTop;
    });


    

    // Detectamos clic en los enlaces
    document.querySelector(".nav-center ul").addEventListener("click", function(event) {
        if (event.target.tagName === "A") {
            const href = event.target.getAttribute("href");
            // Solo previene el comportamiento por defecto para los anchors internos
            if (href.startsWith("#")) {
                event.preventDefault();
                let targetId = href.replace("#", "");
                if (targetId === "home") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                } else if (targetId === "contact") {
                    let contactSection = document.querySelector("#contact-section");
                    if (contactSection) {
                        contactSection.scrollIntoView({ behavior: "smooth" });
                    }
                }
                // Puedes agregar más casos para otros anchors internos si los necesitas 
            }
            // Si el href NO empieza con #, deja que el navegador siga el enlace normalmente
        }
    });
});
