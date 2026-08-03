const cvProfileData = {
    source: "assets/docs/gilberto-valenzuela-cv.pdf",
    updated: "2026-06-23",
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

const setupActiveNavigation = () => {
    const sectionLinks = qsa('.nav-links a[href^="#"], .mobile-bottom-nav a[href^="#"]');
    if (!sectionLinks.length || !("IntersectionObserver" in window)) return;

    const sections = sectionLinks
        .map((link) => qs(link.getAttribute("href")))
        .filter(Boolean);

    if (!sections.length) return;

    const setActive = (id) => {
        sectionLinks.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${id}`;
            link.classList.toggle("is-active", isActive);
            if (isActive) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    };

    const observer = new IntersectionObserver(
        (entries) => {
            const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (visible?.target?.id) setActive(visible.target.id);
        },
        { rootMargin: "-35% 0px -55% 0px", threshold: [0.12, 0.3, 0.6] }
    );

    sections.forEach((section) => observer.observe(section));
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

const setupActivityCarousel = () => {
    const carousel = qs("[data-carousel]");
    if (!carousel) return;

    const track = qs(".carousel-track", carousel);
    const slides = qsa(".carousel-slide", carousel);
    const prevButton = qs("[data-carousel-prev]", carousel);
    const nextButton = qs("[data-carousel-next]", carousel);
    const dotsTarget = qs("[data-carousel-dots]", carousel);
    const emptyState = qs(".carousel-empty", carousel);

    if (!track || !slides.length) {
        prevButton?.setAttribute("disabled", "true");
        nextButton?.setAttribute("disabled", "true");
        return;
    }

    emptyState?.setAttribute("hidden", "true");

    let currentIndex = 0;
    let autoplayId = null;
    let touchStartX = 0;
    const autoplayDelay = 6500;

    const stopAutoplay = () => {
        if (autoplayId) window.clearInterval(autoplayId);
        autoplayId = null;
    };

    const goToSlide = (index) => {
        currentIndex = (index + slides.length) % slides.length;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        slides.forEach((slide, slideIndex) => {
            slide.toggleAttribute("aria-hidden", slideIndex !== currentIndex);
        });

        qsa("button", dotsTarget).forEach((dot, dotIndex) => {
            dot.setAttribute("aria-current", String(dotIndex === currentIndex));
        });
    };

    const startAutoplay = () => {
        if (slides.length < 2) return;
        stopAutoplay();
        autoplayId = window.setInterval(() => goToSlide(currentIndex + 1), autoplayDelay);
    };

    slides.forEach((slide, index) => {
        slide.setAttribute("role", "group");
        slide.setAttribute("aria-roledescription", "diapositiva");
        slide.setAttribute("aria-label", `${index + 1} de ${slides.length}`);
    });

    if (dotsTarget) {
        dotsTarget.innerHTML = slides
            .map((_, index) => `<button type="button" aria-label="Ir a imagen ${index + 1}"></button>`)
            .join("");

        qsa("button", dotsTarget).forEach((dot, index) => {
            dot.addEventListener("click", () => {
                stopAutoplay();
                goToSlide(index);
            });
        });
    }

    prevButton?.removeAttribute("disabled");
    nextButton?.removeAttribute("disabled");

    prevButton?.addEventListener("click", () => {
        stopAutoplay();
        goToSlide(currentIndex - 1);
    });

    nextButton?.addEventListener("click", () => {
        stopAutoplay();
        goToSlide(currentIndex + 1);
    });

    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("focusin", stopAutoplay);
    carousel.addEventListener("touchstart", (event) => {
        touchStartX = event.touches[0]?.clientX || 0;
        stopAutoplay();
    }, { passive: true });

    carousel.addEventListener("touchend", (event) => {
        const touchEndX = event.changedTouches[0]?.clientX || 0;
        const delta = touchEndX - touchStartX;
        if (Math.abs(delta) > 45) goToSlide(currentIndex + (delta < 0 ? 1 : -1));
    });

    goToSlide(0);
    startAutoplay();
};

const setupMobileExecutiveUx = () => {
    document.body.classList.add("has-mobile-bottom-nav");

    const makeToggle = (expandedText = "Cerrar", collapsedText = "Ver mas") => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "mobile-summary-toggle";
        button.textContent = collapsedText;
        button.setAttribute("aria-expanded", "false");
        button.dataset.expandedText = expandedText;
        button.dataset.collapsedText = collapsedText;
        return button;
    };

    qsa(".project-card").forEach((card) => {
        if (qs(".mobile-expand-button", card)) return;
        const details = qs(".project-details", card);
        if (!details) return;

        card.classList.add("is-mobile-collapsed");
        const button = document.createElement("button");
        button.type = "button";
        button.className = "mobile-expand-button";
        button.textContent = "Ver detalles";
        button.setAttribute("aria-expanded", "false");
        details.before(button);

        button.addEventListener("click", () => {
            const isExpanded = card.classList.toggle("is-expanded");
            card.classList.toggle("is-mobile-collapsed", !isExpanded);
            button.textContent = isExpanded ? "Cerrar detalles" : "Ver detalles";
            button.setAttribute("aria-expanded", String(isExpanded));
        });
    });

    const collapsibleBlocks = [
        { selector: ".flagship-why", expanded: "Cerrar contexto", collapsed: "Ver contexto" },
        { selector: ".flagship-evidence article", expanded: "Cerrar evidencia", collapsed: "Ver evidencia" },
        { selector: ".flagship-memory", expanded: "Cerrar memoria", collapsed: "Ver memoria" },
        { selector: ".communication-feature", expanded: "Cerrar detalles", collapsed: "Ver detalles" }
    ];

    collapsibleBlocks.forEach(({ selector, expanded, collapsed }) => {
        qsa(selector).forEach((block) => {
            if (qs(".mobile-summary-toggle", block)) return;
            block.classList.add("is-mobile-collapsed");
            const button = makeToggle(expanded, collapsed);
            block.append(button);

            button.addEventListener("click", () => {
                const isExpanded = block.classList.toggle("is-expanded");
                block.classList.toggle("is-mobile-collapsed", !isExpanded);
                button.textContent = isExpanded ? button.dataset.expandedText : button.dataset.collapsedText;
                button.setAttribute("aria-expanded", String(isExpanded));
            });
        });
    });
};

const setupGalleryLightbox = () => {
    const images = qsa(".carousel-slide img");
    if (!images.length) return;

    images.forEach((image) => {
        image.loading = "lazy";
        image.decoding = "async";
        image.tabIndex = 0;
        image.setAttribute("role", "button");
    });

    const dialog = document.createElement("dialog");
    dialog.className = "image-lightbox";
    dialog.innerHTML = `
        <button type="button" class="image-lightbox-close" aria-label="Cerrar imagen">×</button>
        <img alt="">
    `;
    document.body.append(dialog);

    const dialogImage = qs("img", dialog);
    const closeButton = qs(".image-lightbox-close", dialog);

    const openImage = (image) => {
        if (!dialogImage) return;
        dialogImage.src = image.currentSrc || image.src;
        dialogImage.alt = image.alt || "";
        if (typeof dialog.showModal === "function") {
            dialog.showModal();
        } else {
            dialog.setAttribute("open", "");
        }
    };

    images.forEach((image) => {
        image.addEventListener("click", () => openImage(image));
        image.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openImage(image);
            }
        });
    });

    closeButton?.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
    });
};

const init = () => {
    setupNavigation();
    setupActiveNavigation();
    setupReveal();
    animateKpis();
    hydrateCvSummary();
    setupActivityCarousel();
    setupMobileExecutiveUx();
    setupGalleryLightbox();
};

document.addEventListener("DOMContentLoaded", init);
