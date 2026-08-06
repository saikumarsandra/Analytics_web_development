const Store = (() => {
  const KEYS = {
    cart: "ecom_cart",
    orders: "ecom_orders",
    overrides: "ecom_product_overrides",
    session: "ecom_session",
    banner: "ecom_banner_config",
    popup: "ecom_popup_config",
    cookieConsent: "ecom_cookie_consent",
    seenPrefix: "ecom_seen_",
    lastCategory: "ecom_last_category",
    appliedCode: "ecom_applied_code",
    reviews: "ecom_reviews",
    restockSubs: "ecom_restock_subs"
  };

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getOverrides() {
    return read(KEYS.overrides, { edits: {}, added: [], deletedIds: [] });
  }
  function saveOverrides(overrides) {
    write(KEYS.overrides, overrides);
  }

  function getProducts() {
    const overrides = getOverrides();
    const base = PRODUCTS
      .filter(p => !overrides.deletedIds.includes(p.id))
      .map(p => (overrides.edits[p.id] ? { ...p, ...overrides.edits[p.id] } : p));
    const added = overrides.added.filter(p => !overrides.deletedIds.includes(p.id));
    return [...base, ...added];
  }

  function getProductById(id) {
    return getProducts().find(p => p.id === id) || null;
  }

  function upsertProduct(product) {
    const overrides = getOverrides();
    const isBase = PRODUCTS.some(p => p.id === product.id);
    if (isBase) {
      overrides.edits[product.id] = product;
    } else {
      const idx = overrides.added.findIndex(p => p.id === product.id);
      if (idx >= 0) overrides.added[idx] = product;
      else overrides.added.push(product);
    }
    saveOverrides(overrides);
  }

  function deleteProduct(id) {
    const overrides = getOverrides();
    if (!overrides.deletedIds.includes(id)) overrides.deletedIds.push(id);
    saveOverrides(overrides);
  }

  function nextProductId() {
    const ids = getProducts().map(p => Number(p.id.replace(/\D/g, "")) || 0);
    const max = Math.max(0, ...ids);
    return "p" + String(max + 1).padStart(2, "0");
  }

  function getRecommendations(category, excludeId, limit) {
    limit = limit || 4;
    const products = getProducts();
    let pool = products.filter(p => p.category === category && p.id !== excludeId);
    if (pool.length < limit) {
      const extra = products.filter(p => p.category !== category && p.id !== excludeId);
      pool = pool.concat(extra);
    }
    return pool.slice(0, limit);
  }

  function reviewsFor(productId) {
    const seed = productId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const count = 2 + (seed % 2);
    const out = [];
    for (let i = 0; i < count; i++) {
      out.push(REVIEW_SNIPPETS[(seed + i) % REVIEW_SNIPPETS.length]);
    }
    const submitted = read(KEYS.reviews, {})[productId] || [];
    return submitted.concat(out);
  }

  function addReview(productId, review) {
    const all = read(KEYS.reviews, {});
    const list = all[productId] || [];
    list.unshift({ ...review, createdAt: new Date().toISOString() });
    all[productId] = list;
    write(KEYS.reviews, all);
  }

  function subscribeRestock(productId, email) {
    const all = read(KEYS.restockSubs, {});
    const list = all[productId] || [];
    if (!list.includes(email)) list.push(email);
    all[productId] = list;
    write(KEYS.restockSubs, all);
  }

  function getCart() {
    return read(KEYS.cart, []);
  }
  function saveCart(cart) {
    write(KEYS.cart, cart);
  }
  function addToCart(id, qty) {
    qty = qty || 1;
    const cart = getCart();
    const line = cart.find(l => l.id === id);
    if (line) line.qty += qty;
    else cart.push({ id, qty });
    saveCart(cart);
  }
  function updateCartQty(id, qty) {
    let cart = getCart();
    if (qty <= 0) {
      cart = cart.filter(l => l.id !== id);
    } else {
      const line = cart.find(l => l.id === id);
      if (line) line.qty = qty;
    }
    saveCart(cart);
  }
  function removeFromCart(id) {
    saveCart(getCart().filter(l => l.id !== id));
  }
  function clearCart() {
    saveCart([]);
    localStorage.removeItem(KEYS.appliedCode);
  }
  function cartDetailed() {
    return getCart()
      .map(line => {
        const product = getProductById(line.id);
        if (!product) return null;
        const unitPrice = product.price * (1 - (product.discount || 0));
        return { product, qty: line.qty, unitPrice, lineTotal: unitPrice * line.qty };
      })
      .filter(Boolean);
  }
  function cartCount() {
    return getCart().reduce((sum, l) => sum + l.qty, 0);
  }
  function cartSubtotal() {
    return cartDetailed().reduce((sum, l) => sum + l.lineTotal, 0);
  }
  function getAppliedCode() {
    return read(KEYS.appliedCode, null);
  }
  function applyDiscountCode(code) {
    const banner = getBannerConfig();
    const popup = getPopupConfig();
    const match = [banner, popup].find(c => c.code && c.code.toLowerCase() === String(code).trim().toLowerCase());
    if (match) {
      write(KEYS.appliedCode, { code: match.code, discount: match.discount });
      return match;
    }
    return null;
  }
  function cartTotal() {
    const subtotal = cartSubtotal();
    const applied = getAppliedCode();
    const discount = applied ? subtotal * applied.discount : 0;
    return { subtotal, discount, total: subtotal - discount };
  }

  function getOrders() {
    return read(KEYS.orders, []);
  }
  function addOrder(order) {
    const orders = getOrders();
    const withId = { ...order, id: "ORD" + Date.now().toString().slice(-8), placedAt: new Date().toISOString() };
    orders.unshift(withId);
    write(KEYS.orders, orders);
    return withId;
  }

  function getSession() {
    return read(KEYS.session, null);
  }
  function login(email, password) {
    const account = DEMO_ACCOUNTS.find(a => a.email.toLowerCase() === String(email).trim().toLowerCase());
    if (!account || !password) return null;
    const session = { email: account.email, name: account.name, role: account.role };
    write(KEYS.session, session);
    return session;
  }
  function updateSession(partial) {
    const session = getSession();
    if (!session) return null;
    const updated = { ...session, ...partial };
    write(KEYS.session, updated);
    return updated;
  }
  function logout() {
    localStorage.removeItem(KEYS.session);
  }

  function getBannerConfig() {
    return { ...DEFAULT_BANNER, ...read(KEYS.banner, {}) };
  }
  function saveBannerConfig(partial) {
    write(KEYS.banner, { ...getBannerConfig(), ...partial });
  }

  function getPopupConfig() {
    return { ...DEFAULT_POPUP, ...read(KEYS.popup, {}) };
  }
  function savePopupConfig(partial) {
    write(KEYS.popup, { ...getPopupConfig(), ...partial });
  }

  function getCookieConsent() {
    return read(KEYS.cookieConsent, null);
  }
  function setCookieConsent(value) {
    write(KEYS.cookieConsent, value);
  }

  function hasSeenPopup(key, ttlMs) {
    const seenAt = localStorage.getItem(KEYS.seenPrefix + key);
    if (!seenAt) return false;
    if (!ttlMs) return true;
    return Date.now() - Number(seenAt) < ttlMs;
  }
  function markPopupSeen(key) {
    localStorage.setItem(KEYS.seenPrefix + key, String(Date.now()));
  }

  function getLastCategory() {
    return localStorage.getItem(KEYS.lastCategory);
  }
  function setLastCategory(category) {
    localStorage.setItem(KEYS.lastCategory, category);
  }

  return {
    getProducts, getProductById, upsertProduct, deleteProduct, nextProductId, getRecommendations, reviewsFor, addReview, subscribeRestock,
    getCart, addToCart, updateCartQty, removeFromCart, clearCart, cartDetailed, cartCount, cartSubtotal, cartTotal,
    getAppliedCode, applyDiscountCode,
    getOrders, addOrder,
    getSession, login, logout, updateSession,
    getBannerConfig, saveBannerConfig, getPopupConfig, savePopupConfig,
    getCookieConsent, setCookieConsent,
    hasSeenPopup, markPopupSeen,
    getLastCategory, setLastCategory
  };
})();
