(function () {
  function renderItemsMini() {
    Utils.qs("#checkout-items").innerHTML = Store.cartDetailed()
      .map((line) => `<div class="summary-row"><span>${line.qty} × ${Utils.escapeHtml(line.product.name)}</span><span>${Utils.formatCurrency(line.lineTotal)}</span></div>`)
      .join("");
  }

  function renderSummary() {
    const totals = Store.cartTotal();
    const applied = Store.getAppliedCode();
    Utils.qs("#checkout-summary-rows").innerHTML = `
      <div class="summary-row"><span>Subtotal</span><span>${Utils.formatCurrency(totals.subtotal)}</span></div>
      ${applied ? `<div class="summary-row"><span>Discount (${Utils.escapeHtml(applied.code)})</span><span>−${Utils.formatCurrency(totals.discount)}</span></div>` : ""}
      <div class="summary-row total"><span>Total</span><span>${Utils.formatCurrency(totals.total)}</span></div>`;
  }

  const VALIDATORS = {
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    "card-number": (v) => /^\d{13,19}$/.test(v.replace(/\s+/g, "")),
    "card-expiry": (v) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(v),
    "card-cvc": (v) => /^\d{3,4}$/.test(v)
  };
  const REQUIRED_FIELDS = ["full-name", "email", "address", "city", "postcode", "country", "card-name", "card-number", "card-expiry", "card-cvc"];

  function wireForm() {
    const form = Utils.qs("#checkout-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      REQUIRED_FIELDS.forEach((name) => {
        const field = Utils.qs(`[name="${name}"]`, form);
        const wrapper = field.closest(".field");
        const test = VALIDATORS[name] || ((v) => v.length > 0);
        const ok = test(field.value.trim());
        wrapper.classList.toggle("has-error", !ok);
        if (!ok) valid = false;
      });
      if (!valid) return;

      const order = Store.addOrder({
        items: Store.cartDetailed().map((l) => ({ id: l.product.id, name: l.product.name, qty: l.qty, unitPrice: l.unitPrice })),
        totals: Store.cartTotal(),
        shipping: {
          name: Utils.qs("[name='full-name']", form).value.trim(),
          email: Utils.qs("[name='email']", form).value.trim(),
          address: Utils.qs("[name='address']", form).value.trim(),
          city: Utils.qs("[name='city']", form).value.trim(),
          postcode: Utils.qs("[name='postcode']", form).value.trim(),
          country: Utils.qs("[name='country']", form).value
        }
      });
      Store.clearCart();
      window.dispatchEvent(new Event("cart:updated"));
      showConfirmation(order);
    });
  }

  function showConfirmation(order) {
    Utils.qs("#confirm-order-id").textContent = order.id;
    Utils.qs("#confirm-total").textContent = Utils.formatCurrency(order.totals.total);
    Utils.openModal(Utils.qs("#confirmation-modal"));
  }

  function init() {
    if (!Store.cartDetailed().length) {
      Utils.qs("main .container").innerHTML = `
        <div class="empty-state">
          <h3>Your cart is empty</h3>
          <p>Add something to your cart before checking out.</p>
          <a href="shop.html" class="btn btn-primary" style="margin-top:var(--space-4);display:inline-flex;">Continue shopping</a>
        </div>`;
      return;
    }
    renderItemsMini();
    renderSummary();
    wireForm();
    Utils.qs("#confirmation-continue").addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
