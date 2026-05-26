const LawsUI = (() => {
  const storeKey = "cyberLawProgress";
  const pageKey = document.body.dataset.page || "laws";

  const getProgress = () => {
    try {
      return JSON.parse(localStorage.getItem(storeKey)) || {};
    } catch {
      return {};
    }
  };

  const saveProgress = (progress) => {
    localStorage.setItem(storeKey, JSON.stringify(progress));
  };

  const showAchievement = (title, message) => {
    let popup = document.querySelector("[data-achievement]");
    if (!popup) {
      popup = document.createElement("div");
      popup.className = "achievement-popup";
      popup.dataset.achievement = "true";
      document.body.appendChild(popup);
    }

    popup.innerHTML = `<strong>${title}</strong><span>${message}</span>`;
    popup.classList.add("show");
    window.clearTimeout(showAchievement.timer);
    showAchievement.timer = window.setTimeout(() => popup.classList.remove("show"), 3400);
  };

  const markVisited = () => {
    const progress = getProgress();
    if (!progress[pageKey]) {
      progress[pageKey] = true;
      saveProgress(progress);
      if (Object.keys(progress).length === 3) {
        showAchievement("Legal Radar Online", "You explored three cyber law stations.");
      }
      if (Object.keys(progress).length >= 6) {
        showAchievement("Cyber Law Cadet", "Six modules reviewed. Your legal response map is growing.");
      }
    }
    updateProgress(progress);
  };

  const updateProgress = (progress = getProgress()) => {
    const total = 9;
    const done = Math.min(Object.keys(progress).length, total);
    const pct = Math.round((done / total) * 100);
    document.querySelectorAll("[data-progress-fill]").forEach((bar) => {
      bar.style.width = `${pct}%`;
    });
    document.querySelectorAll("[data-progress-text]").forEach((node) => {
      node.textContent = `${done}/${total} modules`;
    });
  };

  const animateCounters = () => {
    const counters = document.querySelectorAll("[data-count]");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.target.dataset.done) return;
        entry.target.dataset.done = "true";
        const target = Number(entry.target.dataset.count);
        const suffix = entry.target.dataset.suffix || "";
        const duration = 1100;
        const start = performance.now();

        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          entry.target.textContent = `${Math.round(target * eased)}${suffix}`;
          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      });
    }, { threshold: 0.35 });

    counters.forEach((counter) => observer.observe(counter));
  };

  const initAccordions = () => {
    document.querySelectorAll("[data-accordion]").forEach((item) => {
      const button = item.querySelector(".accordion-button");
      if (!button || button.dataset.accordionInit === "true") return;
      button.dataset.accordionInit = "true";
      button.addEventListener("click", () => {
        item.classList.toggle("open");
        const icon = item.querySelector(".accordion-icon");
        if (icon) icon.textContent = item.classList.contains("open") ? "-" : "+";
      });
    });
  };

  const initSearch = () => {
    const isValidSelector = (selector) => typeof selector === "string" && selector.trim().length > 0;

    document.querySelectorAll("[data-law-search]").forEach((input) => {
      if (input.dataset.searchInit === "true") return;
      input.dataset.searchInit = "true";
      const targetSelector = input.dataset.lawSearch;
      const items = isValidSelector(targetSelector)
        ? [...document.querySelectorAll(targetSelector)]
        : [];
      const empty = isValidSelector(input.dataset.emptyTarget)
        ? document.querySelector(input.dataset.emptyTarget)
        : null;

      input.addEventListener("input", () => {
        const query = input.value.trim().toLowerCase();
        let visible = 0;
        items.forEach((item) => {
          const text = item.textContent.toLowerCase();
          const match = !query || text.includes(query);
          item.classList.toggle("hidden-by-search", !match);
          if (match) visible += 1;
        });
        if (empty) empty.hidden = visible !== 0;
      });
    });
  };

  const initFilters = () => {
    document.querySelectorAll("[data-filter-group]").forEach((group) => {
      if (group.dataset.filterInit === "true") return;
      group.dataset.filterInit = "true";
      const targetSelector = group.dataset.filterGroup;
      const cards = [...document.querySelectorAll(targetSelector)];
      group.addEventListener("click", (event) => {
        const button = event.target.closest("[data-filter]");
        if (!button) return;
        group.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        const filter = button.dataset.filter;
        cards.forEach((card) => {
          const show = filter === "all" || card.dataset.category === filter;
          card.classList.toggle("hidden-by-search", !show);
        });
      });
    });
  };

  const initReveal = () => {
    document.querySelectorAll(".law-card, .metric-card, .timeline-item, .flow-step, .penalty-card").forEach((node, index) => {
      node.classList.add("fade-in");
      node.style.animationDelay = `${Math.min(index * 55, 420)}ms`;
    });
  };

  return {
    init() {
      markVisited();
      animateCounters();
      initAccordions();
      initSearch();
      initFilters();
      initReveal();
    },
    showAchievement,
    updateProgress,
  };
})();

export { LawsUI };
/* Init is called from React via useLawsPage() on laws subroutes only. */
