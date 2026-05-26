let currentIndex = 0;
let score = 0;
let streak = 0;
let answered = false;

function currentQuestion() {
  return window.QRScamData.challengeQuestions[currentIndex];
}

function renderChallenge() {
  const question = currentQuestion();
  answered = false;
  document.querySelector("[data-question-number]").textContent = String(currentIndex + 1);
  document.querySelector("[data-question-total]").textContent = String(window.QRScamData.challengeQuestions.length);
  document.querySelector("[data-question-title]").textContent = question.title;
  document.querySelector("[data-question-context]").textContent = question.context;
  document.querySelector("[data-challenge-progress]").style.width =
    `${(currentIndex / window.QRScamData.challengeQuestions.length) * 100}%`;
  document.querySelector("[data-feedback]").className = "feedback-panel";
  document.querySelector("[data-feedback]").textContent = "";
  document.querySelector("[data-next-question]").style.display = "none";
  document.querySelectorAll("[data-answer]").forEach((button) => {
    button.disabled = false;
    button.classList.remove("correct", "wrong");
  });
}

function updateScoreboard() {
  document.querySelector("[data-score]").textContent = String(score);
  document.querySelector("[data-streak]").textContent = String(streak);
  document.querySelector("[data-accuracy]").textContent =
    currentIndex === 0 ? "0%" : `${Math.round((score / currentIndex) * 100)}%`;
}

function chooseAnswer(answer) {
  if (answered) return;
  answered = true;
  const question = currentQuestion();
  const isCorrect = answer === question.answer;
  const feedback = document.querySelector("[data-feedback]");

  document.querySelectorAll("[data-answer]").forEach((button) => {
    button.disabled = true;
    if (button.dataset.answer === question.answer) button.classList.add("correct");
    if (button.dataset.answer === answer && !isCorrect) button.classList.add("wrong");
  });

  if (isCorrect) {
    score += 1;
    streak += 1;
    QRProgress.addXP(60 + streak * 10, "Safe or Scam answer correct");
    feedback.className = "feedback-panel show good";
    feedback.textContent = `Correct. ${question.clue}`;
    if (streak === 3) {
      QRProgress.unlockAchievement("streak-3", "Achievement unlocked", "Three correct QR calls in a row.");
    }
  } else {
    streak = 0;
    feedback.className = "feedback-panel show bad";
    feedback.textContent = `Not this time. ${question.clue}`;
  }

  currentIndex += 1;
  const progress = QRProgress.read();
  progress.challenges += 1;
  if (isCorrect) progress.correct += 1;
  QRProgress.write(progress);
  updateScoreboard();
  document.querySelector("[data-next-question]").style.display = "inline-flex";
}

function finishChallenge() {
  const total = window.QRScamData.challengeQuestions.length;
  const accuracy = Math.round((score / total) * 100);
  document.querySelector("[data-challenge-progress]").style.width = "100%";
  QRProgress.openResultModal(
    "Final results",
    `<p>You identified <strong>${score}</strong> of <strong>${total}</strong> QR scenarios.</p>
     <p>Accuracy: <strong>${accuracy}%</strong></p>
     <p>${accuracy >= 80 ? "SOC status: QR fraud ready." : "Review the indicators and run another round."}</p>`
  );
}

function nextQuestion() {
  if (currentIndex >= window.QRScamData.challengeQuestions.length) {
    finishChallenge();
    return;
  }
  renderChallenge();
}

function resetChallenge() {
  currentIndex = 0;
  score = 0;
  streak = 0;
  updateScoreboard();
  renderChallenge();
}

function initChallenge() {
  if (!document.querySelector("[data-challenge-page]")) return;
  document.querySelectorAll("[data-answer]").forEach((button) => {
    button.addEventListener("click", () => chooseAnswer(button.dataset.answer));
  });
  document.querySelector("[data-next-question]").addEventListener("click", nextQuestion);
  document.querySelector("[data-restart-challenge]").addEventListener("click", resetChallenge);
  resetChallenge();
}

document.addEventListener("DOMContentLoaded", initChallenge);
if (document.readyState !== "loading") {
  initChallenge();
}
