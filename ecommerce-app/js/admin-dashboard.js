(function () {
  if (!Nav.guardSession("admin")) return;

  function computeStats() {
    const orders = Store.getOrders();
    const revenue = orders.reduce((sum, o) => sum + o.totals.total, 0);
    const qtyByProduct = {};
    orders.forEach((o) => o.items.forEach((i) => { qtyByProduct[i.name] = (qtyByProduct[i.name] || 0) + i.qty; }));
    const topProduct = Object.entries(qtyByProduct).sort((a, b) => b[1] - a[1])[0];
    return { totalOrders: orders.length, revenue, topProduct };
  }

  function render() {
    const stats = computeStats();
    Utils.qs("#stat-orders").textContent = stats.totalOrders;
    Utils.qs("#stat-revenue").textContent = Utils.formatCurrency(stats.revenue);
    Utils.qs("#stat-products").textContent = Store.getProducts().length;
    Utils.qs("#stat-top-product").textContent = stats.topProduct ? `${stats.topProduct[0]} (${stats.topProduct[1]})` : "—";

    const orders = Store.getOrders().slice(0, 5);
    Utils.qs("#recent-orders").innerHTML = orders.length
      ? orders.map((o) => `<div class="summary-row"><span>${o.id} — ${Utils.escapeHtml(o.shipping.name)}</span><span>${Utils.formatCurrency(o.totals.total)}</span></div>`).join("")
      : `<p style="color:var(--ink-soft);font-size:0.9rem;">No orders placed yet — place a test order from the shop to see it here.</p>`;
  }

  document.addEventListener("DOMContentLoaded", render);
})();
