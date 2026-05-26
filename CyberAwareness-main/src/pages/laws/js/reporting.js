const ReportingFlow = (() => {
  const initChecklist = () => {
    const checks = document.querySelectorAll("[data-report-check]");
    const fill = document.querySelector("[data-report-fill]");
    const text = document.querySelector("[data-report-score]");
    if (!checks.length || !fill || !text) return;

    const update = () => {
      const done = [...checks].filter((item) => item.checked).length;
      const pct = Math.round((done / checks.length) * 100);
      fill.style.width = `${pct}%`;
      text.textContent = `${done}/${checks.length} ready`;
      if (done === checks.length) {
        LawsUI.showAchievement("Report Kit Ready", "Evidence checklist completed.");
      }
    };

    checks.forEach((check) => check.addEventListener("change", update));
    update();
  };

  const initFlowSteps = () => {
    document.querySelectorAll("[data-flow-step]").forEach((step) => {
      step.addEventListener("click", () => {
        document.querySelectorAll("[data-flow-step]").forEach((item) => item.classList.remove("active"));
        step.classList.add("active");
      });
    });
  };

  return {
    init() {
      initChecklist();
      initFlowSteps();
    },
  };
})();

document.addEventListener("DOMContentLoaded", ReportingFlow.init);
