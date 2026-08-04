const Utils = (() => {
  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

  function formatCurrency(amount) {
    return "£" + Number(amount).toFixed(2);
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = String(str == null ? "" : str);
    return div.innerHTML;
  }

  function debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  const FOCUSABLE = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

  function trapFocus(container, onEscape) {
    function handleKeydown(e) {
      if (e.key === "Escape") {
        onEscape && onEscape();
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = qsa(FOCUSABLE, container).filter(el => el.offsetParent !== null);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    container.addEventListener("keydown", handleKeydown);
    return () => container.removeEventListener("keydown", handleKeydown);
  }

  function openModal(modalEl) {
    const trigger = document.activeElement;
    modalEl.hidden = false;
    modalEl.setAttribute("aria-hidden", "false");
    const firstFocusable = qs(FOCUSABLE, modalEl);
    (firstFocusable || modalEl).focus();
    const untrap = trapFocus(modalEl, () => closeModal(modalEl));
    modalEl._untrap = untrap;
    modalEl._trigger = trigger;
    document.body.classList.add("modal-open");
  }

  function closeModal(modalEl) {
    modalEl.hidden = true;
    modalEl.setAttribute("aria-hidden", "true");
    if (modalEl._untrap) modalEl._untrap();
    if (modalEl._trigger && typeof modalEl._trigger.focus === "function") modalEl._trigger.focus();
    document.body.classList.remove("modal-open");
  }

  function onExitIntent(callback) {
    let fired = false;
    document.addEventListener("mouseout", (e) => {
      if (fired) return;
      if (!e.relatedTarget && e.clientY <= 0) {
        fired = true;
        callback();
      }
    });
  }

  function startCountdown(el, deadline, onDone) {
    function tick() {
      const remaining = deadline - Date.now();
      if (remaining <= 0) {
        el.textContent = "00:00:00";
        onDone && onDone();
        return;
      }
      const h = Math.floor(remaining / 3600000);
      const m = Math.floor((remaining % 3600000) / 60000);
      const s = Math.floor((remaining % 60000) / 1000);
      el.textContent = [h, m, s].map(n => String(n).padStart(2, "0")).join(":");
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }

  function toast(message) {
    let region = qs("#toast-region");
    if (!region) {
      region = document.createElement("div");
      region.id = "toast-region";
      region.setAttribute("aria-live", "polite");
      region.className = "toast-region";
      document.body.appendChild(region);
    }
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = message;
    region.appendChild(el);
    setTimeout(() => el.classList.add("toast-visible"), 10);
    setTimeout(() => {
      el.classList.remove("toast-visible");
      setTimeout(() => el.remove(), 300);
    }, 3200);
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function motionEnabled() {
    return !prefersReducedMotion() || document.documentElement.classList.contains("motion-force");
  }

  return { qs, qsa, formatCurrency, escapeHtml, debounce, trapFocus, openModal, closeModal, onExitIntent, startCountdown, toast, prefersReducedMotion, motionEnabled };
})();
