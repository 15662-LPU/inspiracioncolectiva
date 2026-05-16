// Mobile menu toggle
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Smooth scroll para links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        // Hide mobile menu on click
        if(navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }

        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animación de aparición (fade-in)
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.card, .timeline-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// Se aplica clase .visible desde JS
document.head.insertAdjacentHTML('beforeend', `
<style>
    .visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
</style>
`);

// Funcionalidad Espacio Colaborativo (Modales)
const colabBtns = document.querySelectorAll('.colab-btn');
const modal = document.getElementById('colab-modal');
const closeModal = document.querySelector('.close-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');

const colabContent = {
    muro: {
        title: "Muro de ideas",
        body: "<p>Un espacio interactivo donde los estudiantes pueden compartir lluvias de ideas, debates y reflexiones sobre la acción colectiva. <br><br><em>(Próximamente: Integración con padlets o pizarras interactivas de la asignatura)</em></p>"
    },
    bitacora: {
        title: "Bitácora colectiva",
        body: "<p>Registro colaborativo de las sesiones, aprendizajes y experiencias clave que compartimos durante el desarrollo de la asignatura. Un diario abierto a múltiples voces.</p>"
    },
    podcast: {
        title: "Podcast de la asignatura",
        body: "<p>Episodios y cápsulas de audio creadas, grabadas y editadas colaborativamente para debatir los textos y reflexionar sobre la economía social.</p>"
    },
    proyectos: {
        title: "Banco de proyectos",
        body: "<p>Repositorio de iniciativas de innovación y proyectos comunitarios diseñados por los estudiantes como resultado de la materia.</p>"
    },
    galeria: {
        title: "Galería de experiencias",
        body: "<p>Exposición virtual de fotografías, audios, evidencias de campo, carteles y testimonios del trabajo directo con colectivos, territorios y acción social construida desde el aula.</p>"
    }
};

if (colabBtns && modal) {
    colabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const type = btn.getAttribute('data-modal');
            if (colabContent[type]) {
                modalTitle.textContent = colabContent[type].title;
                modalBody.innerHTML = colabContent[type].body;
                modal.style.display = "flex";
            }
        });
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = "none";
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
}
