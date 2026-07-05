document.addEventListener('DOMContentLoaded', () => {
    initPageTransitions();
    initDropdowns();
    initScrollAnimations();
    initMobileMenu();
    initScrollSlide();
    initMapFacade();
    initMapToggle();
    initHeroSlider();
    initNavbarScroll();
    initIframePlaceholders();
    initArtistModals();
    initCustomAudioPlayers();

    // Inizializza il countdown solo se il contenitore esiste nella pagina
    if (document.getElementById('days-count')) {
        initCountdown();
    }

    initScrollToLineup();
    init3DTilt();
    initEmailObfuscation();
    initLazyLoading();
    initAccordion();
    initLanguageSwitcher();
});

function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Si attiva quando è visibile al 10%
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
}


function initCountdown() {
    // Data obiettivo: 11 luglio 2026, ore 20:00:00
    const targetDate = new Date("July 11, 2026 20:00:00").getTime();

    const daysEl = document.getElementById('days-count');
    const hoursEl = document.getElementById('hours-count');
    const minsEl = document.getElementById('mins-count');
    const secsEl = document.getElementById('secs-count');

    const TWENTY_H = 20 * 60 * 60 * 1000;
    let countdownInterval = null;

    function updateCountdown() {
        const now = Date.now();
        const distance = targetDate - now;                   // countdown reale

        if (distance < 0) {
            clearInterval(countdownInterval);
            showExpiredMessage();
            return;
        }

        // Mostra "Oggi è il giorno" quando mancano 20 ore o meno
        const todayMsgEl = document.getElementById('today-festival-message');
        if (todayMsgEl) {
            todayMsgEl.style.display = (distance <= TWENTY_H) ? "block" : "none";
        }

        const days    = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours   = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        daysEl.innerText  = days.toString().padStart(2, '0');
        hoursEl.innerText = hours.toString().padStart(2, '0');
        minsEl.innerText  = minutes.toString().padStart(2, '0');
        secsEl.innerText  = seconds.toString().padStart(2, '0');
    }

    function showExpiredMessage() {
        const titleEl = document.querySelector('.countdown-title');
        const containerEl = document.querySelector('.countdown-container');
        const sectionEl = document.querySelector('.countdown-section');
        const messageDiv = document.querySelector('.countdown-expired-message');
        const todayMsgEl = document.getElementById('today-festival-message');

        if (todayMsgEl) {
            todayMsgEl.style.display = "none";
        }

        if (containerEl) {
            containerEl.classList.add('fade-out');
            setTimeout(() => {
                containerEl.style.display = "none";
            }, 800);
        }

        if (titleEl) {
            titleEl.style.transition = "opacity 0.6s ease, transform 0.6s ease";
            titleEl.style.opacity = "0";
            titleEl.style.transform = "translateY(-20px)";
            setTimeout(() => titleEl.remove(), 600);
        }

        if (messageDiv) {
            messageDiv.style.display = "block";

            // Lampo bianco a schermo intero
            const flash = document.createElement('div');
            flash.className = 'sf-screen-flash';
            document.body.appendChild(flash);
            flash.addEventListener('animationend', () => flash.remove());

            // Leggera inclinazione 3D sul pannello di celebrazione
            const panel = messageDiv.querySelector('.sf-celebration');
            if (panel && window.innerWidth > 768) {
                let tiltRaf = null;
                panel.addEventListener('mousemove', (e) => {
                    if (tiltRaf) return;
                    tiltRaf = requestAnimationFrame(() => {
                        const rect = panel.getBoundingClientRect();
                        const cx = rect.width  / 2;
                        const cy = rect.height / 2;
                        const rx = ((cy - (e.clientY - rect.top))  / cy) * 6;
                        const ry = (((e.clientX - rect.left) - cx) / cx) * 6;
                        panel.style.transform = `perspective(1400px) rotateX(${rx}deg) rotateY(${ry}deg)`;
                        tiltRaf = null;
                    });
                }, { passive: true });
                panel.addEventListener('mouseleave', () => {
                    panel.style.transition = 'transform 0.6s ease';
                    panel.style.transform = '';
                    setTimeout(() => panel.style.transition = '', 600);
                });
            }

            // Scintille
            addTicketSparkles(messageDiv.querySelector('.sf-sparkles-container'));

            // Esplosione di coriandoli su canvas
            triggerConfetti(sectionEl);
        }
    }

    function triggerConfetti(sectionEl) {
        let canvas = document.getElementById('countdown-confetti');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'countdown-confetti';
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = '50';
            sectionEl.style.position = 'relative';
            sectionEl.appendChild(canvas);
        }

        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const width = sectionEl.offsetWidth;
        const height = sectionEl.offsetHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        const particles = [];
        const colors = ['#FFDE4D', '#FF4E4E', '#3D30A2', '#000000', '#F29C38'];

        // Esplosione iniziale dal centro e dall'alto
        for (let i = 0; i < 120; i++) {
            particles.push({
                x: width / 2 + (Math.random() - 0.5) * 100,
                y: height / 3 + (Math.random() - 0.5) * 50,
                radius: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                type: Math.random() > 0.4 ? 'petal' : 'circle',
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.15,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10 - 5
            });
        }

        // Fontane laterali
        for (let i = 0; i < 40; i++) {
            // Fontana sinistra
            particles.push({
                x: 30,
                y: height - 40,
                radius: Math.random() * 7 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                type: Math.random() > 0.5 ? 'petal' : 'square',
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.25,
                vx: Math.random() * 8 + 3,
                vy: -(Math.random() * 12 + 10)
            });
            // Fontana destra
            particles.push({
                x: width - 30,
                y: height - 40,
                radius: Math.random() * 7 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                type: Math.random() > 0.5 ? 'petal' : 'square',
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.25,
                vx: -(Math.random() * 8 + 3),
                vy: -(Math.random() * 12 + 10)
            });
        }

        let active = true;
        setTimeout(() => { active = false; }, 6000);

        function animate() {
            ctx.clearRect(0, 0, width, height);
            let alive = false;

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.28; // gravità
                p.vx *= 0.98; // resistenza dell'aria
                p.rotation += p.rotationSpeed;

                if (p.y < height + 20 && p.x > -20 && p.x < width + 20) {
                    alive = true;
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.rotation);
                    ctx.fillStyle = p.color;

                    if (p.type === 'petal') {
                        ctx.beginPath();
                        // Forma di petalo tramite ellisse
                        ctx.ellipse(0, 0, p.radius * 1.5, p.radius * 0.8, 0, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.strokeStyle = 'rgba(0,0,0,0.15)';
                        ctx.beginPath();
                        ctx.moveTo(-p.radius * 1.2, 0);
                        ctx.lineTo(p.radius * 1.2, 0);
                        ctx.stroke();
                    } else if (p.type === 'square') {
                        ctx.fillRect(-p.radius, -p.radius, p.radius * 2, p.radius * 2);
                        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
                        ctx.strokeRect(-p.radius, -p.radius, p.radius * 2, p.radius * 2);
                    } else {
                        ctx.beginPath();
                        ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    ctx.restore();
                }
            });

            if (alive && active) {
                requestAnimationFrame(animate);
            } else {
                ctx.clearRect(0, 0, width, height);
                if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
            }
        }
        animate();
    }

    function addTicketSparkles(container) {
        if (!container) return;
        const colors = ['#FFDE4D', '#F5B027', '#FF4E4E', '#00eeff', '#ff00cc', '#ffffff', '#FFD700', '#80ff80'];

        function createSparkle() {
            if (!container.parentNode) return;
            const sparkle = document.createElement('div');
            sparkle.className = 'sf-sparkle';
            const size = 5 + Math.random() * 14;
            const dur  = (1.0 + Math.random() * 1.7).toFixed(2);
            sparkle.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;width:${size}px;height:${size}px;background:${colors[Math.floor(Math.random()*colors.length)]};--sf-dur:${dur}s;`;
            container.appendChild(sparkle);
            setTimeout(() => { if (sparkle.parentNode) sparkle.remove(); }, dur * 1000 + 250);
        }

        const isMobile = window.innerWidth <= 768;
        const burstCount  = isMobile ? 8  : 20;
        const sparkleRate = isMobile ? 700 : 320;
        for (let i = 0; i < burstCount; i++) setTimeout(createSparkle, i * 110);
        const iv = setInterval(createSparkle, sparkleRate);
        setTimeout(() => clearInterval(iv), 10000);
    }

    // Aggiorna subito, poi ogni secondo
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

function initMobileMenu() {
    const toggleBtn = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (!toggleBtn || !navLinks) return;

    const closeMenu = () => {
        toggleBtn.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        const openDropdown = navLinks.querySelector('.nav-dropdown.active');
        if (openDropdown) openDropdown.classList.remove('active');
    };

    const openMenu = () => {
        toggleBtn.classList.add('active');
        navLinks.classList.add('active');
        document.body.classList.add('menu-open');
        toggleBtn.setAttribute('aria-expanded', 'true');
    };

    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.setAttribute('aria-controls', 'nav-links');
    navLinks.setAttribute('id', 'nav-links');

    toggleBtn.addEventListener('click', () => {
        navLinks.classList.contains('active') ? closeMenu() : openMenu();
    });

    navLinks.querySelectorAll('a:not(.dropdown-trigger)').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) closeMenu();
    });
}

function initScrollSlide() {
    const sunflowerText = document.querySelector('.giant-title .text-sunflower');
    const festivalText = document.querySelector('.giant-title .text-festival');

    if (!sunflowerText || !festivalText) return;

    let scrollRafPending = false;
    window.addEventListener('scroll', () => {
        if (window.innerWidth <= 768) return;
        if (scrollRafPending) return;
        scrollRafPending = true;
        requestAnimationFrame(() => {
            const scrolled = window.scrollY;
            sunflowerText.style.transform = `translateX(-${scrolled * 0.6}px)`;
            festivalText.style.transform  = `translateX(${scrolled  * 0.6}px)`;
            scrollRafPending = false;
        });
    }, { passive: true });
}

function initMapFacade() {
    const facade = document.getElementById('map-facade');
    if (!facade) return;
    const activate = () => {
        const src = facade.dataset.src;
        if (!src) return;
        const iframe = document.createElement('iframe');
        iframe.src = src;
        iframe.allowFullscreen = true;
        iframe.loading = 'lazy';
        iframe.referrerPolicy = 'no-referrer-when-downgrade';
        iframe.title = "Mappa Social Tennis Club";
        iframe.setAttribute('style', 'width:100%;height:100%;border:0;');
        facade.parentElement.replaceChild(iframe, facade);
    };
    facade.addEventListener('click', activate);
    facade.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') activate(); });
}

function initMapToggle() {
    const mapContainer = document.querySelector('.smartphone-map-container');
    const mapLink = document.querySelector('.sunflower-map-link');
    const appTrigger = document.querySelector('.map-app-trigger');
    const backBtn = document.querySelector('.map-back-btn');
    const shrinkBtn = document.getElementById('shrink-map');

    if (!mapContainer) return;

    function openMap() {
        mapContainer.classList.add('map-active');
        const iframe = mapContainer.querySelector('iframe');
        if (iframe) {
            iframe.src = iframe.src;
        }
    }

    function closeMap() {
        mapContainer.classList.remove('map-active');
    }

    if (mapLink) {
        mapLink.addEventListener('click', (e) => {
            e.preventDefault();
            openMap();
        });
    }

    if (appTrigger) {
        appTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            openMap();
        });
    }

    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeMap();
        });
    }

    if (shrinkBtn) {
        shrinkBtn.addEventListener('click', () => {
            closeMap();
        });
    }
}

function initHeroSlider() {
    const sliderContainer = document.querySelector('.hero-slider');
    if (!sliderContainer) return;

    // Mantiene solo le immagini orizzontali da assets/Foto-generali/ (esclusa foto1.webp, statica nell'HTML per l'ottimizzazione LCP)
    const carouselImages = [
        'assets/Foto-generali/Foto10.webp',
        'assets/Foto-generali/Foto11.webp',
        'assets/Foto-generali/Foto12.webp',
        'assets/Foto-generali/Foto13.webp',
        'assets/Foto-generali/Foto14.webp',
        'assets/Foto-generali/Foto15.webp',
        'assets/Foto-generali/Foto16.webp',
        'assets/Foto-generali/Foto17.webp',
        'assets/Foto-generali/Foto18.webp',
        'assets/Foto-generali/Foto19.webp',
        'assets/Foto-generali/Foto20.webp',
        'assets/Foto-generali/Foto21.webp',
        'assets/Foto-generali/Foto22.webp',
        'assets/Foto-generali/Foto38.webp',
        'assets/Foto-generali/Foto39.webp',
        'assets/Foto-generali/Foto40.webp',
        'assets/Foto-generali/Foto41.webp',
        'assets/Foto-generali/Foto42.webp',
        'assets/Foto-generali/Foto43.webp',
        'assets/Foto-generali/Foto44.webp',
        'assets/Foto-generali/Foto45.webp',
        'assets/Foto-generali/Foto46.webp',
        'assets/Foto-generali/Foto47.webp',
        'assets/Foto-generali/Foto48.webp',
        'assets/Foto-generali/Foto49.webp',
        'assets/Foto-generali/Foto50.webp',
        'assets/Foto-generali/Foto51.webp',
        'assets/Foto-generali/Foto52.webp',
        'assets/Foto-generali/Foto53.webp',
        'assets/Foto-generali/foto2.webp',
        'assets/Foto-generali/foto3.webp',
        'assets/Foto-generali/foto4.webp',
        'assets/Foto-generali/foto5.webp',
        'assets/Foto-generali/foto6.webp',
        'assets/Foto-generali/foto7.webp',
        'assets/Foto-generali/foto8.webp',
        'assets/Foto-generali/foto9.webp'
    ];

    // Identifichiamo i file verticali per ottimizzazione responsive del carosello
    const verticalFilenames = [
        'Foto23.webp', 'Foto24.webp', 'Foto28.webp', 'Foto29.webp', 'Foto32.webp',
        'Foto33.webp', 'Foto34.webp', 'Foto38.webp', 'Foto39.webp', 'Foto40.webp',
        'Foto41.webp', 'Foto43.webp', 'Foto44.webp', 'Foto45.webp', 'Foto46.webp',
        'Foto47.webp', 'Foto48.webp', 'Foto49.webp', 'Foto50.webp', 'Foto52.webp',
        'Foto53.webp'
    ];

    const isMobile = window.innerWidth <= 768;
    const vertical = [];
    const horizontal = [];

    carouselImages.forEach(img => {
        const filename = img.split('/').pop();
        if (verticalFilenames.includes(filename)) {
            vertical.push(img);
        } else {
            horizontal.push(img);
        }
    });

    const shuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };
    shuffle(vertical);
    shuffle(horizontal);

    let finalImages = [];
    if (isMobile) {
        // Su mobile diamo la precedenza e maggior frequenza alle foto verticali (3 verticali per ogni orizzontale)
        let vIdx = 0, hIdx = 0;
        while (vIdx < vertical.length || hIdx < horizontal.length) {
            if (vIdx < vertical.length) finalImages.push(vertical[vIdx++]);
            if (vIdx < vertical.length) finalImages.push(vertical[vIdx++]);
            if (vIdx < vertical.length) finalImages.push(vertical[vIdx++]);
            if (hIdx < horizontal.length) finalImages.push(horizontal[hIdx++]);
        }
    } else {
        // Su desktop preferiamo le foto orizzontali (3 orizzontali per ogni verticale)
        let vIdx = 0, hIdx = 0;
        while (vIdx < vertical.length || hIdx < horizontal.length) {
            if (hIdx < horizontal.length) finalImages.push(horizontal[hIdx++]);
            if (hIdx < horizontal.length) finalImages.push(horizontal[hIdx++]);
            if (hIdx < horizontal.length) finalImages.push(horizontal[hIdx++]);
            if (vIdx < vertical.length) finalImages.push(vertical[vIdx++]);
        }
    }

    // Aggiorna l'array in-place
    carouselImages.length = 0;
    carouselImages.push(...finalImages);

    // NON svuotare sliderContainer, per preservare la slide statica (LCP LCP LCP)
    // Aggiunge solo le altre slide come elementi inattivi e caricabili in lazy loading
    carouselImages.forEach((src) => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.setAttribute('data-bg', src);

        // Posizionamento verticale personalizzato per evitare che teste/dettagli vengano tagliati
        const filename = src.split('/').pop();
        const customPositions = {
            'Foto10.webp': 'center 10%', // Cartelli bianco e nero / ragazza con telefono
            'Foto14.webp': 'center 22%', // Ragazza riccia che canta (mento e microfono visibili)
            'Foto19.webp': 'center 15%',
            'Foto22.webp': 'center 22%', // Chitarrista con occhiali da sole (mento e microfono visibili)
            'foto2.webp': 'center 12%',
            'foto3.webp': 'center 15%',
            'foto4.webp': 'center 10%',
            'foto5.webp': 'center 15%',
            'foto6.webp': 'center 12%',
            'foto7.webp': 'center 10%',
            'foto8.webp': 'center 32%', // Cantante con cappellino e occhiali da sole (mento/microfono visibili)
            'foto9.webp': 'center 32%'  // Primo piano cantante con capelli ricci (mento/microfono visibili)
        };
        if (customPositions[filename]) {
            slide.style.backgroundPosition = customPositions[filename];
        } else {
            slide.style.backgroundPosition = 'center 15%'; // Allineamento verticale predefinito per le immagini orizzontali
        }

        sliderContainer.appendChild(slide);
    });

    const slides = sliderContainer.querySelectorAll('.slide');
    if (slides.length <= 1) return;

    // Funzione di supporto per caricare l'immagine di sfondo di una slide su richiesta
    function loadSlideImage(slideEl) {
        if (!slideEl) return;
        const bgSrc = slideEl.getAttribute('data-bg');
        if (bgSrc) {
            slideEl.style.backgroundImage = `linear-gradient(rgba(26, 26, 26, 0.4), rgba(26, 26, 26, 0.4)), url('${bgSrc}')`;
            slideEl.removeAttribute('data-bg');
        }
    }

    // Precarica la seconda slide dopo un breve ritardo, così è pronta per la prima transizione
    setTimeout(() => {
        if (slides[1]) loadSlideImage(slides[1]);
    }, 1500);

    let currentSlide = 0;
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;

        // Assicura che la slide attiva sia caricata
        loadSlideImage(slides[currentSlide]);
        slides[currentSlide].classList.add('active');

        // Precarica la slide successiva in sequenza, così è già in cache prima della prossima transizione
        const nextSlideIdx = (currentSlide + 1) % slides.length;
        loadSlideImage(slides[nextSlideIdx]);
    }, 4500);
}

function initNavbarScroll() {
    const hero = document.querySelector('.home-hero');
    const nav = document.querySelector('.main-nav');
    if (!hero || !nav) return;

    function handleScroll() {
        const scrollY = window.scrollY;
        const heroTop = hero.offsetTop;
        const heroHeight = hero.offsetHeight;

        // La navbar è fissata in cima al viewport (da 0 a 80px).
        // Si sovrappone alle slide dell'hero (immagini) se:
        // il top dell'hero nel viewport è <= 80 (l'altezza della navbar è 80px)
        // E
        // il bottom dell'hero nel viewport è >= 0
        const isOverHero = (heroTop - scrollY <= 80) && (heroTop + heroHeight - scrollY >= 0);

        if (isOverHero) {
            nav.classList.add('transparent-nav');
        } else {
            nav.classList.remove('transparent-nav');
        }
    }

    // Imposta lo stato iniziale
    handleScroll();

    // Ascolta gli eventi di scroll e resize
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
}

function initIframePlaceholders() {
    const wrappers = document.querySelectorAll('.iframe-wrapper');
    wrappers.forEach(wrapper => {
        const iframe = wrapper.querySelector('iframe');
        const placeholder = wrapper.querySelector('.iframe-placeholder');
        if (iframe && placeholder) {
            // Controlla se l'iframe è già caricato (es. dalla cache)
            try {
                if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
                    placeholder.classList.add('fade-out');
                    return;
                }
            } catch (e) {
                // Il blocco di sicurezza cross-origin del browser è previsto, si prosegue con il listener dell'evento load
            }

            iframe.addEventListener('load', () => {
                placeholder.classList.add('fade-out');
            });

            // Fallback: dissolve il placeholder dopo 6.5s nel caso un blocco di tracciamento impedisca l'evento load
            setTimeout(() => {
                placeholder.classList.add('fade-out');
            }, 6500);
        }
    });
}

function initArtistModals() {
    const overlay = document.getElementById('modals-overlay');
    if (!overlay) return;

    const cards = document.querySelectorAll('.artist-slider-card');
    const fullPages = overlay.querySelectorAll('.artist-full-page');
    const closeBtns = overlay.querySelectorAll('.full-page-close-btn');

    // Frecce di navigazione fluttuanti globali dentro l'overlay
    const prevModalBtn = overlay.querySelector('.global-modal-nav-btn.prev-btn');
    const nextModalBtn = overlay.querySelector('.global-modal-nav-btn.next-btn');

    // Ottiene l'array di tutti i nomi degli artisti nell'ordine delle slide
    const artistNames = Array.from(cards).map(c => c.getAttribute('data-artist')).filter(Boolean);

    function openModal(artistName) {
        // Ferma qualsiasi audio in riproduzione da un'altra modale artista
        stopAllCustomAudioPlayers();

        // Trova la modale
        const targetModal = document.getElementById(`modal-${artistName}`);
        if (!targetModal) return;

        // Carica dinamicamente l'iframe di Spotify
        const iframe = targetModal.querySelector('iframe[data-src]');
        if (iframe) {
            iframe.src = iframe.getAttribute('data-src');
        }

        // Carica la foto dell'artista in lazy loading (nascosta con opacity per non far scattare IntersectionObserver)
        const artistPhoto = targetModal.querySelector('.placeholder-img[data-bg]');
        if (artistPhoto) {
            artistPhoto.style.backgroundImage = `url('${artistPhoto.dataset.bg}')`;
            artistPhoto.removeAttribute('data-bg');
            artistPhoto.classList.remove('lazy-bg');
        }

        // Disattiva eventuali modali attualmente attive per sicurezza
        fullPages.forEach(p => p.classList.remove('active'));

        // Imposta il progresso dei divisori in stile brutalist in base all'indice dell'artista
        const currentIndex = artistNames.indexOf(artistName);
        if (currentIndex !== -1 && artistNames.length > 0) {
            const progressPercent = ((currentIndex + 1) / artistNames.length) * 100;
            targetModal.style.setProperty('--divider-progress', `${progressPercent}%`);
        }

        // Mostra l'overlay e la modale target
        overlay.classList.add('active');
        targetModal.classList.add('active');
        targetModal.scrollTop = 0;

        // Impedisce lo scroll del body
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    }

    function closeModal() {
        overlay.classList.remove('active');
        fullPages.forEach(p => {
            p.classList.remove('active');
            // Scarica l'iframe di Spotify per liberare memoria e fermare l'esecuzione in background
            const iframe = p.querySelector('iframe[data-src]');
            if (iframe) {
                iframe.src = "about:blank";
            }
        });
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        stopAllCustomAudioPlayers();
    }

    function getActiveArtistName() {
        const activeModal = overlay.querySelector('.artist-full-page.active');
        if (!activeModal) return null;
        return activeModal.id.replace('modal-', '');
    }

    function navigateModal(direction) {
        const currentArtist = getActiveArtistName();
        if (!currentArtist) return;

        const currentIndex = artistNames.indexOf(currentArtist);
        if (currentIndex === -1) return;

        let nextIndex;
        if (direction === 'next') {
            nextIndex = (currentIndex + 1) % artistNames.length;
        } else {
            nextIndex = (currentIndex - 1 + artistNames.length) % artistNames.length;
        }

        const nextArtist = artistNames[nextIndex];
        openModal(nextArtist);
    }

    // Collega i listener di click ai pulsanti next/prev
    if (prevModalBtn && nextModalBtn) {
        prevModalBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateModal('prev');
        });
        nextModalBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateModal('next');
        });
    }

    // Collega l'evento click alle card dello slider
    cards.forEach(card => {
        const artist = card.getAttribute('data-artist');
        if (artist) {
            card.addEventListener('click', () => {
                openModal(artist);
            });
        }
    });

    // Chiude al click sul pulsante di chiusura
    closeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Ferma la propagazione
            closeModal();
        });
    });

    // Chiude cliccando fuori dal contenuto della modale (lo sfondo dell'overlay)
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    });

    // Chiude alla pressione del tasto ESC, naviga tra gli artisti con le frecce della tastiera
    document.addEventListener('keydown', (e) => {
        if (!overlay.classList.contains('active')) return;
        if (e.key === 'Escape') {
            closeModal();
        } else if (e.key === 'ArrowRight') {
            navigateModal('next');
        } else if (e.key === 'ArrowLeft') {
            navigateModal('prev');
        }
    });

    // Swipe da mobile per passare da un artista all'altro nella pagina a schermo intero
    let modalTouchStartX = 0;
    let modalTouchStartY = 0;
    let modalTouchTracking = false;

    overlay.addEventListener('touchstart', (e) => {
        if (!overlay.classList.contains('active')) return;
        modalTouchStartX = e.touches[0].clientX;
        modalTouchStartY = e.touches[0].clientY;
        modalTouchTracking = true;
    }, { passive: true });

    overlay.addEventListener('touchend', (e) => {
        if (!modalTouchTracking) return;
        modalTouchTracking = false;

        const deltaX = e.changedTouches[0].clientX - modalTouchStartX;
        const deltaY = e.changedTouches[0].clientY - modalTouchStartY;
        const SWIPE_THRESHOLD = 50;

        // Considera lo swipe solo se il movimento e' prevalentemente orizzontale, per non interferire con lo scroll verticale della bio
        if (Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
            navigateModal(deltaX < 0 ? 'next' : 'prev');
        }
    }, { passive: true });

    // Logica di scroll dello slider
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    const sliderContainer = document.querySelector('.artists-slider-container');

    if (sliderContainer) {
        const gap = 40; // uno spazio di 2.5rem corrisponde a 40px con font-size 16px
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const firstCard = sliderContainer.querySelector('.artist-slider-card');
                const cardWidth = firstCard ? firstCard.offsetWidth : 320;
                sliderContainer.scrollBy({
                    left: cardWidth + gap,
                    behavior: 'smooth'
                });
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const firstCard = sliderContainer.querySelector('.artist-slider-card');
                const cardWidth = firstCard ? firstCard.offsetWidth : 320;
                sliderContainer.scrollBy({
                    left: -(cardWidth + gap),
                    behavior: 'smooth'
                });
            });
        }
     }
}

// Array per tenere traccia degli elementi audio attivi da mettere in pausa alla chiusura
let activeAudioInstances = [];

function stopAllCustomAudioPlayers() {
    activeAudioInstances.forEach(instance => {
        const activeAudio = instance.getCurrentAudio ? instance.getCurrentAudio() : instance.audio;
        if (activeAudio && !activeAudio.paused) {
            activeAudio.pause();
            const icon = instance.playerEl.querySelector('.player-play-btn i');
            if (icon) {
                icon.className = 'fa-solid fa-play';
            }
        }
    });
}

function initCustomAudioPlayers() {
    const players = document.querySelectorAll('.sunflower-player');
    if (!players.length) return;

    players.forEach(player => {
        let tracks = [];
        let trackNames = [];

        let idx = 1;
        while (player.getAttribute(`data-track-${idx}`)) {
            tracks.push(player.getAttribute(`data-track-${idx}`));
            trackNames.push(player.getAttribute(`data-name-${idx}`) || `Traccia ${idx}`);
            idx++;
        }

        // Fallback a una singola traccia se non vengono trovate tracce numerate
        if (tracks.length === 0) {
            const singleTrack = player.getAttribute('data-track');
            if (singleTrack) {
                tracks.push(singleTrack);
                trackNames.push(player.getAttribute('data-name') || 'Traccia 1');
            }
        }

        if (tracks.length === 0) return;

        let currentTrackIdx = 0;
        const audios = tracks.map(src => {
            const a = new Audio();
            a.src = src;
            a.preload = 'auto'; // Forza il precaricamento del buffer
            return a;
        });
        let audio = audios[currentTrackIdx];

        const playBtn = player.querySelector('.player-play-btn');
        const progressBarContainer = player.querySelector('.player-progress-bar-container');
        const progressBar = player.querySelector('.player-progress-bar');
        const timeCurrent = player.querySelector('.player-time-current');
        const timeDuration = player.querySelector('.player-time-duration');
        const statusMsg = player.querySelector('.player-status-msg');
        const trackNameEl = player.querySelector('.player-track-name');

        // Tiene traccia delle istanze audio attive
        activeAudioInstances.push({
            getCurrentAudio: () => audio,
            playerEl: player
        });

        // 1. Crea e inserisce dinamicamente il selettore di tracce se ce n'è più di una
        if (tracks.length > 1) {
            let selectorContainer = player.querySelector('.player-track-selector');
            if (!selectorContainer) {
                selectorContainer = document.createElement('div');
                selectorContainer.className = 'player-track-selector';
                player.insertBefore(selectorContainer, player.firstChild);
            }

            // Crea i pulsanti del selettore
            selectorContainer.innerHTML = '';
            tracks.forEach((trackSrc, i) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = `track-select-btn${i === 0 ? ' active' : ''}`;
                btn.innerHTML = `<i class="fa-solid fa-music"></i> <span class="track-select-name">${trackNames[i].split(' - ').pop()}</span>`;
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    switchTrack(i);
                });
                selectorContainer.appendChild(btn);
            });

            // 2. Crea e inserisce dinamicamente il pulsante Skip accanto al pulsante Play
            let skipBtn = player.querySelector('.player-skip-btn');
            if (!skipBtn) {
                skipBtn = document.createElement('button');
                skipBtn.type = 'button';
                skipBtn.className = 'player-skip-btn';
                skipBtn.setAttribute('aria-label', 'Prossima Canzone');
                skipBtn.setAttribute('title', 'Skip Traccia');
                skipBtn.innerHTML = '<i class="fa-solid fa-forward-step"></i>';

                // Racchiude playBtn e skipBtn in un contenitore di gruppo se non già raggruppati
                let btnGroup = player.querySelector('.player-btn-group');
                if (!btnGroup && playBtn && playBtn.parentNode) {
                    btnGroup = document.createElement('div');
                    btnGroup.className = 'player-btn-group';
                    playBtn.parentNode.insertBefore(btnGroup, playBtn);
                    btnGroup.appendChild(playBtn);
                }
                if (btnGroup) {
                    btnGroup.appendChild(skipBtn);
                }
            }

            if (skipBtn) {
                skipBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const nextIdx = (currentTrackIdx + 1) % tracks.length;
                    switchTrack(nextIdx);
                });
            }
        }

        // Funzione per cambiare traccia
        function switchTrack(newIdx) {
            const wasPlaying = !audio.paused;
            audio.pause();

            currentTrackIdx = newIdx;
            audio = audios[currentTrackIdx];
            audio.currentTime = 0;
            progressBar.style.width = '0%';

            // Aggiorna il testo del nome della traccia
            if (trackNameEl) {
                trackNameEl.textContent = trackNames[currentTrackIdx];
            }

            // Aggiorna subito la visualizzazione del tempo se i metadati sono già caricati
            if (!isNaN(audio.duration)) {
                timeDuration.textContent = formatTime(audio.duration);
            } else {
                timeDuration.textContent = '0:00';
            }
            timeCurrent.textContent = '0:00';

            // Aggiorna la classe active dei pulsanti di selezione
            const selectBtns = player.querySelectorAll('.track-select-btn');
            selectBtns.forEach((btn, i) => {
                if (i === currentTrackIdx) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            // Cancella il messaggio di stato
            if (statusMsg) {
                statusMsg.style.display = 'none';
                statusMsg.textContent = '';
            }

            if (wasPlaying) {
                audio.play().then(() => {
                    const icon = playBtn.querySelector('i');
                    if (icon) icon.className = 'fa-solid fa-pause';
                }).catch(err => {
                    console.warn("Autoplay/caricamento fallito:", err);
                    const icon = playBtn.querySelector('i');
                    if (icon) icon.className = 'fa-solid fa-play';
                });
            } else {
                const icon = playBtn.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-play';
            }
        }

        // Crea dinamicamente i controlli del volume
        const volumeContainer = document.createElement('div');
        volumeContainer.className = 'player-volume-container';

        const volumeBtn = document.createElement('button');
        volumeBtn.className = 'player-volume-btn';
        volumeBtn.type = 'button';
        volumeBtn.setAttribute('aria-label', 'Regola volume');
        volumeBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';

        const sliderWrapper = document.createElement('div');
        sliderWrapper.className = 'volume-slider-wrapper';

        const volumeSlider = document.createElement('input');
        volumeSlider.type = 'range';
        volumeSlider.className = 'player-volume-slider';
        volumeSlider.min = '0';
        volumeSlider.max = '1';
        volumeSlider.step = '0.05';
        volumeSlider.value = '1';
        volumeSlider.setAttribute('aria-label', 'Volume');

        sliderWrapper.appendChild(volumeSlider);
        volumeContainer.appendChild(volumeBtn);
        volumeContainer.appendChild(sliderWrapper);

        // Inserisce volumeContainer subito dopo playBtn o dopo il suo contenitore
        const insertTarget = player.querySelector('.player-btn-group') || playBtn;
        if (insertTarget && insertTarget.parentNode) {
            insertTarget.parentNode.insertBefore(volumeContainer, insertTarget.nextSibling);
        }

        // Logica di controllo del volume
        let previousVolume = 1;

        function updateVolumeIcon(vol) {
            const icon = volumeBtn.querySelector('i');
            if (!icon) return;
            icon.className = 'fa-solid';
            if (vol === 0) {
                icon.classList.add('fa-volume-xmark');
            } else if (vol <= 0.5) {
                icon.classList.add('fa-volume-low');
            } else {
                icon.classList.add('fa-volume-high');
            }
        }

        volumeSlider.addEventListener('input', () => {
            audio.volume = volumeSlider.value;
            updateVolumeIcon(audio.volume);
        });

        volumeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (audio.volume > 0) {
                previousVolume = audio.volume;
                audio.volume = 0;
                volumeSlider.value = 0;
            } else {
                audio.volume = previousVolume > 0 ? previousVolume : 1;
                volumeSlider.value = audio.volume;
            }
            updateVolumeIcon(audio.volume);
        });

        // Formatta il tempo in secondi nel formato mm:ss
        function formatTime(secs) {
            if (isNaN(secs)) return '0:00';
            const m = Math.floor(secs / 60);
            const s = Math.floor(secs % 60).toString().padStart(2, '0');
            return `${m}:${s}`;
        }

        // Imposta i listener degli eventi per ogni istanza Audio
        function bindAudioEvents(a, idx) {
            a.addEventListener('loadedmetadata', () => {
                if (idx === currentTrackIdx) {
                    timeDuration.textContent = formatTime(a.duration);
                }
            });

            a.addEventListener('timeupdate', () => {
                if (idx === currentTrackIdx) {
                    if (a.duration) {
                        const pct = (a.currentTime / a.duration) * 100;
                        progressBar.style.width = `${pct}%`;
                    }
                    timeCurrent.textContent = formatTime(a.currentTime);
                }
            });

            a.addEventListener('ended', () => {
                if (idx === currentTrackIdx) {
                    if (tracks.length > 1) {
                        const nextIdx = (currentTrackIdx + 1) % tracks.length;
                        switchTrack(nextIdx);
                        audio.play().then(() => {
                            const icon = playBtn.querySelector('i');
                            if (icon) icon.className = 'fa-solid fa-pause';
                        }).catch(() => {
                            const icon = playBtn.querySelector('i');
                            if (icon) icon.className = 'fa-solid fa-play';
                        });
                    } else {
                        const icon = playBtn.querySelector('i');
                        if (icon) icon.className = 'fa-solid fa-rotate-right';
                        progressBar.style.width = '100%';
                    }
                }
            });

            a.addEventListener('error', () => {
                if (idx === currentTrackIdx) {
                    if (statusMsg) {
                        statusMsg.textContent = `Copia il file "${tracks[idx]}" nella cartella "audios/" per sbloccare la riproduzione.`;
                        statusMsg.style.display = 'block';
                    }
                    const icon = playBtn.querySelector('i');
                    if (icon) icon.className = 'fa-solid fa-play';
                }
            });
        }

        audios.forEach((a, idx) => bindAudioEvents(a, idx));

        // Click sul pulsante Play/Pause
        playBtn.addEventListener('click', () => {
            const icon = playBtn.querySelector('i');

            if (icon && icon.classList.contains('fa-rotate-right')) {
                audio.currentTime = 0;
                progressBar.style.width = '0%';
            }

            if (audio.paused) {
                activeAudioInstances.forEach(inst => {
                    const instAudio = inst.getCurrentAudio ? inst.getCurrentAudio() : inst.audio;
                    if (instAudio && instAudio !== audio && !instAudio.paused) {
                        instAudio.pause();
                        const btnIcon = inst.playerEl.querySelector('.player-play-btn i');
                        if (btnIcon) {
                            if (instAudio.currentTime === 0 && instAudio.ended) {
                                btnIcon.className = 'fa-solid fa-rotate-right';
                            } else {
                                btnIcon.className = 'fa-solid fa-play';
                            }
                        }
                    }
                });

                if (statusMsg) {
                    statusMsg.style.display = 'none';
                    statusMsg.textContent = '';
                }

                audio.play().then(() => {
                    if (icon) icon.className = 'fa-solid fa-pause';
                }).catch(err => {
                    console.warn("Riproduzione audio locale fallita:", err);
                    if (statusMsg) {
                        statusMsg.textContent = `Copia il file "${tracks[currentTrackIdx]}" in "audios/" per sbloccare la riproduzione.`;
                        statusMsg.style.display = 'block';
                    }
                    if (icon) icon.className = 'fa-solid fa-play';
                });
            } else {
                audio.pause();
                if (icon) icon.className = 'fa-solid fa-play';
            }
        });

        // Click sulla barra di avanzamento per spostarsi nella traccia
        if (progressBarContainer) {
            progressBarContainer.addEventListener('click', (e) => {
                const rect = progressBarContainer.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const width = rect.width;
                if (audio.duration) {
                    const icon = playBtn.querySelector('i');
                    if (icon && icon.classList.contains('fa-rotate-right')) {
                        icon.className = 'fa-solid fa-play';
                    }
                    audio.currentTime = (clickX / width) * audio.duration;
                }
            });
        }
    });
}

function initPageTransitions() {
    const curtain = document.querySelector('.page-curtain');
    if (curtain) {
        curtain.style.display = 'none';
    }
}

function initDropdowns() {
    const dropdown = document.querySelector('.nav-dropdown');
    const trigger = document.querySelector('.nav-dropdown .dropdown-trigger');
    if (!dropdown || !trigger) return;

    // Logica di click per aprire/chiudere il menu a tendina ed evitare salti di scroll della pagina
    trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropdown.classList.toggle('active');
    });

    // Chiude il menu a tendina cliccando fuori
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });
}

function initScrollToLineup() {
    const btn = document.getElementById('scopri-lineup-btn');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById('ospiti-2026');
        if (!target) return;

        // Calcola l'offset (la navbar fissa è alta 80px)
        const offset = 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

        // Animazione di scroll fluido personalizzata
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        // Aggiunge un'animazione di pulsazione temporanea al titolo della sezione ospiti
        const title = target.querySelector('.slider-title');
        if (title) {
            title.classList.remove('highlight-pulse');
            // forza il reflow
            void title.offsetWidth;
            title.classList.add('highlight-pulse');

            // Rimuove la classe al termine dell'animazione
            setTimeout(() => {
                title.classList.remove('highlight-pulse');
            }, 1000);
        }
    });
}

function init3DTilt() {
    if (window.innerWidth <= 768) return;
    const cards = document.querySelectorAll('.artist-slider-card');

    cards.forEach(card => {
        const wrapper = card.querySelector('.card-img-wrapper') || card.querySelector('.card-full-photo');
        if (!wrapper) return;

        let cardTiltRaf = null;
        card.addEventListener('mousemove', (e) => {
            if (cardTiltRaf) return;
            cardTiltRaf = requestAnimationFrame(() => {
            const rect = card.getBoundingClientRect();
            // Ottiene la posizione del mouse relativa alla card
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calcola le coordinate normalizzate (da -1 a 1)
            const xc = ((x / rect.width) - 0.5) * 2;
            const yc = ((y / rect.height) - 0.5) * -2; // Inverte l'asse Y

            // Angolo massimo di inclinazione in gradi
            const maxTilt = 15;
            const rotateX = yc * maxTilt;
            const rotateY = xc * maxTilt;

            // Applica la rotazione 3D e l'ombra dinamica
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
            card.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease';
            card.style.boxShadow = `${14 + xc * 6}px ${14 + yc * -6}px 0px var(--text-black)`;

            // Movimento parallasse per la foto di sfondo
            const photo = card.querySelector('.card-full-photo');
            if (photo) {
                const transX = xc * 12; // sposta l'immagine orizzontalmente fino a 12px
                const transY = yc * -12; // sposta l'immagine verticalmente fino a 12px
                photo.style.transform = `scale(1.12) rotate(1.5deg) translateX(${transX}px) translateY(${transY}px)`;
                photo.style.transition = 'transform 0.1s ease';
            }
            cardTiltRaf = null;
            }); // fine rAF
        }, { passive: true });

        card.addEventListener('mouseleave', () => {
            // Ripristina gli stili originali con una transizione fluida
            card.style.transform = '';
            card.style.transition = 'transform 2s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease';
            card.style.boxShadow = '';

            const photo = card.querySelector('.card-full-photo');
            if (photo) {
                photo.style.transform = '';
                photo.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            }
        });
    });
}

function initEmailObfuscation() {
    // Ricostruisce e mostra dinamicamente gli indirizzi email
    const emailDisplays = document.querySelectorAll('.secure-email-display');
    emailDisplays.forEach(el => {
        const user = el.getAttribute('data-user');
        const domain = el.getAttribute('data-domain');
        if (user && domain) {
            el.textContent = `${user}@${domain}`;
        }
    });

    // Gestisce il redirect al click in modo sicuro con un cooldown anti-spam
    const emailLinks = document.querySelectorAll('.secure-email-link');
    emailLinks.forEach(link => {
        let isCooldown = false;
        const btn = link.querySelector('.postcard-click-action');
        const originalHtml = btn ? btn.innerHTML : '';

        link.addEventListener('click', (e) => {
            e.preventDefault();
            if (isCooldown) return;

            const user = link.getAttribute('data-user');
            const domain = link.getAttribute('data-domain');
            const subject = link.getAttribute('data-subject') || '';
            if (user && domain) {
                let mailtoUrl = `mailto:${user}@${domain}`;
                if (subject) {
                    mailtoUrl += `?subject=${encodeURIComponent(subject)}`;
                }

                // Attiva lo stato di cooldown
                isCooldown = true;
                if (btn) {
                    btn.innerHTML = `<i class="fa-solid fa-check"></i> Email aperta!`;
                    btn.style.backgroundColor = '#1a1a1a';
                    btn.style.color = '#ffe29e';
                    btn.style.boxShadow = '3px 3px 0px #d15654';
                }

                // Reindirizza al client di posta
                window.location.href = mailtoUrl;

                // Ripristina dopo 6 secondi
                setTimeout(() => {
                    isCooldown = false;
                    if (btn) {
                        btn.innerHTML = originalHtml;
                        btn.style.backgroundColor = '';
                        btn.style.color = '';
                        btn.style.boxShadow = '';
                    }
                }, 6000);
            }
        });
    });
}

function initLazyLoading() {
    const lazyBackgrounds = document.querySelectorAll('[data-bg]');
    const lazyImages = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;

                // Se è un'immagine di sfondo
                if (target.dataset.bg) {
                    target.style.backgroundImage = `url('${target.dataset.bg}')`;
                    target.classList.remove('lazy-bg');
                }

                // Se è un normale tag img
                if (target.dataset.src) {
                    target.src = target.dataset.src;
                    if (target.dataset.srcset) {
                        target.srcset = target.dataset.srcset;
                    }
                }

                observer.unobserve(target);
            }
        });
    }, {
        rootMargin: '150px 0px', // Precarica le immagini 150px prima che entrino nel viewport
        threshold: 0.01
    });

    lazyBackgrounds.forEach(bg => imageObserver.observe(bg));
    lazyImages.forEach(img => imageObserver.observe(img));
}

function initAccordion() {
    const headers = document.querySelectorAll('.accordion-header');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isActive = item.classList.contains('active');

            document.querySelectorAll('.accordion-item').forEach(el => {
                el.classList.remove('active');
            });

            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

function initLanguageSwitcher() {
    const preferredLang = localStorage.getItem('preferred-lang') || 'it';
    setLanguage(preferredLang);

    // Ascolta i click sui pulsanti del selettore di lingua
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.lang-btn');
        if (btn) {
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);
        }
    });
}

function setLanguage(lang) {
    if (lang === 'en') {
        document.body.classList.add('lang-en-active');
    } else {
        document.body.classList.remove('lang-en-active');
    }
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('preferred-lang', lang);

    // Aggiorna la classe active su tutti i pulsanti corrispondenti a data-lang
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}
