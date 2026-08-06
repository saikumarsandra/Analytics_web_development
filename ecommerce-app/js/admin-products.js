(function () {
  if (!Nav.guardSession("admin")) return;

  const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23e4dfd4'/%3E%3C/svg%3E";
  let editingId = null;

  function renderTable() {
    const products = Store.getProducts();
    Utils.qs("#products-table-body").innerHTML = products
      .map(
        (p) => `
      <tr>
        <td><img class="admin-table-thumb" src="${p.image}" alt="" /></td>
        <td>${Utils.escapeHtml(p.name)}</td>
        <td>${Utils.escapeHtml(p.category)}</td>
        <td>${Utils.formatCurrency(p.price)}</td>
        <td>${p.stock}</td>
        <td class="admin-table-actions">
          <button type="button" data-edit="${p.id}">Edit</button>
          <button type="button" class="danger" data-delete="${p.id}">Delete</button>
        </td>
      </tr>`
      )
      .join("");

    Utils.qsa("[data-edit]").forEach((btn) => btn.addEventListener("click", () => startEdit(btn.dataset.edit)));
    Utils.qsa("[data-delete]").forEach((btn) =>
      btn.addEventListener("click", () => {
        if (!window.confirm("Delete this product? This can't be undone.")) return;
        Store.deleteProduct(btn.dataset.delete);
        renderTable();
        Utils.toast("Product deleted.");
      })
    );
  }

  function startEdit(id) {
    const product = Store.getProductById(id);
    if (!product) return;
    editingId = id;
    const form = Utils.qs("#product-form");
    form.name.value = product.name;
    form.category.value = product.category;
    form.price.value = product.price;
    form.discount.value = Math.round((product.discount || 0) * 100);
    form.stock.value = product.stock;
    form.image.value = product.image || "";
    form.description.value = product.description || "";
    Utils.qs("#form-title").textContent = "Edit product";
    Utils.qs("#form-cancel").hidden = false;
    form.scrollIntoView({ behavior: Utils.prefersReducedMotion() ? "auto" : "smooth" });
  }

  function resetForm() {
    editingId = null;
    Utils.qs("#product-form").reset();
    Utils.qs("#form-title").textContent = "Add product";
    Utils.qs("#form-cancel").hidden = true;
  }

  function wireForm() {
    const form = Utils.qs("#product-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const category = form.category.value.trim();
      const price = Number(form.price.value);
      let valid = true;
      [
        [form.name, name.length > 0],
        [form.category, category.length > 0],
        [form.price, price > 0]
      ].forEach(([field, ok]) => {
        field.closest(".field").classList.toggle("has-error", !ok);
        if (!ok) valid = false;
      });
      if (!valid) return;

      Store.upsertProduct({
        id: editingId || Store.nextProductId(),
        name,
        category,
        price,
        discount: Math.max(0, Number(form.discount.value) || 0) / 100,
        stock: Math.max(0, Number(form.stock.value) || 0),
        color: "#a9822c",
        image: form.image.value.trim() || PLACEHOLDER_IMAGE,
        description: form.description.value.trim(),
        rating: editingId ? Store.getProductById(editingId).rating : 4.5,
        reviews: editingId ? Store.getProductById(editingId).reviews : 0
      });
      const wasEditing = !!editingId;
      resetForm();
      renderTable();
      Utils.toast(wasEditing ? "Product updated." : "Product added.");
    });

    Utils.qs("#form-cancel").addEventListener("click", resetForm);
  }

  function init() {
    renderTable();
    wireForm();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
