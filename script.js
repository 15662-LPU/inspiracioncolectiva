const cvProfileData = {
    source: "assets/docs/gilberto-valenzuela-cv.pdf",
    updated: "2026-06-23",
    contact: {
        whatsapp: ""
    },
    sections: [
        {
            title: "Formación",
            items: [
                "Médico cirujano con trayectoria aplicada a salud universitaria.",
                "Doctorando en Trabajo Social por la Universitat Rovira i Virgili.",
                "Docente universitario vinculado a economía social, salud y acción colectiva."
            ]
        },
        {
            title: "Experiencia",
            items: [
                "Gestión de innovación en salud universitaria en la UAGro.",
                "Diseño de programas educativos virtuales y microcredenciales.",
                "Desarrollo de plataformas digitales para servicios universitarios."
            ]
        },
        {
            title: "Logros",
            items: [
                "Impulso de rutas de formación en cultura de donación de órganos y tejidos.",
                "Articulación de proyectos comunitarios, tecnológicos y académicos.",
                "Construcción de evidencias digitales para toma de decisiones institucionales."
            ]
        },
        {
            title: "Publicaciones y producción",
            items: [
                "Investigación aplicada en salud, economía social y trabajo social de la emergencia.",
                "Producción sonora y etnográfica para memoria comunitaria.",
                "Divulgación educativa mediante proyectos digitales y narrativas públicas."
            ]
        },
        {
            title: "Reconocimientos y alianzas",
            items: [
                "Vinculación con UAGro, CENATRA, REDESSGRO y proyectos comunitarios.",
                "Participación en redes académicas y de innovación social.",
                "Perfil orientado a colaboración interinstitucional."
            ]
        }
    ]
};

const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const setupNavigation = () => {
    const toggle = qs("#mobile-menu");
    const nav = qs("#primary-nav") || qs("nav");
    const links = qsa(".nav-links a");

    if (!toggle || !nav) return;

    const closeMenu = () => {
        nav.classList.remove("is-open");
        qs(".nav-links")?.classList.remove("active");
        document.body.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("is-open");
        qs(".nav-links")?.classList.toggle("active", isOpen);
        document.body.classList.toggle("menu-open", isOpen);
        toggle.setAttribute("aria-expanded", String(isOpen));
    });

    links.forEach((link) => {
        link.addEventListener("click", () => closeMenu());
    });
};

const setupReveal = () => {
    const elements = qsa(".reveal, .card, .project-card, .kpi-card");

    if (!("IntersectionObserver" in window)) {
        elements.forEach((element) => element.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.14 }
    );

    elements.forEach((element) => observer.observe(element));
};

const animateKpis = () => {
    const counters = qsa("[data-count]");
    if (!counters.length) return;

    const runCounter = (counter) => {
        const target = Number(counter.dataset.count || 0);
        const duration = 900;
        const start = performance.now();

        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            counter.textContent = Math.round(target * progress);
            if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    runCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.65 }
    );

    counters.forEach((counter) => observer.observe(counter));
};

const hydrateCvSummary = () => {
    const target = qs("#cv-summary");
    const sourceNote = qs("#cv-source-note");
    if (!target) return;

    target.innerHTML = cvProfileData.sections
        .map((section) => {
            const items = section.items.map((item) => `<li>${item}</li>`).join("");
            return `
                <section class="summary-item">
                    <h4>${section.title}</h4>
                    <ul>${items}</ul>
                </section>
            `;
        })
        .join("");

    if (sourceNote) {
        sourceNote.textContent = `Fuente local: ${cvProfileData.source} · Actualización de datos: ${cvProfileData.updated}`;
    }
};

const setupContactForm = () => {
    const form = qs("#contact-form");
    const note = qs("#form-note");
    const whatsappLink = qs("[data-whatsapp-link]");

    if (whatsappLink && cvProfileData.contact.whatsapp) {
        whatsappLink.href = `https://wa.me/${cvProfileData.contact.whatsapp}`;
        whatsappLink.textContent = "WhatsApp institucional";
        whatsappLink.removeAttribute("aria-disabled");
        whatsappLink.setAttribute("target", "_blank");
        whatsappLink.setAttribute("rel", "noopener");
    } else if (whatsappLink) {
        whatsappLink.addEventListener("click", (event) => event.preventDefault());
    }

    if (!form || !note) return;

    form.addEventListener("submit", () => {
        note.textContent = "Se abrirá tu cliente de correo para enviar la solicitud.";
    });
};

const init = () => {
    setupNavigation();
    setupReveal();
    animateKpis();
    hydrateCvSummary();
    setupContactForm();
};

document.addEventListener("DOMContentLoaded", init);
