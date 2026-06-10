// galerie.js -

document.addEventListener('DOMContentLoaded', function() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxVideo = lightbox.querySelector('.lightbox-video');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    const lightboxLoading = lightbox.querySelector('.lightbox-loading');
    const mehrButton = document.getElementById('mehrBilderBtn');
    const bilderContainer = document.querySelector('.bilder');

    // 1. Array mit allen 27 Bildern automatisch generieren
    const allImages = [];
    const totalImages = 27;

    for (let i = 1; i <= totalImages; i++) {
        // Zahl mit führender Null formatieren (1 -> "01", 10 -> "10")
        const num = i.toString().padStart(2, '0');

        // Jetzt einheitliches Schema: fotoXX_thumb.jpg
        allImages.push({
            type: 'image',
            thumbnail: `images/thumbnails/foto${num}_thumb.jpg`,
            fullsize: `images/fullsize/foto${num}_full.jpg`,
            alt: `Julia Nails & Beauty Design ${num}`
        });
    }

    const galleryVideos = [
        // Beispiel:
        // {
        //     type: 'video',
        //     thumbnail: 'images/thumbnails/video01_thumb.jpg',
        //     src: 'videos/video01.mp4',
        //     mimeType: 'video/mp4',
        //     alt: 'Julia Nails & Beauty Video 01'
        // }
    ];

    const galleryItems = [...allImages, ...galleryVideos];

    // Konfiguration
    let displayedCount = 0; // Wie viele sind aktuell sichtbar
    const initialBatch = 9; // Wie viele beim Start laden
    const loadBatch = 6;    // Wie viele beim Klick auf "Mehr" nachladen
    let currentIndex = 0;   // Aktueller Index in der Lightbox

    // 2. Funktion zum Rendern der Bilder
    function renderImages(count) {
        const fragment = document.createDocumentFragment();
        const start = displayedCount;
        const end = Math.min(displayedCount + count, galleryItems.length);

        for (let i = start; i < end; i++) {
            const item = galleryItems[i];
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'gallery-item';
            button.dataset.index = i;

            // Image Element erstellen
            const img = document.createElement('img');
            img.src = item.thumbnail; // Thumbnail sofort setzen
            img.alt = item.alt;
            img.classList.add('lazy-image');

            if (item.type === 'video') {
                const playBadge = document.createElement('span');
                playBadge.className = 'gallery-play-badge';
                playBadge.textContent = '▶';
                button.appendChild(playBadge);
            }

            // Event Listener für Lightbox
            button.addEventListener('click', function() {
                openLightbox(parseInt(this.dataset.index, 10));
            });

            button.appendChild(img);
            fragment.appendChild(button);
        }

        bilderContainer.appendChild(fragment);
        displayedCount = end;

        // Lazy Loading für die neu hinzugefügten Bilder aktivieren
        initLazyLoading();

        // Button ausblenden, wenn alle Bilder geladen sind
        if (displayedCount >= galleryItems.length) {
            mehrButton.style.display = 'none';
        }
    }

    // 3. Initialisierung: Container leeren und erste Bilder laden
    if (bilderContainer) {
        bilderContainer.innerHTML = '';
        renderImages(initialBatch);
    }

    // "Mehr Bilder" Button Event
    if (mehrButton) {
        mehrButton.addEventListener('click', function() {
            renderImages(loadBatch);
        });
    }

    // --- Lightbox Logik ---

    function openLightbox(index) {
        currentIndex = index;
        showLightboxLoading();
        updateLightboxImage();
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
        lightboxVideo.pause();
        lightboxVideo.removeAttribute('src');
        lightboxVideo.load();
        hideLightboxLoading();
    }

    function showLightboxLoading() {
        if(lightboxLoading) lightboxLoading.classList.add('active');
        lightboxImg.classList.add('blur');
    }

    function hideLightboxLoading() {
        if(lightboxLoading) lightboxLoading.classList.remove('active');
        lightboxImg.classList.remove('blur');
    }

    function updateLightboxImage() {
        const item = galleryItems[currentIndex];

        if (item.type === 'video') {
            lightboxImg.style.display = 'none';
            lightboxImg.removeAttribute('src');
            lightboxVideo.style.display = 'block';
            lightboxVideo.src = item.src;
            lightboxVideo.type = item.mimeType || 'video/mp4';
            lightboxVideo.setAttribute('aria-label', item.alt);
            hideLightboxLoading();
            lightboxVideo.load();
            return;
        }

        lightboxVideo.pause();
        lightboxVideo.style.display = 'none';
        lightboxVideo.removeAttribute('src');
        lightboxVideo.load();
        lightboxImg.style.display = 'block';

        // 1. Thumbnail als Platzhalter
        lightboxImg.src = item.thumbnail;
        lightboxImg.alt = item.alt;
        lightboxImg.classList.add('blur');

        // 2. Fullsize laden
        const fullsizeImage = new Image();
        fullsizeImage.onload = function() {
            if (galleryItems[currentIndex].fullsize === item.fullsize) {
                lightboxImg.src = item.fullsize;
                lightboxImg.classList.remove('blur');
                lightboxImg.classList.add('sharp');
                hideLightboxLoading();
            }
        };

        fullsizeImage.onerror = function() {
            console.warn('Bild nicht gefunden:', item.fullsize);
            hideLightboxLoading();
        };

        fullsizeImage.src = item.fullsize;
    }

    function showNextImage(e) {
        if(e) e.stopPropagation();
        currentIndex = (currentIndex + 1) % galleryItems.length;
        updateLightboxImage();
    }

    function showPrevImage(e) {
        if(e) e.stopPropagation();
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        updateLightboxImage();
    }

    // Event Listener für Lightbox Controls
    if(lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if(lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);
    if(lightboxNext) lightboxNext.addEventListener('click', showNextImage);

    // Tastatur-Navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            switch(e.key) {
                case 'Escape': closeLightbox(); break;
                case 'ArrowLeft': showPrevImage(); break;
                case 'ArrowRight': showNextImage(); break;
            }
        }
    });

    // Klick auf Hintergrund schließt
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // --- Lazy Loading Helper ---
    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('.lazy-image:not(.loaded)');

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }
});
