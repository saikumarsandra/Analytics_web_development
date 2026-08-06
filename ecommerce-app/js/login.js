(function () {
  function redirectAfterLogin(session) {
    window.location.href = session.role === "admin" ? "../admin/dashboard.html" : "../account/profile.html";
  }

  function showError(message) {
    const el = Utils.qs("#auth-error");
    el.textContent = message;
    el.classList.add("visible");
  }

  function wireForm() {
    const form = Utils.qs("#login-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = Utils.qs("[name='email']", form).value.trim();
      const password = Utils.qs("[name='password']", form).value;
      const session = Store.login(email, password);
      if (!session) {
        showError("We couldn't find that account. Try one of the demo accounts below.");
        return;
      }
      redirectAfterLogin(session);
    });
  }

  function wireDemoButtons() {
    Utils.qsa("[data-demo-login]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const session = Store.login(btn.dataset.demoLogin, "demo");
        if (session) redirectAfterLogin(session);
      });
    });
  }

  function init() {
    if (Store.getSession()) {
      redirectAfterLogin(Store.getSession());
      return;
    }
    wireForm();
    wireDemoButtons();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
