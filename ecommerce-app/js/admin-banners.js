(function () {
  if (!Nav.guardSession("admin")) return;

  function loadBanner() {
    const config = Store.getBannerConfig();
    const form = Utils.qs("#banner-form");
    form.active.checked = config.active;
    form.text.value = config.text;
    form.code.value = config.code;
    form.discount.value = Math.round(config.discount * 100);
  }

  function loadPopup() {
    const config = Store.getPopupConfig();
    const form = Utils.qs("#popup-form");
    form.active.checked = config.active;
    form.title.value = config.title;
    form.body.value = config.body;
    form.code.value = config.code;
    form.discount.value = Math.round(config.discount * 100);
  }

  function wireBannerForm() {
    const form = Utils.qs("#banner-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      Store.saveBannerConfig({
        active: form.active.checked,
        text: form.text.value.trim(),
        code: form.code.value.trim().toUpperCase(),
        discount: Math.max(0, Number(form.discount.value) || 0) / 100
      });
      Utils.toast("Banner settings saved.");
    });
    Utils.qs("#banner-reset").addEventListener("click", () => {
      Store.saveBannerConfig(DEFAULT_BANNER);
      loadBanner();
      Utils.toast("Banner reset to default.");
    });
  }

  function wirePopupForm() {
    const form = Utils.qs("#popup-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      Store.savePopupConfig({
        active: form.active.checked,
        title: form.title.value.trim(),
        body: form.body.value.trim(),
        code: form.code.value.trim().toUpperCase(),
        discount: Math.max(0, Number(form.discount.value) || 0) / 100
      });
      Utils.toast("Popup settings saved.");
    });
    Utils.qs("#popup-reset").addEventListener("click", () => {
      Store.savePopupConfig(DEFAULT_POPUP);
      loadPopup();
      Utils.toast("Popup reset to default.");
    });
  }

  function init() {
    loadBanner();
    loadPopup();
    wireBannerForm();
    wirePopupForm();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
