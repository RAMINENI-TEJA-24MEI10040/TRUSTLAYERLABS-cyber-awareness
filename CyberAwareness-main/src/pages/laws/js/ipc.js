const SectionExplorer = (() => {
  const initSectionClicks = () => {
    document.querySelectorAll("[data-section-card]").forEach((card) => {
      if (card.dataset.sectionInit === "true") return;
      card.dataset.sectionInit = "true";
      card.addEventListener("click", () => {
        const detailId = card.dataset.sectionCard;
        const detail = document.getElementById(detailId);
        if (!detail) return;
        const isOpen = detail.classList.contains("open");

        // Close any previously opened accordion details
        document.querySelectorAll("[data-accordion]").forEach((a) => {
          a.classList.remove("open");
          const aicon = a.querySelector(".accordion-icon");
          if (aicon) aicon.textContent = "+";
        });

        // Toggle the clicked detail
        if (!isOpen) {
          detail.classList.add("open");
          const icon = detail.querySelector(".accordion-icon");
          if (icon) icon.textContent = "-";
        }

        detail.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    });
  };

  const initCopyButtons = () => {
    document.querySelectorAll("[data-copy-section]").forEach((button) => {
      button.addEventListener("click", async () => {
        const section = button.dataset.copySection;
        try {
          await navigator.clipboard.writeText(section);
          LawsUI.showAchievement("Section Copied", `${section} is ready for your notes.`);
        } catch {
          LawsUI.showAchievement("Section Selected", section);
        }
      });
    });
  };

  return {
    init() {
      initSectionClicks();
      initCopyButtons();
    },
  };
})();

export { SectionExplorer };

if (document.readyState !== "loading") {
  SectionExplorer.init();
} else {
  document.addEventListener("DOMContentLoaded", SectionExplorer.init);
}
