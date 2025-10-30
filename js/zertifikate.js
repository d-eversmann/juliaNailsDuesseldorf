// zertifikate.js
document.addEventListener('DOMContentLoaded', function() {
    // Akkordeon Funktionalität
    const toggleButtons = document.querySelectorAll('.zertifikate-toggle');

    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            const target = this.nextElementSibling;

            this.setAttribute('aria-expanded', !expanded);
            target.hidden = expanded;

            // Text ändern
            const span = this.querySelector('span');
            span.textContent = expanded ?
                'Qualifikationen & Zertifikate anzeigen' :
                'Qualifikationen & Zertifikate ausblenden';
        });
    });

    // Lightbox für Zertifikate
    const zertifikatImages = document.querySelectorAll('.zertifikat-item img, .zertifikat-image img');
    const lightbox = document.createElement('div');
    lightbox.className = 'zertifikat-lightbox';
    lightbox.innerHTML = `
        <div class="zertifikat-lightbox-content">
            <button class="zertifikat-lightbox-close">&times;</button>
            <img src="" alt="">
        </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.zertifikat-lightbox-close');

    zertifikatImages.forEach(img => {
        img.addEventListener('click', function() {
            lightboxImg.src = this.src;
            lightboxImg.alt = this.alt;
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.style.display === 'flex') {
            closeLightbox();
        }
    });

    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});