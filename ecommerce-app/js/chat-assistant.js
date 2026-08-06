(function () {
  const KB = [
    { keywords: ["hi", "hello", "hey"], reply: "Hi! I'm the Considered Market assistant. Ask me about shipping, returns, sizing, discounts or your order." },
    { keywords: ["ship", "deliver"], reply: "Free shipping on every order, no minimum — delivery usually takes 3–5 business days." },
    { keywords: ["return", "refund", "exchange"], reply: "We offer simple 30-day returns, no questions asked. Just get in touch with your order number." },
    { keywords: ["size", "sizing", "fit"], reply: "Check the product description for sizing notes — most items run true to size." },
    { keywords: ["order", "track", "status"], reply: "You can see all your past orders under My Account.", linkText: "Go to order history", linkHref: "account/profile.html" },
    { keywords: ["discount", "code", "promo", "coupon", "sale"], reply: "Keep an eye on the banner at the top of the site and the occasional popup — that's where we share active discount codes." },
    { keywords: ["pay", "payment", "card"], reply: "We accept all major cards at checkout. This is a demo store, so no real payment is ever processed." },
    { keywords: ["human", "agent", "contact"], reply: "I'm just a simple scripted demo assistant — for anything real, reach Sai directly at saikumarsandra@gmail.com." },
    { keywords: ["recommend", "suggest", "gift", "best"], reply: "Take a look at the shop — you can filter by category, price and rating to find something good.", linkText: "Browse the shop", linkHref: "shop.html" }
  ];
  const FALLBACK = "I'm not sure about that one — try asking about shipping, returns, sizing, discounts, or your order. Or browse the shop!";
  const QUICK_REPLIES = ["Shipping & returns", "Track my order", "Discount codes", "Sizing help"];

  function basePath() {
    return /\/(account|admin)\//.test(window.location.pathname) ? "../" : "";
  }

  function findReply(text) {
    const lower = text.toLowerCase();
    return KB.find((entry) => entry.keywords.some((k) => lower.includes(k))) || { reply: FALLBACK };
  }

  function buildWidget() {
    const bubble = document.createElement("button");
    bubble.type = "button";
    bubble.className = "chat-bubble";
    bubble.setAttribute("aria-label", "Open shopping assistant");
    bubble.setAttribute("aria-expanded", "false");
    bubble.textContent = "💬";

    const panel = document.createElement("div");
    panel.className = "chat-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Shopping assistant");
    panel.hidden = true;
    panel.innerHTML = `
      <div class="chat-header">
        <span class="chat-avatar">🛍</span>
        <div>
          <div class="chat-header-name">Shopping Assistant</div>
          <div class="chat-header-status">Usually replies instantly</div>
        </div>
        <button type="button" class="chat-close" aria-label="Close chat">✕</button>
      </div>
      <div class="chat-messages" id="chat-messages" aria-live="polite"></div>
      <div class="chat-quick-replies" id="chat-quick-replies"></div>
      <form class="chat-input-row" id="chat-form">
        <label for="chat-input" style="position:absolute;left:-9999px;">Ask a question</label>
        <input type="text" id="chat-input" placeholder="Ask a question…" autocomplete="off" />
        <button type="submit">Send</button>
      </form>`;

    document.body.appendChild(bubble);
    document.body.appendChild(panel);
    return { bubble, panel };
  }

  function addMessage(container, text, from, link) {
    const el = document.createElement("div");
    el.className = `chat-message from-${from}`;
    el.textContent = text;
    if (link) {
      el.append(" ");
      const a = document.createElement("a");
      a.href = basePath() + link.href;
      a.textContent = link.text;
      el.appendChild(a);
    }
    container.appendChild(el);
    container.scrollTop = container.scrollHeight;
  }

  function respondTo(container, text) {
    const match = findReply(text);
    addMessage(container, text, "user");
    window.setTimeout(() => {
      addMessage(container, match.reply, "bot", match.linkHref ? { text: match.linkText, href: match.linkHref } : null);
    }, 350);
  }

  function init() {
    const { bubble, panel } = buildWidget();
    const messages = Utils.qs("#chat-messages", panel);
    const quickReplies = Utils.qs("#chat-quick-replies", panel);
    let started = false;

    quickReplies.innerHTML = QUICK_REPLIES.map((label) => `<button type="button">${Utils.escapeHtml(label)}</button>`).join("");
    Utils.qsa("button", quickReplies).forEach((btn) => btn.addEventListener("click", () => respondTo(messages, btn.textContent)));

    function open() {
      panel.hidden = false;
      bubble.setAttribute("aria-expanded", "true");
      if (!started) {
        started = true;
        addMessage(messages, "Hi! I'm here to help with shipping, returns, sizing or order questions. What can I help with?", "bot");
      }
      Utils.qs("#chat-input", panel).focus();
    }
    function close() {
      panel.hidden = true;
      bubble.setAttribute("aria-expanded", "false");
      bubble.focus();
    }

    bubble.addEventListener("click", () => (panel.hidden ? open() : close()));
    Utils.qs(".chat-close", panel).addEventListener("click", close);
    panel.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });

    Utils.qs("#chat-form", panel).addEventListener("submit", (e) => {
      e.preventDefault();
      const input = Utils.qs("#chat-input", panel);
      const text = input.value.trim();
      if (!text) return;
      respondTo(messages, text);
      input.value = "";
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
