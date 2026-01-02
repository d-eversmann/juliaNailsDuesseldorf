// galerie.js -

document.addEventListener('DOMContentLoaded', function() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-img');
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
            thumbnail: `images/thumbnails/foto${num}_thumb.jpg`,
            fullsize: `images/fullsize/foto${num}_full.jpg`,
            alt: `Julia Nails & Beauty Design ${num}`
        });
    }

    // Konfiguration
    let displayedCount = 0; // Wie viele sind aktuell sichtbar
    const initialBatch = 9; // Wie viele beim Start laden
    const loadBatch = 6;    // Wie viele beim Klick auf "Mehr" nachladen
    let currentIndex = 0;   // Aktueller Index in der Lightbox

    // 2. Funktion zum Rendern der Bilder
    function renderImages(count) {
        const fragment = document.createDocumentFragment();
        const start = displayedCount;
        const end = Math.min(displayedCount + count, allImages.length);

        for (let i = start; i < end; i++) {
            const imgData = allImages[i];

            // Image Element erstellen
            const img = document.createElement('img');
            img.src = imgData.thumbnail; // Thumbnail sofort setzen
            img.dataset.fullsize = imgData.fullsize;
            img.dataset.index = i; // Index speichern für Lightbox
            img.alt = imgData.alt;
            img.classList.add('lazy-image');

            // Event Listener für Lightbox
            img.addEventListener('click', function() {
                openLightbox(parseInt(this.dataset.index));
            });

            fragment.appendChild(img);
        }

        bilderContainer.appendChild(fragment);
        displayedCount = end;

        // Lazy Loading für die neu hinzugefügten Bilder aktivieren
        initLazyLoading();

        // Button ausblenden, wenn alle Bilder geladen sind
        if (displayedCount >= allImages.length) {
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
        const image = allImages[currentIndex];

        // 1. Thumbnail als Platzhalter
        lightboxImg.src = image.thumbnail;
        lightboxImg.alt = image.alt;
        lightboxImg.classList.add('blur');

        // 2. Fullsize laden
        const fullsizeImage = new Image();
        fullsizeImage.onload = function() {
            if (allImages[currentIndex].fullsize === image.fullsize) {
                lightboxImg.src = image.fullsize;
                lightboxImg.classList.remove('blur');
                lightboxImg.classList.add('sharp');
                hideLightboxLoading();
            }
        };

        fullsizeImage.onerror = function() {
            console.warn('Bild nicht gefunden:', image.fullsize);
            hideLightboxLoading();
        };

        fullsizeImage.src = image.fullsize;
    }

    function showNextImage(e) {
        if(e) e.stopPropagation();
        currentIndex = (currentIndex + 1) % allImages.length;
        updateLightboxImage();
    }

    function showPrevImage(e) {
        if(e) e.stopPropagation();
        currentIndex = (currentIndex - 1 + allImages.length) % allImages.length;
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