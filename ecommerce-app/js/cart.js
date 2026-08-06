(function () {
  function renderCart() {
    const items = Store.cartDetailed();
    const recsSection = Utils.qs("#cart-recs-section");

    if (!items.length) {
      Utils.qs("#cart-content").innerHTML = `
        <div class="empty-state">
          <h3>Your cart is empty</h3>
          <p>Browse the shop and find something you'll actually use.</p>
          <a href="shop.html" class="btn btn-primary" style="margin-top:var(--space-4);display:inline-flex;">Continue shopping</a>
        </div>`;
      recsSection.hidden = true;
      return;
    }

    Utils.qs("#cart-items").innerHTML = items
      .map(
        (line) => `
      <div class="cart-item">
        <div class="cart-item-thumb"><img src="${line.product.image}" alt="${Utils.escapeHtml(line.product.name)}" /></div>
        <div class="cart-item-body">
          <div class="cart-item-top">
            <span class="cart-item-name"><a href="product.html?id=${encodeURIComponent(line.product.id)}">${Utils.escapeHtml(line.product.name)}</a></span>
            <button type="button" class="cart-item-remove" data-remove="${line.product.id}">Remove</button>
          </div>
          <div class="cart-item-bottom">
            <div class="qty-stepper">
              <button type="button" data-qty-minus="${line.product.id}" aria-label="Decrease quantity">−</button>
              <input type="number" value="${line.qty}" min="1" data-qty-input="${line.product.id}" aria-label="Quantity for ${Utils.escapeHtml(line.product.name)}" />
              <button type="button" data-qty-plus="${line.product.id}" aria-label="Increase quantity">+</button>
            </div>
            <span class="cart-item-price">${Utils.formatCurrency(line.lineTotal)}</span>
          </div>
        </div>
      </div>`
      )
      .join("");

    renderSummary();
    wireItemControls();
    renderFrequentlyBoughtTogether(items);
    recsSection.hidden = false;
  }

  function renderSummary() {
    const totals = Store.cartTotal();
    const applied = Store.getAppliedCode();
    Utils.qs("#order-summary-rows").innerHTML = `
      <div class="summary-row"><span>Subtotal</span><span>${Utils.formatCurrency(totals.subtotal)}</span></div>
      ${applied ? `<div class="summary-row"><span>Discount (${Utils.escapeHtml(applied.code)})</span><span>−${Utils.formatCurrency(totals.discount)}</span></div>` : ""}
      <div class="summary-row total"><span>Total</span><span>${Utils.formatCurrency(totals.total)}</span></div>`;
    const status = Utils.qs("#discount-status");
    status.hidden = !applied;
    if (applied) status.textContent = `Code ${applied.code} applied.`;
  }

  function afterCartChange() {
    window.dispatchEvent(new Event("cart:updated"));
    renderCart();
  }

  function wireItemControls() {
    Utils.qsa("[data-qty-minus]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const input = Utils.qs(`[data-qty-input="${btn.dataset.qtyMinus}"]`);
        Store.updateCartQty(btn.dataset.qtyMinus, Math.max(1, Number(input.value) - 1));
        afterCartChange();
      })
    );
    Utils.qsa("[data-qty-plus]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const input = Utils.qs(`[data-qty-input="${btn.dataset.qtyPlus}"]`);
        Store.updateCartQty(btn.dataset.qtyPlus, Number(input.value) + 1);
        afterCartChange();
      })
    );
    Utils.qsa("[data-qty-input]").forEach((input) =>
      input.addEventListener("change", () => {
        Store.updateCartQty(input.dataset.qtyInput, Math.max(1, Number(input.value) || 1));
        afterCartChange();
      })
    );
    Utils.qsa("[data-remove]").forEach((btn) =>
      btn.addEventListener("click", () => {
        Store.removeFromCart(btn.dataset.remove);
        afterCartChange();
      })
    );
  }

  function renderFrequentlyBoughtTogether(items) {
    const rail = Utils.qs("#cart-recs");
    const cartIds = items.map((l) => l.product.id);
    const category = items[0].product.category;
    const recs = Store.getRecommendations(category, null, 8)
      .filter((p) => !cartIds.includes(p.id))
      .slice(0, 4);
    rail.innerHTML = recs.map(Nav.productCardHtml).join("");
    Nav.initAddToCartButtons(rail);
  }

  function wireDiscountForm() {
    const form = Utils.qs("#discount-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = Utils.qs("input", form);
      const wrapper = input.closest(".field");
      const match = Store.applyDiscountCode(input.value);
      if (!match) {
        wrapper.classList.add("has-error");
        return;
      }
      wrapper.classList.remove("has-error");
      input.value = "";
      renderSummary();
      Utils.toast("Discount applied.");
    });
  }

  function wireExitIntent() {
    const modal = Utils.qs("#exit-intent-modal");
    Utils.onExitIntent(() => {
      const popup = Store.getPopupConfig();
      if (!popup.active || Store.cartCount() === 0 || Store.hasSeenPopup("exit-intent-cart")) return;
      Utils.qs("#exit-intent-title").textContent = popup.title;
      Utils.qs("#exit-intent-body").textContent = popup.body;
      Utils.qs("#exit-intent-code").textContent = popup.code;
      Store.markPopupSeen("exit-intent-cart");
      Utils.openModal(modal);
    });
    Utils.qsa("[data-modal-close]", modal).forEach((btn) => btn.addEventListener("click", () => Utils.closeModal(modal)));
    Utils.qs("#exit-intent-apply").addEventListener("click", () => {
      const popup = Store.getPopupConfig();
      Store.applyDiscountCode(popup.code);
      renderSummary();
      Utils.closeModal(modal);
      Utils.toast(`Code ${popup.code} applied.`);
    });
  }

  function init() {
    renderCart();
    wireDiscountForm();
    wireExitIntent();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
