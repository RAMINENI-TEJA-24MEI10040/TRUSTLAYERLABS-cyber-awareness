const QR_STORAGE_KEY = "cybershield.qr.progress";

const defaultProgress = {
  xp: 0,
  scans: 0,
  detected: 0,
  challenges: 0,
  correct: 0,
  achievements: []
};

function readProgress() {
  try {
    return { ...defaultProgress, ...JSON.parse(localStorage.getItem(QR_STORAGE_KEY)) };
  } catch {
    return { ...defaultProgress };
  }
}

function writeProgress(progress) {
  localStorage.setItem(QR_STORAGE_KEY, JSON.stringify(progress));
  renderProgress(progress);
}

function addXP(points, reason) {
  const progress = readProgress();
  progress.xp += points;
  writeProgress(progress);
  showAchievement(`+${points} XP`, reason || "Threat analysis logged");
  return progress;
}

function unlockAchievement(id, title, description) {
  const progress = readProgress();
  if (progress.achievements.includes(id)) return;
  progress.achievements.push(id);
  progress.xp += 75;
  writeProgress(progress);
  showAchievement(title, `${description} +75 XP`);
}

function renderProgress(progress = readProgress()) {
  document.querySelectorAll("[data-qr-xp]").forEach((node) => {
    node.textContent = progress.xp.toLocaleString("en-IN");
  });
  document.querySelectorAll("[data-qr-scans]").forEach((node) => {
    node.textContent = progress.scans.toString();
  });
  document.querySelectorAll("[data-qr-detected]").forEach((node) => {
    node.textContent = progress.detected.toString();
  });
  document.querySelectorAll("[data-qr-correct]").forEach((node) => {
    node.textContent = progress.correct.toString();
  });
  document.querySelectorAll("[data-progress]").forEach((node) => {
    const value = Number(node.dataset.progress || 0);
    requestAnimationFrame(() => {
      node.style.width = `${Math.max(0, Math.min(100, value))}%`;
    });
  });
}

function showAchievement(title, description) {
  let toast = document.querySelector("[data-achievement-toast]");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "qr-toast";
    toast.setAttribute("data-achievement-toast", "");
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<strong>${title}</strong><span>${description}</span>`;
  toast.classList.add("show");
  window.clearTimeout(showAchievement.timer);
  showAchievement.timer = window.setTimeout(() => toast.classList.remove("show"), 3200);
}

function setupResultModal() {
  const modal = document.querySelector("[data-result-modal]");
  if (!modal) return;
  modal.addEventListener("click", (event) => {
    if (event.target.matches("[data-close-modal]") || event.target === modal) {
      modal.classList.remove("show");
    }
  });
}

function openResultModal(title, body) {
  const modal = document.querySelector("[data-result-modal]");
  if (!modal) return;
  modal.querySelector("[data-modal-title]").textContent = title;
  modal.querySelector("[data-modal-body]").innerHTML = body;
  modal.classList.add("show");
}

function renderLawTip() {
  const tipNode = document.querySelector("[data-law-tip]");
  if (!tipNode || !window.QRScamData) return;
  const tips = window.QRScamData.lawTips;
  const index = new Date().getDate() % tips.length;
  tipNode.textContent = tips[index];
}

function initQRCommon() {
  renderProgress();
  renderLawTip();
  setupResultModal();
}

document.addEventListener("DOMContentLoaded", initQRCommon);
if (document.readyState !== "loading") {
  initQRCommon();
}

window.QRProgress = {
  read: readProgress,
  write: writeProgress,
  addXP,
  unlockAchievement,
  render: renderProgress,
  openResultModal,
  showAchievement
};
