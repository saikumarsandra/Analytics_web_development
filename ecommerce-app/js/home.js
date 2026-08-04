(function () {
  function railSectionHtml(id, eyebrow, title, items) {
    return `
      <section class="section rail-section" id="${id}">
        <div class="container">
          <div class="rail-head">
            <div>
              <span class="eyebrow">${Utils.escapeHtml(eyebrow)}</span>
              <h2>${Utils.escapeHtml(title)}</h2>
            </div>
            <a href="shop.html#${id}" class="btn-text">View all</a>
          </div>
          <div class="rail" aria-label="${Utils.escapeHtml(title)} products">
            ${items.map(Nav.productCardHtml).join("")}
          </div>
        </div>
      </section>`;
  }

  function renderHome() {
    const container = Utils.qs("#category-rails");
    if (!container) return;
    const products = Store.getProducts();

    let html = "";

    const deals = products.filter((p) => p.discount > 0);
    if (deals.length) {
      html += railSectionHtml("deals", "Limited time", "Today's deals", deals);
    }

    const categories = [...new Set(products.map((p) => p.category))];
    categories.forEach((cat) => {
      const items = products.filter((p) => p.category === cat);
      html += railSectionHtml(cat.toLowerCase(), "Shop " + cat, cat, items);
    });

    container.innerHTML = html;
    Nav.initAddToCartButtons(container);
  }

  document.addEventListener("DOMContentLoaded", renderHome);
})();
