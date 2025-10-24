// nav.js
document.addEventListener("DOMContentLoaded", () => {
    const navHTML = `
    <header role="banner" class="site-header">
      <div class="header-top">
        <div class="header-container">
          <div class="title-row">
            <h1>Julia Nails &amp; Beauty</h1>
          </div>
        </div>
      </div>
      <nav aria-label="Hauptnavigation" class="main-nav">
        <div class="nav-container">
          <ul class="nav-content">
            <li><a href="index.html">Studioübersicht</a></li>
            <li><a href="Preisliste.html">Preisliste</a></li>
            <li><a href="Team.html">Unser Team</a></li>
            <li><a href="Galerie.html">Galerie</a></li>
            <li><a href="Bewertungen.html">Bewertungen</a></li>
            <li><a href="index.html#Kontakt">Kontakt</a></li>
          </ul>
        </div>
      </nav>
    </header>
  `;

    document.body.insertAdjacentHTML("afterbegin", navHTML);

    // Aktiver Link farblich hervorheben
    const currentPage = location.pathname.split("/").pop();
    document.querySelectorAll(".nav-content a").forEach(a => {
        if (a.getAttribute("href") === currentPage) {
            a.classList.add("active");
            a.setAttribute("aria-current", "page");
        }
    });
});