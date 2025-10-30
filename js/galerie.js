// galerie.js - Komplett überarbeitet mit Lazy Loading und Performance-Optimierungen

document.addEventListener('DOMContentLoaded', function() {
    // Galerie-Funktionalität mit Lazy Loading
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    const lightboxLoading = lightbox.querySelector('.lightbox-loading');
    const mehrButton = document.getElementById('mehrBilderBtn');

    let currentImages = [];
    let currentIndex = 0;

    // Alle verfügbaren Bilder mit Thumbnail und Fullsize Pfaden
    const allImages = [
        {
            thumbnail: 'images/thumbnails/wimpern_thumb.jpg',
            fullsize: 'images/fullsize/wimpern_full.jpg',
            alt: 'Beispiel Nageldesign 1'
        },
        {
            thumbnail: 'images/thumbnails/unnamed-2_thumb.jpg',
            fullsize: 'images/fullsize/unnamed-2_full.jpg',
            alt: 'Beispiel Nageldesign 2'
        },
        {
            thumbnail: 'images/thumbnails/unnamed_thumb.jpg',
            fullsize: 'images/fullsize/unnamed_full.jpg',
            alt: 'Beispiel Nageldesign 3'
        },
        {
            thumbnail: 'images/thumbnails/unnamed-3_thumb.jpg',
            fullsize: 'images/fullsize/unnamed-3_full.jpg',
            alt: 'Beispiel Nageldesign 4'
        },
        {
            thumbnail: 'images/thumbnails/unnamed-4_thumb.jpg',
            fullsize: 'images/fullsize/unnamed-4_full.jpg',
            alt: 'Beispiel Nageldesign 5'
        },
        {
            thumbnail: 'images/thumbnails/unnamed-5_thumb.jpg',
            fullsize: 'images/fullsize/unnamed-5_full.jpg',
            alt: 'Beispiel Nageldesign 6'
        },
        {
            thumbnail: 'images/thumbnails/unnamed-6_thumb.jpg',
            fullsize: 'images/fullsize/unnamed-6_full.jpg',
            alt: 'Beispiel Nageldesign 7'
        },
        {
            thumbnail: 'images/thumbnails/unnamed-7_thumb.jpg',
            fullsize: 'images/fullsize/unnamed-7_full.jpg',
            alt: 'Beispiel Nageldesign 8'
        },
        {
            thumbnail: 'images/thumbnails/unnamed-8_thumb.jpg',
            fullsize: 'images/fullsize/unnamed-8_full.jpg',
            alt: 'Beispiel Nageldesign 9'
        },
        // Weitere Bilder für den "Mehr"-Button
        {
            thumbnail: 'images/thumbnails/unnamed-2_thumb.jpg',
            fullsize: 'images/fullsize/unnamed-2_full.jpg',
            alt: 'Beispiel Nageldesign 10'
        },
        {
            thumbnail: 'images/thumbnails/unnamed_thumb.jpg',
            fullsize: 'images/fullsize/unnamed_full.jpg',
            alt: 'Beispiel Nageldesign 11'
        },
        {
            thumbnail: 'images/thumbnails/unnamed-3_thumb.jpg',
            fullsize: 'images/fullsize/unnamed-3_full.jpg',
            alt: 'Beispiel Nageldesign 12'
        },
        {
            thumbnail: 'images/thumbnails/unnamed-4_thumb.jpg',
            fullsize: 'images/fullsize/unnamed-4_full.jpg',
            alt: 'Beispiel Nageldesign 13'
        },
        {
            thumbnail: 'images/thumbnails/unnamed-5_thumb.jpg',
            fullsize: 'images/fullsize/unnamed-5_full.jpg',
            alt: 'Beispiel Nageldesign 14'
        },
        {
            thumbnail: 'images/thumbnails/unnamed-6_thumb.jpg',
            fullsize: 'images/fullsize/unnamed-6_full.jpg',
            alt: 'Beispiel Nageldesign 15'
        }
    ];

    // Initiale Bilder anzeigen
    let displayedImages = 9;
    currentImages = allImages.slice(0, displayedImages);

    // Lazy Loading für Thumbnails initialisieren
    initLazyLoading();

    // Event Listener für Bild-Klicks
    document.querySelectorAll('.bilder img').forEach((img, index) => {
        img.addEventListener('click', () => openLightbox(index));
    });

    // Lightbox Funktionen mit Progressivem Loading
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
        lightboxLoading.classList.add('active');
        lightboxImg.classList.add('blur');
    }

    function hideLightboxLoading() {
        lightboxLoading.classList.remove('active');
        lightboxImg.classList.remove('blur');
    }

    function updateLightboxImage() {
        const image = currentImages[currentIndex];

        // Setze Thumbnail als Platzhalter
        lightboxImg.src = image.thumbnail;
        lightboxImg.alt = image.alt;
        lightboxImg.classList.add('blur');

        // Lade Fullsize-Bild im Hintergrund
        const fullsizeImage = new Image();
        fullsizeImage.onload = function() {
            lightboxImg.src = image.fullsize;
            lightboxImg.classList.remove('blur');
            lightboxImg.classList.add('sharp');
            hideLightboxLoading();
        };

        fullsizeImage.onerror = function() {
            // Fallback: Bleibe beim Thumbnail falls Fullsize fehlt
            console.warn('Fullsize Bild konnte nicht geladen werden:', image.fullsize);
            lightboxImg.classList.remove('blur');
            hideLightboxLoading();
        };

        fullsizeImage.src = image.fullsize;
    }

    function showNextImage() {
        currentIndex = (currentIndex + 1) % currentImages.length;
        showLightboxLoading();
        updateLightboxImage();
    }

    function showPrevImage() {
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        showLightboxLoading();
        updateLightboxImage();
    }

    // Event Listener
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrevImage);
    lightboxNext.addEventListener('click', showNextImage);

    // Tastatur-Navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    showPrevImage();
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
            }
        }
    });

    // Klick außerhalb des Bildes schließt die Lightbox
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Lazy Loading Implementation
    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('.lazy-image');

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    preloadImage(img);
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    function preloadImage(img) {
        // Erstelle ein neues Image-Objekt zum Vorladen
        const tempImage = new Image();
        tempImage.onload = function() {
            // Bild ist geladen, zeige es an
            img.classList.add('loaded');
        };
        tempImage.src = img.src;
    }

    // "Mehr Bilder" Funktion mit Lazy Loading
    mehrButton.addEventListener('click', function() {
        const bilderContainer = document.querySelector('.bilder');
        const startIndex = displayedImages;
        displayedImages += 6;

        for (let i = startIndex; i < displayedImages && i < allImages.length; i++) {
            const imgData = allImages[i];
            const img = document.createElement('img');
            img.src = imgData.thumbnail;
            img.dataset.fullsize = imgData.fullsize;
            img.alt = imgData.alt;
            img.loading = 'lazy';
            img.classList.add('lazy-image');

            img.addEventListener('click', () => {
                const index = Array.from(bilderContainer.children).indexOf(img);
                openLightbox(index);
            });

            bilderContainer.appendChild(img);

            // Lazy Loading für neues Bild initialisieren
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        preloadImage(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            });
            imageObserver.observe(img);
        }

        currentImages = Array.from(bilderContainer.children).map(img => ({
            thumbnail: img.src,
            fullsize: img.dataset.fullsize,
            alt: img.alt
        }));

        if (displayedImages >= allImages.length) {
            mehrButton.disabled = true;
            mehrButton.textContent = 'Alle Bilder geladen';
        }
    });

    // Preload erste 3 Bilder sofort für bessere UX
    function preloadFirstImages() {
        const firstImages = document.querySelectorAll('.lazy-image');
        for (let i = 0; i < Math.min(3, firstImages.length); i++) {
            preloadImage(firstImages[i]);
        }
    }

    // Starte Preloading der ersten Bilder
    preloadFirstImages();
});