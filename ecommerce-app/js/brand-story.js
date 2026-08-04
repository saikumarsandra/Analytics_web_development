(function () {
  const WORDS = ["Considered", "Deliberate", "Honest", "Durable"];
  let rotatorTimer = null;

  function stopRotator() {
    if (rotatorTimer) {
      clearInterval(rotatorTimer);
      rotatorTimer = null;
    }
  }

  function startRotator(section) {
    stopRotator();
    const el = Utils.qs(".brand-story-rotator", section);
    if (!el) return;
    let i = 0;
    el.textContent = WORDS[i];
    rotatorTimer = setInterval(() => {
      el.style.opacity = "0";
      setTimeout(() => {
        i = (i + 1) % WORDS.length;
        el.textContent = WORDS[i];
        el.style.opacity = "1";
      }, 350);
    }, 2200);
  }

  function replayReveal(section) {
    section.classList.remove("in-view");
    void section.offsetWidth; // force reflow so the CSS transition restarts
    requestAnimationFrame(() => section.classList.add("in-view"));
  }

  function initReveal(section) {
    if (!("IntersectionObserver" in window)) {
      section.classList.add("in-view");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section.classList.add("in-view");
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(section);
  }

  function applyMotionState(section) {
    if (Utils.motionEnabled()) startRotator(section);
    else stopRotator();
  }

  function init() {
    const section = Utils.qs("#brand-story");
    if (!section) return;
    applyMotionState(section);
    initReveal(section);
    window.addEventListener("motion:changed", () => {
      applyMotionState(section);
      if (Utils.motionEnabled()) replayReveal(section);
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
