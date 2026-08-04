(function () {
  const PRICE_BANDS = [
    { id: "all", label: "All prices", test: () => true },
    { id: "under25", label: "Under £25", test: (p) => p < 25 },
    { id: "25-50", label: "£25 – £50", test: (p) => p >= 25 && p <= 50 },
    { id: "50-100", label: "£50 – £100", test: (p) => p > 50 && p <= 100 },
    { id: "over100", label: "£100 & above", test: (p) => p > 100 }
  ];
  const SORTS = {
    featured: { label: "Featured", fn: null },
    "price-asc": { label: "Price: Low to High", fn: (a, b) => a.price - b.price },
    "price-desc": { label: "Price: High to Low", fn: (a, b) => b.price - a.price },
    rating: { label: "Highest Rated", fn: (a, b) => b.rating - a.rating },
    name: { label: "Name: A–Z", fn: (a, b) => a.name.localeCompare(b.name) }
  };

  const state = { search: "", categories: new Set(), price: "all", sort: "featured" };

  function apply(products) {
    let list = products.filter((p) => {
      if (state.search && !p.name.toLowerCase().includes(state.search)) return false;
      if (state.categories.size && !state.categories.has(p.category)) return false;
      const band = PRICE_BANDS.find((b) => b.id === state.price);
      if (band && !band.test(p.price)) return false;
      return true;
    });
    const sortFn = SORTS[state.sort].fn;
    if (sortFn) list = list.slice().sort(sortFn);
    return list;
  }

  function renderResults(products) {
    const grid = Utils.qs("#plp-grid");
    const count = Utils.qs("#plp-count");
    const results = apply(products);
    count.textContent = `${results.length} product${results.length === 1 ? "" : "s"}`;
    grid.innerHTML = results.length
      ? results.map(Nav.productCardHtml).join("")
      : `<div class="empty-state"><h3>No products match your filters</h3><p>Try clearing a filter or searching for something else.</p></div>`;
    Nav.initAddToCartButtons(grid);
  }

  function renderCategoryFilters(products) {
    const box = Utils.qs("#filter-categories");
    const categories = [...new Set(products.map((p) => p.category))];
    box.innerHTML = categories
      .map((cat) => {
        const cnt = products.filter((p) => p.category === cat).length;
        const id = "cat-" + cat.toLowerCase();
        const checked = state.categories.has(cat) ? "checked" : "";
        return `
        <label class="filter-check" for="${id}">
          <input type="checkbox" id="${id}" value="${Utils.escapeHtml(cat)}" ${checked} />
          ${Utils.escapeHtml(cat)}
          <span class="count">${cnt}</span>
        </label>`;
      })
      .join("");
    Utils.qsa("input[type=checkbox]", box).forEach((cb) => {
      cb.addEventListener("change", () => {
        if (cb.checked) state.categories.add(cb.value);
        else state.categories.delete(cb.value);
        renderResults(products);
      });
    });
  }

  function renderPriceFilter() {
    const select = Utils.qs("#filter-price");
    select.innerHTML = PRICE_BANDS.map((b) => `<option value="${b.id}">${b.label}</option>`).join("");
    select.value = state.price;
  }

  function renderSortSelect() {
    const select = Utils.qs("#sort-select");
    select.innerHTML = Object.entries(SORTS).map(([id, s]) => `<option value="${id}">${s.label}</option>`).join("");
    select.value = state.sort;
  }

  function applyInitialHash(products) {
    const hash = decodeURIComponent(window.location.hash.replace("#", "")).toLowerCase();
    if (!hash || hash === "deals") return;
    const match = [...new Set(products.map((p) => p.category))].find((c) => c.toLowerCase() === hash);
    if (match) state.categories.add(match);
  }

  function init() {
    const products = Store.getProducts();
    applyInitialHash(products);
    renderCategoryFilters(products);
    renderPriceFilter();
    renderSortSelect();
    renderResults(products);

    Utils.qs("#filter-price").addEventListener("change", (e) => {
      state.price = e.target.value;
      renderResults(products);
    });
    Utils.qs("#sort-select").addEventListener("change", (e) => {
      state.sort = e.target.value;
      renderResults(products);
    });
    Utils.qs("#plp-search").addEventListener(
      "input",
      Utils.debounce((e) => {
        state.search = e.target.value.trim().toLowerCase();
        renderResults(products);
      }, 200)
    );
    Utils.qs("#filter-clear").addEventListener("click", () => {
      state.search = "";
      state.categories.clear();
      state.price = "all";
      state.sort = "featured";
      Utils.qs("#plp-search").value = "";
      renderCategoryFilters(products);
      renderPriceFilter();
      renderSortSelect();
      renderResults(products);
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
