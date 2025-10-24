// galerie.js
document.addEventListener('DOMContentLoaded', function() {
    // Galerie-Funktionalität
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    const mehrButton = document.getElementById('mehrBilderBtn');

    let currentImages = [];
    let currentIndex = 0;

    // Alle verfügbaren Bilder
    const allImages = [
        {src: '../images/481218492_613674024886257_6781189343604223364_n.jpg', alt: 'Beispiel Nageldesign 1'},
        {src: '../images/unnamed-2.jpg', alt: 'Beispiel Nageldesign 2'},
        {src: '../images/unnamed.jpg', alt: 'Beispiel Nageldesign 3'},
        {src: '../images/unnamed-3.jpg', alt: 'Beispiel Nageldesign 4'},
        {src: '../images/unnamed-4.jpg', alt: 'Beispiel Nageldesign 5'},
        {src: '../images/unnamed-5.jpg', alt: 'Beispiel Nageldesign 6'},
        {src: '../images/unnamed-6.jpg', alt: 'Beispiel Nageldesign 7'},
        {src: '../images/unnamed-7.jpg', alt: 'Beispiel Nageldesign 8'},
        {src: '../images/unnamed-8.jpg', alt: 'Beispiel Nageldesign 9'},
        // Weitere Bilder für den "Mehr"-Button
        {src: '../images/unnamed-2.jpg', alt: 'Beispiel Nageldesign 10'},
        {src: '../images/unnamed.jpg', alt: 'Beispiel Nageldesign 11'},
        {src: '../images/unnamed-3.jpg', alt: 'Beispiel Nageldesign 12'},
        {src: '../images/unnamed-4.jpg', alt: 'Beispiel Nageldesign 13'},
        {src: '../images/unnamed-5.jpg', alt: 'Beispiel Nageldesign 14'},
        {src: '../images/unnamed-6.jpg', alt: 'Beispiel Nageldesign 15'}
    ];

    // Initiale Bilder anzeigen
    let displayedImages = 9;
    currentImages = allImages.slice(0, displayedImages);

    // Event Listener für Bild-Klicks
    document.querySelectorAll('.bilder img').forEach((img, index) => {
        img.addEventListener('click', () => openLightbox(index));
    });

    // Lightbox Funktionen
    function openLightbox(index) {
        currentIndex = index;
        updateLightboxImage();
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function updateLightboxImage() {
        const image = currentImages[currentIndex];
        lightboxImg.src = image.src;
        lightboxImg.alt = image.alt;
    }

    function showNextImage() {
        currentIndex = (currentIndex + 1) % currentImages.length;
        updateLightboxImage();
    }

    function showPrevImage() {
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
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

    // "Mehr Bilder" Funktion
    mehrButton.addEventListener('click', function() {
        const bilderContainer = document.querySelector('.bilder');
        const startIndex = displayedImages;
        displayedImages += 6;

        for (let i = startIndex; i < displayedImages && i < allImages.length; i++) {
            const imgData = allImages[i];
            const img = document.createElement('img');
            img.src = imgData.src;
            img.alt = imgData.alt;
            img.setAttribute('data-fullsize', imgData.src);

            img.addEventListener('click', () => {
                const index = Array.from(bilderContainer.children).indexOf(img);
                openLightbox(index);
            });

            bilderContainer.appendChild(img);
        }

        currentImages = Array.from(bilderContainer.children).map(img => ({
            src: img.getAttribute('data-fullsize'),
            alt: img.alt
        }));

        if (displayedImages >= allImages.length) {
            mehrButton.disabled = true;
            mehrButton.textContent = 'Alle Bilder geladen';
        }
    });
});