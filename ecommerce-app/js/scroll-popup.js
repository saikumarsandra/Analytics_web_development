(function () {
  function init() {
    const modal = Utils.qs("#scroll-popup-modal");
    if (!modal) return;
    const popup = Store.getPopupConfig();
    if (!popup.active || Store.hasSeenPopup("scroll-promo")) return;

    Utils.onScrollPastThreshold(0.5, () => {
      Utils.qs("#scroll-popup-title", modal).textContent = popup.title;
      Utils.qs("#scroll-popup-body", modal).textContent = popup.body;
      Utils.qs("#scroll-popup-code", modal).textContent = popup.code;
      Store.markPopupSeen("scroll-promo");
      Utils.openModal(modal);
    });

    Utils.qsa("[data-modal-close]", modal).forEach((btn) => btn.addEventListener("click", () => Utils.closeModal(modal)));
    Utils.qs("#scroll-popup-apply", modal).addEventListener("click", () => {
      Store.applyDiscountCode(popup.code);
      Utils.closeModal(modal);
      Utils.toast(`Code ${popup.code} applied to your cart.`);
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
