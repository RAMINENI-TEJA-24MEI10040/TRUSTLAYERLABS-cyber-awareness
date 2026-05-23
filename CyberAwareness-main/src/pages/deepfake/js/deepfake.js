(function () {
  const xpKey = "deepfakeLabXp";
  const achievementKey = "deepfakeLabAchievements";

  const state = {
    xp: Number(localStorage.getItem(xpKey) || 0),
    achievements: JSON.parse(localStorage.getItem(achievementKey) || "[]")
  };

  function saveState() {
    localStorage.setItem(xpKey, String(state.xp));
    localStorage.setItem(achievementKey, JSON.stringify(state.achievements));
    updateXpDock();
  }

  function updateXpDock() {
    const dock = document.querySelector("[data-xp-dock]");
    if (dock) dock.textContent = `ANALYST XP ${state.xp}`;
  }

  function awardXp(points, badge) {
    state.xp += points;
    if (badge && !state.achievements.includes(badge)) {
      state.achievements.push(badge);
      showModal("Achievement unlocked", `${badge} secured. +${points} XP added to your analyst profile.`);
    }
    saveState();
  }

  function showModal(title, body) {
    const modal = document.querySelector("[data-modal]");
    if (!modal) return;
    modal.querySelector("[data-modal-title]").textContent = title;
    modal.querySelector("[data-modal-body]").textContent = body;
    modal.classList.add("show");
  }

  function closeModal() {
    document.querySelectorAll("[data-modal]").forEach((modal) => modal.classList.remove("show"));
  }

  function setActiveNav() {
    const current = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".df-nav-links a").forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === current);
    });
  }

  function animateCounters() {
    document.querySelectorAll("[data-count]").forEach((node) => {
      const target = Number(node.dataset.count || 0);
      const suffix = node.dataset.suffix || "";
      const duration = 1100;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        node.textContent = `${Math.round(target * eased)}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    });
  }

  function typeText() {
    document.querySelectorAll("[data-type]").forEach((node) => {
      const text = node.dataset.type;
      let index = 0;
      node.textContent = "";
      const timer = setInterval(() => {
        node.textContent += text.charAt(index);
        index += 1;
        if (index >= text.length) clearInterval(timer);
      }, 22);
    });
  }

  function wireScanButtons() {
    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-scan-target]");
      if (!button) return;
      const target = document.querySelector(button.dataset.scanTarget);
      if (!target) return;
      target.classList.remove("scanning");
      void target.offsetWidth;
      target.classList.add("scanning");
      awardXp(15, button.dataset.badge || "");
    });
  }

  function setupModal() {
    document.querySelectorAll("[data-modal-close]").forEach((button) => button.addEventListener("click", closeModal));
    document.querySelectorAll("[data-modal]").forEach((modal) => {
      modal.addEventListener("click", (event) => {
        if (event.target === modal) closeModal();
      });
    });
  }

  function init() {
    setActiveNav();
    updateXpDock();
    animateCounters();
    typeText();
    wireScanButtons();
    setupModal();
    window.DeepfakeLab = { awardXp, showModal };
  }

  document.addEventListener("DOMContentLoaded", init);
})();
