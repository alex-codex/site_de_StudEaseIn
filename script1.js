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

    // ===== NAVBAR STYLE AU SCROLL =====
    window.addEventListener('scroll', updateHeaderStyle, { passive: true });

    // ===== REVEAL ON SCROLL (fade/slide in) =====
    const revealElements = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                obs.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    revealElements.forEach(el => obs.observe(el));

    // ===== THÈME LUNE / SOLEIL =====
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.body.classList.add(currentTheme);
        if (themeToggle) themeToggle.innerHTML = currentTheme === 'dark-mode' ? '&#9790;' : '&#9728;';
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-mode');
        if (themeToggle) themeToggle.innerHTML = '&#9790;';
    } else {
        if (themeToggle) themeToggle.innerHTML = '&#9728;';
    }

    // ===== MODALE PRÉ-ENREGISTREMENT (Formspree) =====
    const modal = document.getElementById('preinscription-modal');
    const openBtn = document.getElementById('open-preinscription');
    const closeBtn = document.getElementById('close-preinscription');
    const closeSecondary = document.getElementById('modal-close-secondary');
    const backdrop = document.querySelector('.modal-backdrop');
    const form = document.getElementById('preinscription-form');
    const successBlock = document.getElementById('preinscription-success');
    const closeSuccessBtn = document.getElementById('modal-close-success');
    const errorP = document.getElementById('preinscription-error');

    function openModal() {
        if (!modal) return;
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        const firstInput = modal.querySelector('input');
        if (firstInput) firstInput.focus();
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        openBtn && openBtn.focus();
    }

    openBtn && openBtn.addEventListener('click', () => {
        // Reset UI state on each open
        if (form) form.classList.remove('hidden');
        if (successBlock) successBlock.classList.add('hidden');
        if (errorP) { errorP.textContent = ''; errorP.classList.add('hidden'); }
        openModal();
    });
    closeBtn && closeBtn.addEventListener('click', closeModal);
    closeSecondary && closeSecondary.addEventListener('click', closeModal);
    backdrop && backdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // Intercepte la soumission pour afficher un succès sans recharger
    form && form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (errorP) { errorP.textContent = ''; errorP.classList.add('hidden'); }
        try {
            const fd = new FormData(form);
            const resp = await fetch(form.action, {
                method: form.method || 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: fd
            });
            if (resp.ok) {
                form.reset();
                form.classList.add('hidden');
                successBlock && successBlock.classList.remove('hidden');
            } else {
                const data = await resp.json().catch(() => ({}));
                const msg = data && data.errors ? data.errors.map(e => e.message).join(', ') : 'Une erreur est survenue. Veuillez réessayer.';
                if (errorP) { errorP.textContent = msg; errorP.classList.remove('hidden'); }
            }
        } catch (err) {
            if (errorP) { 
                errorP.textContent = "Impossible d'envoyer le formulaire. Vérifiez votre connexion."; 
                errorP.classList.remove('hidden'); 
            }
        }
    });

    closeSuccessBtn && closeSuccessBtn.addEventListener('click', closeModal);

    // ===== INTL TEL INPUT INIT =====
    const telInput = document.getElementById('telephone');
    if (window.intlTelInput && telInput) {
        window.intlTelInput(telInput, {
            initialCountry: 'fr',
            utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/18.2.1/js/utils.js',
            separateDialCode: true,
            preferredCountries: ['fr', 'us', 'ma', 'sn', 'cm', 'ca']
        });
    }

    // ===== PAYS D'ORIGINE: SELECT AVEC TOUS LES PAYS =====
    const countries = [
        'Afghanistan','Afrique du Sud','Albanie','Algérie','Allemagne','Andorre','Angola','Antigua-et-Barbuda','Arabie saoudite','Argentine','Arménie','Australie','Autriche','Azerbaïdjan','Bahamas','Bahreïn','Bangladesh','Barbade','Belgique','Belize','Bénin','Bhoutan','Biélorussie','Birmanie','Bolivie','Bosnie-Herzégovine','Botswana','Brésil','Brunei','Bulgarie','Burkina Faso','Burundi','Cabo Verde','Cambodge','Cameroun','Canada','Chili','Chine','Chypre','Colombie','Comores','Congo (Brazzaville)','Congo (Kinshasa)','Corée du Nord','Corée du Sud','Costa Rica','Côte d’Ivoire','Croatie','Cuba','Danemark','Djibouti','Dominique','Égypte','Émirats arabes unis','Équateur','Érythrée','Espagne','Estonie','Eswatini','États-Unis','Éthiopie','Fidji','Finlande','France','Gabon','Gambie','Géorgie','Ghana','Grèce','Grenade','Guatemala','Guinée','Guinée-Bissau','Guinée équatoriale','Guyana','Haïti','Honduras','Hongrie','Inde','Indonésie','Irak','Iran','Irlande','Islande','Israël','Italie','Jamaïque','Japon','Jordanie','Kazakhstan','Kenya','Kirghizistan','Kiribati','Koweït','Laos','Lesotho','Lettonie','Liban','Libéria','Libye','Liechtenstein','Lituanie','Luxembourg','Macédoine du Nord','Madagascar','Malaisie','Malawi','Maldives','Mali','Malte','Maroc','Maurice','Mauritanie','Mexique','Micronésie','Moldavie','Monaco','Mongolie','Monténégro','Mozambique','Namibie','Nauru','Népal','Nicaragua','Niger','Nigéria','Norvège','Nouvelle-Zélande','Oman','Ouganda','Ouzbékistan','Pakistan','Palaos','Panama','Papouasie-Nouvelle-Guinée','Paraguay','Pays-Bas','Pérou','Philippines','Pologne','Portugal','Qatar','République centrafricaine','République dominicaine','République tchèque','Roumanie','Royaume-Uni','Russie','Rwanda','Saint-Christophe-et-Niévès','Sainte-Lucie','Saint-Marin','Saint-Vincent-et-les Grenadines','Salomon','Salvador','Samoa','São Tomé-et-Principe','Sénégal','Serbie','Seychelles','Sierra Leone','Singapour','Slovaquie','Slovénie','Somalie','Soudan','Soudan du Sud','Sri Lanka','Suède','Suisse','Suriname','Syrie','Tadjikistan','Tanzanie','Tchad','Thaïlande','Timor oriental','Togo','Tonga','Trinité-et-Tobago','Tunisie','Turkménistan','Turquie','Tuvalu','Ukraine','Uruguay','Vanuatu','Venezuela','Viêt Nam','Yémen','Zambie','Zimbabwe'
    ];
    const paysSelect = document.getElementById('pays');
    if (paysSelect && paysSelect.options.length === 0) {
        countries.forEach(name => {
            const opt = document.createElement('option');
            opt.value = name;
            opt.textContent = name;
            paysSelect.appendChild(opt);
        });
    }
});
