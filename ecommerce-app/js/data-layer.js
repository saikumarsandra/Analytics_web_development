const DataLayer = (() => {
  function pushEvent(eventName, data) {
    window.adobeDataLayer.push({ event: eventName, ...(data || {}) });
  }

  function pageInfo() {
    return {
      page: {
        name: document.title,
        category: document.body.dataset.page || "unknown",
        url: window.location.href,
        path: window.location.pathname,
        referrer: document.referrer,
        language: document.documentElement.lang || "en"
      }
    };
  }

  function init() {
    pushEvent("page-view", pageInfo());
  }

  document.addEventListener("DOMContentLoaded", init);

  return { pushEvent, pageInfo };
})();
