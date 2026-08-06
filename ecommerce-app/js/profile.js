(function () {
  if (!Nav.guardSession()) return;

  function renderProfile() {
    const session = Store.getSession();
    Utils.qs("#profile-name").textContent = session.name;
    Utils.qs("#profile-email").textContent = session.email;
    Utils.qs("#profile-role").textContent = session.role === "admin" ? "Administrator" : "Shopper";
    Utils.qs("#display-name-input").value = session.name;
  }

  function wireProfileForm() {
    const form = Utils.qs("#profile-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = Utils.qs("#display-name-input", form).value.trim();
      if (!name) return;
      Store.updateSession({ name });
      renderProfile();
      Utils.toast("Profile updated.");
    });
  }

  function renderOrders() {
    const orders = Store.getOrders();
    const list = Utils.qs("#order-history");
    if (!orders.length) {
      list.innerHTML = `<div class="empty-state"><h3>No orders yet</h3><p>Your placed orders will show up here.</p></div>`;
      return;
    }
    list.innerHTML = orders
      .map(
        (order) => `
      <div class="cart-item">
        <div class="cart-item-body">
          <div class="cart-item-top">
            <span class="cart-item-name">Order ${order.id}</span>
            <span>${new Date(order.placedAt).toLocaleDateString()}</span>
          </div>
          <div class="cart-item-bottom">
            <span>${order.items.reduce((n, i) => n + i.qty, 0)} item(s)</span>
            <span class="cart-item-price">${Utils.formatCurrency(order.totals.total)}</span>
          </div>
        </div>
      </div>`
      )
      .join("");
  }

  function init() {
    renderProfile();
    wireProfileForm();
    renderOrders();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
