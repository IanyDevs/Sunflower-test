document.addEventListener('DOMContentLoaded', () => {
    initPageTransitions();
    initDropdowns();
    initScrollAnimations();
    initMobileMenu();
    initScrollSlide();
    initMapToggle();
    initHeroSlider();
    initNavbarScroll();
    initIframePlaceholders();
    initArtistModals();
    initCustomAudioPlayers();
    
    // Initialize countdown only if the container exists on the page
    if (document.getElementById('days-count')) {
        initCountdown();
    }
    
    initScrollToLineup();
    init3DTilt();
    initEmailObfuscation();
    initLazyLoading();
    initAccordion();
});

function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal-up');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% visible
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
    // Target date: July 11, 2026, 20:00:00
    const targetDate = new Date("July 11, 2026 20:00:00").getTime();

    const daysEl = document.getElementById('days-count');
    const hoursEl = document.getElementById('hours-count');
    const minsEl = document.getElementById('mins-count');
    const secsEl = document.getElementById('secs-count');

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            showExpiredMessage();
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        daysEl.innerText = days.toString().padStart(2, '0');
        hoursEl.innerText = hours.toString().padStart(2, '0');
        minsEl.innerText = minutes.toString().padStart(2, '0');
        secsEl.innerText = seconds.toString().padStart(2, '0');
    }

    function showExpiredMessage() {
        const titleEl = document.querySelector('.countdown-title');
        const containerEl = document.querySelector('.countdown-container');
        if (containerEl) {
            containerEl.style.display = "none";
        }

        const sectionEl = document.querySelector('.countdown-section');
        if (sectionEl && !sectionEl.querySelector('.countdown-expired-message')) {
            if (titleEl) {
                titleEl.remove();
            }

            const messageDiv = document.createElement('div');
            messageDiv.className = 'countdown-expired-message';
            messageDiv.innerHTML = `
                <h2 class="text-sunflower-imponente">HEY, IL SUNFLOWER È INIZIATO!</h2>
                <p class="expired-sub">CHE CI FAI ANCORA LÌ? VIENICI A TROVARE!</p>
            `;

            const testBtn = document.getElementById('test-timer-end');
            if (testBtn && testBtn.parentNode) {
                sectionEl.insertBefore(messageDiv, testBtn.parentNode);
            } else {
                sectionEl.appendChild(messageDiv);
            }
        }
    }

    // Setup temporary test button click listener
    const testBtn = document.getElementById('test-timer-end');
    if (testBtn) {
        testBtn.addEventListener('click', () => {
            showExpiredMessage();
            testBtn.style.display = "none";
        });
    }

    // Update immediately, then every second
    updateCountdown();
    const intervalId = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;
        if (distance < 0) {
            clearInterval(intervalId);
            showExpiredMessage();
        } else {
            updateCountdown();
        }
    }, 1000);
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
    
    window.addEventListener('scroll', () => {
        if (window.innerWidth <= 768) {
            sunflowerText.style.transform = '';
            festivalText.style.transform = '';
            return;
        }
        const scrolled = window.scrollY;
        // Adjust scroll translation speed
        const speed = 0.6; 
        
        sunflowerText.style.transform = `translateX(-${scrolled * speed}px)`;
        festivalText.style.transform = `translateX(${scrolled * speed}px)`;
    });
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

    // Keep only landscape images from assets/Foto-generali/
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
        'assets/Foto-generali/foto1.webp',
        'assets/Foto-generali/foto2.webp',
        'assets/Foto-generali/foto3.webp',
        'assets/Foto-generali/foto4.webp',
        'assets/Foto-generali/foto5.webp',
        'assets/Foto-generali/foto6.webp',
        'assets/Foto-generali/foto7.webp',
        'assets/Foto-generali/foto8.webp',
        'assets/Foto-generali/foto9.webp'
    ];

    // Fisher-Yates Shuffle
    for (let i = carouselImages.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [carouselImages[i], carouselImages[j]] = [carouselImages[j], carouselImages[i]];
    }

    // Clear static slides
    sliderContainer.innerHTML = '';

    // Create and append dynamic slides
    carouselImages.forEach((src, index) => {
        const slide = document.createElement('div');
        slide.className = `slide${index === 0 ? ' active' : ''}`;
        
        // Load only the first image immediately. Other images will be lazy loaded.
        if (index === 0) {
            slide.style.backgroundImage = `linear-gradient(rgba(26, 26, 26, 0.4), rgba(26, 26, 26, 0.4)), url('${src}')`;
        } else {
            slide.setAttribute('data-bg', src);
        }
        
        // Custom vertical positioning to prevent heads/details from being cut off
        const filename = src.split('/').pop();
        const customPositions = {
            'Foto10.webp': 'center 10%', // Black & White signs / girl with phone
            'Foto14.webp': 'center 22%', // Curly girl singing (chin and mic visible)
            'Foto19.webp': 'center 15%',
            'Foto22.webp': 'center 22%', // Guitar player with sunglasses (chin and mic visible)
            'foto1.webp': 'center 10%',
            'foto2.webp': 'center 12%',
            'foto3.webp': 'center 15%',
            'foto4.webp': 'center 10%',
            'foto5.webp': 'center 15%',
            'foto6.webp': 'center 12%',
            'foto7.webp': 'center 10%',
            'foto8.webp': 'center 32%', // Singer with cap and sunglasses (chin/mic visible)
            'foto9.webp': 'center 32%'  // Curly hair singer close up (chin/mic visible)
        };
        if (customPositions[filename]) {
            slide.style.backgroundPosition = customPositions[filename];
        } else {
            slide.style.backgroundPosition = 'center 15%'; // Default clean vertical alignment for landscape images
        }
        
        sliderContainer.appendChild(slide);
    });

    const slides = sliderContainer.querySelectorAll('.slide');
    if (slides.length <= 1) return;

    // Helper to load a slide's background image on demand
    function loadSlideImage(slideEl) {
        if (!slideEl) return;
        const bgSrc = slideEl.getAttribute('data-bg');
        if (bgSrc) {
            slideEl.style.backgroundImage = `linear-gradient(rgba(26, 26, 26, 0.4), rgba(26, 26, 26, 0.4)), url('${bgSrc}')`;
            slideEl.removeAttribute('data-bg');
        }
    }

    // Preload the second slide after a short delay so it's ready for the first transition
    setTimeout(() => {
        if (slides[1]) loadSlideImage(slides[1]);
    }, 1500);

    let currentSlide = 0;
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        
        // Ensure active slide is loaded
        loadSlideImage(slides[currentSlide]);
        slides[currentSlide].classList.add('active');
        
        // Preload the next slide in sequence so it's cached before the next transition
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
        
        // The navbar is fixed at viewport top (0 to 80px).
        // It overlaps the hero slides (images) if:
        // hero viewport top <= 80 (since navbar height is 80px)
        // AND
        // hero viewport bottom >= 0
        const isOverHero = (heroTop - scrollY <= 80) && (heroTop + heroHeight - scrollY >= 0);
        
        if (isOverHero) {
            nav.classList.add('transparent-nav');
        } else {
            nav.classList.remove('transparent-nav');
        }
    }
    
    // Set initial state
    handleScroll();
    
    // Listen for scroll and resize events
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
}

