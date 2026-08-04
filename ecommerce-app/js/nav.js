const Nav = (() => {
  function initMobileToggle() {
    const toggle = Utils.qs(".nav-toggle");
    const menu = Utils.qs(".main-nav");
    if (!toggle || !menu) return;
    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
    menu.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  function initActiveLink() {
    const page = document.body.dataset.page;
    if (!page) return;
    Utils.qsa(`.main-nav a[data-page]`).forEach((a) => {
      if (a.dataset.page === page) a.classList.add("active");
    });
  }

  function initCartCount() {
    const badges = Utils.qsa("[data-cart-count]");
    if (badges.length === 0) return;
    const render = () => {
      const count = Store.cartCount();
      badges.forEach((b) => {
        b.textContent = String(count);
        b.hidden = count === 0;
      });
    };
    render();
    window.addEventListener("storage", render);
    window.addEventListener("cart:updated", render);
  }

  function initAuthLinks() {
    const session = Store.getSession();
    const guestEls = Utils.qsa("[data-auth='guest']");
    const userEls = Utils.qsa("[data-auth='user']");
    const adminEls = Utils.qsa("[data-auth='admin']");
    const nameEls = Utils.qsa("[data-user-name]");

    guestEls.forEach((el) => (el.hidden = !!session));
    userEls.forEach((el) => (el.hidden = !session));
    adminEls.forEach((el) => (el.hidden = !session || session.role !== "admin"));
    nameEls.forEach((el) => { if (session) el.textContent = session.name; });

    Utils.qsa("[data-logout]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        Store.logout();
        window.location.href = "index.html";
      });
    });
  }

  function initAnnouncementBanner() {
    const banner = Utils.qs("#announcement-banner");
    if (!banner) return;
    const config = Store.getBannerConfig();
    if (!config.active || Store.hasSeenPopup("banner-dismissed")) {
      banner.hidden = true;
      return;
    }
    const textEl = Utils.qs("[data-banner-text]", banner);
    if (textEl) textEl.innerHTML = `${Utils.escapeHtml(config.text)} &nbsp;—&nbsp; code <strong>${Utils.escapeHtml(config.code)}</strong>`;
    const closeBtn = Utils.qs(".banner-close", banner);
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        banner.hidden = true;
        Store.markPopupSeen("banner-dismissed");
      });
    }
  }

  function initCookieConsent() {
    const consentEl = Utils.qs("#cookie-consent");
    if (!consentEl) return;
    const existing = Store.getCookieConsent();
    if (existing) {
      consentEl.hidden = true;
      return;
    }
    consentEl.hidden = false;
    Utils.qs("[data-cookie-accept]", consentEl).addEventListener("click", () => {
      Store.setCookieConsent("accepted");
      consentEl.hidden = true;
    });
    Utils.qs("[data-cookie-reject]", consentEl).addEventListener("click", () => {
      Store.setCookieConsent("rejected");
      consentEl.hidden = true;
    });
  }

  function initNewsletterForm() {
    const form = Utils.qs("#newsletter-form");
    if (!form) return;
    const emailField = Utils.qs("input[name='email']", form);
    const wrapper = emailField.closest(".field");
    const successEl = Utils.qs(".newsletter-success", form.parentElement) || Utils.qs(".newsletter-success");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const honeypot = Utils.qs("input[name='company']", form);
      if (honeypot && honeypot.value) return; // silently drop bot submissions

      const email = emailField.value.trim();
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!valid) {
        wrapper.classList.add("has-error");
        wrapper.classList.remove("has-success");
        return;
      }
      wrapper.classList.remove("has-error");
      wrapper.classList.add("has-success");
      form.hidden = true;
      if (successEl) successEl.classList.add("visible");
      Utils.toast("You're subscribed — look out for your welcome email.");
    });
  }

  function renderStars(rating) {
    const full = Math.round(rating);
    return "★".repeat(full) + "☆".repeat(5 - full);
  }

  function productCardHtml(product) {
    const hasDiscount = product.discount > 0;
    const finalPrice = product.price * (1 - (product.discount || 0));
    return `
      <article class="product-card">
        <a href="product.html?id=${encodeURIComponent(product.id)}" style="text-decoration:none;color:inherit;">
          <div class="product-tile" style="background:${product.color}">
            ${hasDiscount ? `<span class="product-badge">-${Math.round(product.discount * 100)}%</span>` : ""}
            <img src="${product.image}" alt="${Utils.escapeHtml(product.name)}" loading="lazy" width="400" height="400" />
          </div>
        </a>
        <div class="product-card-body">
          <div class="product-card-cat">${Utils.escapeHtml(product.category)}</div>
          <h3 class="product-card-name"><a href="product.html?id=${encodeURIComponent(product.id)}">${Utils.escapeHtml(product.name)}</a></h3>
          <div class="product-card-rating"><span class="stars">${renderStars(product.rating)}</span> ${product.rating.toFixed(1)} (${product.reviews})</div>
          <div class="product-card-price">
            <span class="price-now">${Utils.formatCurrency(finalPrice)}</span>
            ${hasDiscount ? `<span class="price-was">${Utils.formatCurrency(product.price)}</span>` : ""}
          </div>
          ${
            product.stock > 0
              ? `<button class="btn btn-primary btn-block btn-small" type="button" data-add-to-cart="${product.id}">Add to cart</button>`
              : `<button class="btn btn-outline btn-block btn-small" type="button" disabled>Out of stock</button>`
          }
        </div>
      </article>`;
  }

  function initAddToCartButtons(root) {
    Utils.qsa("[data-add-to-cart]", root || document).forEach((btn) => {
      btn.addEventListener("click", () => {
        Store.addToCart(btn.dataset.addToCart, 1);
        window.dispatchEvent(new Event("cart:updated"));
        Utils.toast("Added to cart.");
      });
    });
  }

  function initMotionToggle() {
    const KEY = "ecom_motion_force";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "motion-toggle";

    function render() {
      const forced = localStorage.getItem(KEY) === "1";
      document.documentElement.classList.toggle("motion-force", forced);
      btn.textContent = forced ? "🎬 Animations: preview (forced on)" : "🎬 Animations: auto (system setting)";
    }

    btn.addEventListener("click", () => {
      const forced = localStorage.getItem(KEY) === "1";
      localStorage.setItem(KEY, forced ? "0" : "1");
      render();
      window.dispatchEvent(new Event("motion:changed"));
    });

    document.body.appendChild(btn);
    render();
  }

  function init() {
    initMobileToggle();
    initActiveLink();
    initCartCount();
    initAuthLinks();
    initAnnouncementBanner();
    initCookieConsent();
    initNewsletterForm();
    initMotionToggle();
  }

  document.addEventListener("DOMContentLoaded", init);

  return { renderStars, productCardHtml, initAddToCartButtons };
})();
