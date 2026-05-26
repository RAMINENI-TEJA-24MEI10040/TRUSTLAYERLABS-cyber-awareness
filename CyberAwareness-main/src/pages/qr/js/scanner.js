function createFakeQR() {
  const holder = document.querySelector("[data-fake-qr]");
  if (!holder) return;
  holder.innerHTML = "";
  for (let index = 0; index < 81; index += 1) {
    const block = document.createElement("span");
    const finder = index < 20 || index % 9 < 2 || (index > 58 && index % 9 > 5);
    if (!finder && index % 3 === 0) block.classList.add("dim");
    holder.appendChild(block);
  }
}

function getScenario(id) {
  return window.QRScamData.scenarios.find((scenario) => scenario.id === id) || window.QRScamData.scenarios[0];
}

function renderScenario(scenario) {
  document.querySelector("[data-scan-title]").textContent = scenario.title;
  document.querySelector("[data-scan-source]").textContent = scenario.source;
  document.querySelector("[data-scan-url]").textContent = scenario.url;
  document.querySelector("[data-risk-value]").textContent = `${scenario.risk}%`;
  document.querySelector("[data-risk-fill]").style.width = `${scenario.risk}%`;
  document.querySelector("[data-payment-merchant]").textContent = scenario.merchant;
  document.querySelector("[data-payment-amount]").textContent = scenario.amount;
  document.querySelector("[data-payment-alert]").textContent =
    scenario.verdict === "scam"
      ? "UPI ALERT: approving this request may debit your account."
      : "No suspicious payment request detected in this flow.";

  const verdict = document.querySelector("[data-scan-verdict]");
  verdict.textContent = scenario.verdict === "scam" ? "High risk scam pattern" : "Low risk scan";
  verdict.className = scenario.verdict === "scam" ? "qr-chip red" : "qr-chip";

  const indicators = document.querySelector("[data-indicators]");
  indicators.innerHTML = "";
  scenario.indicators.forEach((indicator) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `qr-indicator ${indicator.type === "danger" ? "danger" : ""}`;
    button.innerHTML = `<strong>${indicator.title}</strong><span>${indicator.detail}</span>`;
    button.addEventListener("click", () => {
      QRProgress.addXP(15, `Indicator inspected: ${indicator.title}`);
    });
    indicators.appendChild(button);
  });
}

function scanScenario(id) {
  const scenario = getScenario(id);
  const progress = QRProgress.read();
  progress.scans += 1;
  if (scenario.verdict === "scam") progress.detected += 1;
  QRProgress.write(progress);
  renderScenario(scenario);
  QRProgress.addXP(scenario.verdict === "scam" ? 40 : 20, "QR scan analysis complete");
  if (progress.scans >= 3) {
    QRProgress.unlockAchievement("scanner-analyst", "Achievement unlocked", "Scanner Analyst: reviewed 3 QR flows.");
  }
}

function initScanner() {
  if (!document.querySelector("[data-scanner-page]")) return;
  createFakeQR();
  renderScenario(window.QRScamData.scenarios[0]);
  document.querySelectorAll("[data-scenario-id]").forEach((button) => {
    button.addEventListener("click", () => scanScenario(button.dataset.scenarioId));
  });
}

document.addEventListener("DOMContentLoaded", initScanner);
if (document.readyState !== "loading") {
  initScanner();
}