function initIframePlaceholders() {
    const wrappers = document.querySelectorAll('.iframe-wrapper');
    wrappers.forEach(wrapper => {
        const iframe = wrapper.querySelector('iframe');
        const placeholder = wrapper.querySelector('.iframe-placeholder');
        if (iframe && placeholder) {
            // Check if iframe is already loaded (e.g. from cache)
            try {
                if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
                    placeholder.classList.add('fade-out');
                    return;
                }
            } catch (e) {
                // Cross-origin browser safety block is expected, continue with load event listener
            }
            
            iframe.addEventListener('load', () => {
                placeholder.classList.add('fade-out');
            });
            
            // Fallback: fade out placeholder after 6.5s in case tracking blocker prevents load event
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

    // Global Floating Navigation Arrows inside the overlay
    const prevModalBtn = overlay.querySelector('.global-modal-nav-btn.prev-btn');
    const nextModalBtn = overlay.querySelector('.global-modal-nav-btn.next-btn');

    // Get array of all artist names in slide order
    const artistNames = Array.from(cards).map(c => c.getAttribute('data-artist')).filter(Boolean);

    function openModal(artistName) {
        // Stop any currently playing audio from another artist modal
        stopAllCustomAudioPlayers();

        // Find modal
        const targetModal = document.getElementById(`modal-${artistName}`);
        if (!targetModal) return;

        // Load Spotify iframe dynamically
        const iframe = targetModal.querySelector('iframe[data-src]');
        if (iframe && !iframe.src) {
            iframe.src = iframe.getAttribute('data-src');
        }

        // Deactivate any currently active modals just in case
        fullPages.forEach(p => p.classList.remove('active'));

        // Show overlay & target modal
        overlay.classList.add('active');
        targetModal.classList.add('active');
        targetModal.scrollTop = 0;

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        overlay.classList.remove('active');
        fullPages.forEach(p => {
            p.classList.remove('active');
            // Unload Spotify iframe to free up memory and stop background execution
            const iframe = p.querySelector('iframe[data-src]');
            if (iframe) {
                iframe.src = "";
            }
        });
        document.body.style.overflow = '';
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

    // Attach click listeners to the next/prev buttons
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

    // Attach click event to slider cards
    cards.forEach(card => {
        const artist = card.getAttribute('data-artist');
        if (artist) {
            card.addEventListener('click', () => {
                openModal(artist);
            });
        }
    });

    // Close on clicking close button
    closeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Stop propagation
            closeModal();
        });
    });

    // Close on clicking outside the modal content (the overlay background)
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    });

    // Close on ESC key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Slider Scroll logic
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    const sliderContainer = document.querySelector('.artists-slider-container');

    if (sliderContainer) {
        const gap = 40; // 2.5rem gap is 40px in 16px font-size
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

// Array to keep track of active audio elements for pausing on close
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
        
        // Fallback to single track if no numbered tracks found
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
            a.preload = 'auto'; // Force buffer preload
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

        // Track active audio instances
        activeAudioInstances.push({
            getCurrentAudio: () => audio,
            playerEl: player
        });

        // 1. Build and Inject Track Selector dynamically if there is more than 1 track
        if (tracks.length > 1) {
            let selectorContainer = player.querySelector('.player-track-selector');
            if (!selectorContainer) {
                selectorContainer = document.createElement('div');
                selectorContainer.className = 'player-track-selector';
                player.insertBefore(selectorContainer, player.firstChild);
            }
            
            // Build the selector buttons
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

            // 2. Build and Inject Skip Button dynamically next to the Play button
            let skipBtn = player.querySelector('.player-skip-btn');
            if (!skipBtn) {
                skipBtn = document.createElement('button');
                skipBtn.type = 'button';
                skipBtn.className = 'player-skip-btn';
                skipBtn.setAttribute('aria-label', 'Prossima Canzone');
                skipBtn.setAttribute('title', 'Skip Traccia');
                skipBtn.innerHTML = '<i class="fa-solid fa-forward-step"></i>';
                
                // Wrap playBtn and skipBtn in a group wrapper if not already grouped
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

        // Function to switch tracks
        function switchTrack(newIdx) {
            const wasPlaying = !audio.paused;
            audio.pause();
            
            currentTrackIdx = newIdx;
            audio = audios[currentTrackIdx];
            audio.currentTime = 0;
            progressBar.style.width = '0%';
            
            // Update Track name text
            if (trackNameEl) {
                trackNameEl.textContent = trackNames[currentTrackIdx];
            }
            
            // Update time display immediately if metadata is already loaded
            if (!isNaN(audio.duration)) {
                timeDuration.textContent = formatTime(audio.duration);
            } else {
                timeDuration.textContent = '0:00';
            }
            timeCurrent.textContent = '0:00';
            
            // Update Active Select buttons class
            const selectBtns = player.querySelectorAll('.track-select-btn');
            selectBtns.forEach((btn, i) => {
                if (i === currentTrackIdx) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            // Clear status message
            if (statusMsg) {
                statusMsg.style.display = 'none';
                statusMsg.textContent = '';
            }

            if (wasPlaying) {
                audio.play().then(() => {
                    const icon = playBtn.querySelector('i');
                    if (icon) icon.className = 'fa-solid fa-pause';
                }).catch(err => {
                    console.warn("Autoplay/load failed:", err);
                    const icon = playBtn.querySelector('i');
                    if (icon) icon.className = 'fa-solid fa-play';
                });
            } else {
                const icon = playBtn.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-play';
            }
        }

        // Create volume controls dynamically
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
        
        // Insert volumeContainer right after playBtn or after its wrapper
        const insertTarget = player.querySelector('.player-btn-group') || playBtn;
        if (insertTarget && insertTarget.parentNode) {
            insertTarget.parentNode.insertBefore(volumeContainer, insertTarget.nextSibling);
        }

        // Volume Control logic
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

        // Format time in seconds to mm:ss
        function formatTime(secs) {
            if (isNaN(secs)) return '0:00';
            const m = Math.floor(secs / 60);
            const s = Math.floor(secs % 60).toString().padStart(2, '0');
            return `${m}:${s}`;
        }

        // Setup event listeners for each Audio instance
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

        // Play/Pause button click
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
                    console.warn("Local audio playback failed:", err);
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

        // Click on progress bar for seeking
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

    // Click logic to toggle dropdown and prevent page scroll jumps
    trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropdown.classList.toggle('active');
    });

    // Close dropdown on click outside
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
        
        // Calculate offset (fixed navbar is 80px)
        const offset = 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        
        // Custom smooth scroll animation
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Add a temporary pulse animation to the guests section title
        const title = target.querySelector('.slider-title');
        if (title) {
            title.classList.remove('highlight-pulse');
            // trigger reflow
            void title.offsetWidth;
            title.classList.add('highlight-pulse');
            
            // Remove the class after the animation completes
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
        const wrapper = card.querySelector('.card-img-wrapper');
        if (!wrapper) return;
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            // Get mouse position relative to card
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate normalized coordinates (-1 to 1)
            const xc = ((x / rect.width) - 0.5) * 2;
            const yc = ((y / rect.height) - 0.5) * -2; // Invert Y axis
            
            // Maximum tilt angle in degrees
            const maxTilt = 15;
            const rotateX = yc * maxTilt;
            const rotateY = xc * maxTilt;
            
            // Apply 3D rotation and dynamic shadow rotation
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
            card.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease';
            card.style.boxShadow = `${14 + xc * 6}px ${14 + yc * -6}px 0px var(--text-black)`;
        });
        
        card.addEventListener('mouseleave', () => {
            // Restore original styles with smooth transition
            card.style.transform = '';
            card.style.transition = 'transform 2s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease';
            card.style.boxShadow = '';
        });
    });
}

function initEmailObfuscation() {
    // Reconstruct and display emails dynamically
    const emailDisplays = document.querySelectorAll('.secure-email-display');
    emailDisplays.forEach(el => {
        const user = el.getAttribute('data-user');
        const domain = el.getAttribute('data-domain');
        if (user && domain) {
            el.textContent = `${user}@${domain}`;
        }
    });

    // Handle click redirect safely with a rate-limit cooldown
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
                
                // Active cooldown state
                isCooldown = true;
                if (btn) {
                    btn.innerHTML = `<i class="fa-solid fa-check"></i> Email aperta!`;
                    btn.style.backgroundColor = '#1a1a1a';
                    btn.style.color = '#ffe29e';
                    btn.style.boxShadow = '3px 3px 0px #d15654';
                }

                // Redirect to mail client
                window.location.href = mailtoUrl;

                // Reset after 6 seconds
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
                
                // If it's a background image
                if (target.dataset.bg) {
                    target.style.backgroundImage = `url('${target.dataset.bg}')`;
                    target.classList.remove('lazy-bg');
                }
                
                // If it's a standard img tag
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
        rootMargin: '150px 0px', // Preload images 150px before they enter viewport
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







