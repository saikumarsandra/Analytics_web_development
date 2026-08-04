(function () {
  function getProductId() {
    return new URLSearchParams(window.location.search).get("id");
  }

  function wireQuantity(product) {
    const input = Utils.qs("#qty-input");
    Utils.qs("#qty-minus").addEventListener("click", () => {
      input.value = Math.max(1, Number(input.value) - 1);
    });
    Utils.qs("#qty-plus").addEventListener("click", () => {
      input.value = Math.min(product.stock, Number(input.value) + 1);
    });
    Utils.qs("#pdp-add-to-cart").addEventListener("click", () => {
      const qty = Math.min(product.stock, Math.max(1, Number(input.value) || 1));
      Store.addToCart(product.id, qty);
      window.dispatchEvent(new Event("cart:updated"));
      Utils.toast(`Added ${qty} to cart.`);
    });
  }

  function wireNotifyForm(product) {
    const form = Utils.qs("#notify-form");
    const emailField = Utils.qs("input[name='email']", form);
    const wrapper = emailField.closest(".field");
    const success = Utils.qs(".notify-success");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = emailField.value.trim();
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!valid) {
        wrapper.classList.add("has-error");
        return;
      }
      wrapper.classList.remove("has-error");
      Store.subscribeRestock(product.id, email);
      form.hidden = true;
      success.classList.add("visible");
    });
  }

  function renderStockAndActions(product) {
    const box = Utils.qs("#pdp-stock-actions");
    if (product.stock > 0) {
      box.innerHTML = `
        <span class="stock-badge in-stock">● In stock — ${product.stock} left</span>
        <div class="qty-row">
          <div class="qty-stepper">
            <button type="button" id="qty-minus" aria-label="Decrease quantity">−</button>
            <input type="number" id="qty-input" value="1" min="1" max="${product.stock}" aria-label="Quantity" />
            <button type="button" id="qty-plus" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <div class="pdp-actions">
          <button type="button" class="btn btn-primary" id="pdp-add-to-cart">Add to cart</button>
        </div>`;
      wireQuantity(product);
    } else {
      box.innerHTML = `
        <span class="stock-badge out-of-stock">● Out of stock</span>
        <p>We've sold out of this one for now. Leave your email and we'll let you know the moment it's back.</p>
        <form class="notify-form" id="notify-form" novalidate>
          <div class="field">
            <label for="notify-email">Email address</label>
            <input type="email" id="notify-email" name="email" placeholder="you@example.com" required />
            <div class="field-error-msg">Please enter a valid email address.</div>
          </div>
          <button type="submit" class="btn btn-outline">Notify me when back in stock</button>
        </form>
        <p class="notify-success" role="status">✓ You're on the list — we'll email you the moment it's restocked.</p>`;
      wireNotifyForm(product);
    }
  }

  function renderProduct(product) {
    document.title = `${product.name} — The Considered Market`;
    Utils.qs("#breadcrumb-category").textContent = product.category;
    Utils.qs("#breadcrumb-category").href = `shop.html#${product.category.toLowerCase()}`;
    Utils.qs("#breadcrumb-name").textContent = product.name;

    Utils.qs("#pdp-gallery-img").src = product.image;
    Utils.qs("#pdp-gallery-img").alt = product.name;
    Utils.qs("#pdp-category").textContent = product.category;
    Utils.qs("#pdp-name").textContent = product.name;
    Utils.qs("#pdp-rating").innerHTML = `<span class="stars">${Nav.renderStars(product.rating)}</span> ${product.rating.toFixed(1)} (${product.reviews} reviews)`;
    Utils.qs("#pdp-description").textContent = product.description;

    const hasDiscount = product.discount > 0;
    const finalPrice = product.price * (1 - (product.discount || 0));
    Utils.qs("#pdp-price-now").textContent = Utils.formatCurrency(finalPrice);
    const wasEl = Utils.qs("#pdp-price-was");
    wasEl.hidden = !hasDiscount;
    if (hasDiscount) wasEl.textContent = Utils.formatCurrency(product.price);

    renderStockAndActions(product);
  }

  function renderRecommendations(product) {
    const rail = Utils.qs("#pdp-recs");
    if (!rail) return;
    const recs = Store.getRecommendations(product.category, product.id, 4);
    rail.innerHTML = recs.map(Nav.productCardHtml).join("");
    Nav.initAddToCartButtons(rail);
  }

  function renderReviews(product) {
    const list = Utils.qs("#pdp-reviews-list");
    const reviews = Store.reviewsFor(product.id);
    Utils.qs("#pdp-reviews-count").textContent = reviews.length;
    list.innerHTML = reviews
      .map(
        (r) => `
      <div class="review-item">
        <div class="review-item-head">
          <span class="review-item-author">${Utils.escapeHtml(r.author)}</span>
          <span class="stars">${Nav.renderStars(r.rating)}</span>
        </div>
        <p>${Utils.escapeHtml(r.text)}</p>
      </div>`
      )
      .join("");
  }

  function wireReviewForm(product) {
    const form = Utils.qs("#review-form");
    const buttons = Utils.qsa(".rating-select button", form);
    let selectedRating = 5;

    buttons.forEach((btn) => {
      btn.classList.toggle("selected", Number(btn.dataset.rating) === selectedRating);
      btn.addEventListener("click", () => {
        selectedRating = Number(btn.dataset.rating);
        buttons.forEach((b) => b.classList.toggle("selected", b === btn));
      });
    });

    const nameField = Utils.qs("input[name='author']", form);
    const textField = Utils.qs("textarea[name='text']", form);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      [nameField, textField].forEach((field) => {
        const wrapper = field.closest(".field");
        if (!field.value.trim()) {
          wrapper.classList.add("has-error");
          valid = false;
        } else {
          wrapper.classList.remove("has-error");
        }
      });
      if (!valid) return;

      Store.addReview(product.id, { author: nameField.value.trim(), rating: selectedRating, text: textField.value.trim() });
      form.reset();
      selectedRating = 5;
      buttons.forEach((b) => b.classList.toggle("selected", Number(b.dataset.rating) === 5));
      renderReviews(product);
      Utils.toast("Thanks — your review has been posted.");
    });
  }

  function init() {
    const id = getProductId();
    const product = id && Store.getProductById(id);
    if (!product) {
      Utils.qs("main .container").innerHTML = `<div class="empty-state"><h3>Product not found</h3><p>It may have been removed. <a href="shop.html">Back to shop</a>.</p></div>`;
      return;
    }
    renderProduct(product);
    renderRecommendations(product);
    renderReviews(product);
    wireReviewForm(product);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
