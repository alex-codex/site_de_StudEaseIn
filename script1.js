document.addEventListener("DOMContentLoaded", () => {
    // ===== MENU BURGER =====
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    const navClose = document.querySelector('.nav-close');

    if (navToggle) {
        navToggle.addEventListener('click', () => navMenu.classList.add('show-menu'));
    }
    if (navClose) {
        navClose.addEventListener('click', () => navMenu.classList.remove('show-menu'));
    }
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => navMenu.classList.remove('show-menu'));
    });

    // ===== MODE SOMBRE =====
    const darkModeToggle = document.getElementById("darkmode-toggle");
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
        darkModeToggle.checked = true;
    }

    darkModeToggle.addEventListener("change", () => {
        if (darkModeToggle.checked) {
            document.body.classList.add("dark-mode");
            localStorage.setItem("darkMode", "enabled");
        } else {
            document.body.classList.remove("dark-mode");
            localStorage.setItem("darkMode", "disabled");
        }
        updateHeaderStyle();
    });

    function updateHeaderStyle() {
        const isDarkMode = document.body.classList.contains("dark-mode");
        const header = document.querySelector("header");
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        header.style.boxShadow = scrollTop > 50
            ? isDarkMode ? "0 4px 6px rgba(0, 0, 0, 0.3)" : "0 4px 6px rgba(0, 0, 0, 0.1)"
            : "none";
        header.style.background = isDarkMode
            ? "rgba(30, 30, 30, 0.95)"
            : "rgba(255, 255, 255, 0.95)";
    }

    updateHeaderStyle();

    // ===== ACCORDÉON FAQ =====
    document.querySelectorAll('.faq-accordion .questions__header').forEach(header => {
        header.addEventListener('click', function () {
            const item = this.parentElement;
            const content = item.querySelector('.questions__content');
            const isOpen = item.classList.contains('accordion-open');

            document.querySelectorAll('.faq-accordion .questions__item').forEach(i => {
                i.classList.remove('accordion-open');
                i.querySelector('.questions__content').style.height = 0;
            });

            if (!isOpen) {
                item.classList.add('accordion-open');
                content.style.height = content.scrollHeight + 'px';
            }
        });
    });

    // ===== ACCORDÉON ÉTUDES =====
    document.querySelectorAll('.etude-accordion .accordion-header').forEach(header => {
        header.addEventListener('click', function () {
            const content = this.nextElementSibling;
            const isActive = this.classList.contains('active');

            document.querySelectorAll('.etude-accordion .accordion-header').forEach(h => h.classList.remove('active'));
            document.querySelectorAll('.etude-accordion .accordion-content').forEach(c => {
                c.style.maxHeight = null;
                c.style.paddingTop = '0';
                c.style.paddingBottom = '0';
            });

            if (!isActive) {
                this.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
                content.style.paddingTop = '15px';
                content.style.paddingBottom = '15px';
            }
        });
    });

    // ===== ADAPTATION SUR REDIMENSIONNEMENT =====
    window.addEventListener('resize', () => {
        document.querySelectorAll('.faq-accordion .questions__item.accordion-open .questions__content').forEach(content => {
            content.style.height = content.scrollHeight + 'px';
        });
        document.querySelectorAll('.etude-accordion .accordion-header.active + .accordion-content').forEach(content => {
            content.style.maxHeight = content.scrollHeight + 'px';
        });
    });

    // ===== NAVBAR TEMPORAIRE =====
    showNavbar();
    ['mousemove', 'keydown', 'scroll', 'touchstart'].forEach(evt => {
        window.addEventListener(evt, showNavbar, { passive: true });
    });

    // ===== THÈME LUNE / SOLEIL =====
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.body.classList.add(currentTheme);
        themeToggle.innerHTML = currentTheme === 'dark-mode' ? '&#9790;' : '&#9728;';
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '&#9790;';
    } else {
        themeToggle.innerHTML = '&#9728;';
    }
});
