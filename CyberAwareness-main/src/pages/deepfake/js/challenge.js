(function () {
  const rounds = [
    {
      title: "Executive video statement",
      type: "FAKE",
      risk: 86,
      clue: "Blink cadence is too regular and the jaw shadow slides independently.",
      details: ["Unnatural teeth edges", "Repeated background noise", "Skin texture is over-smoothed"]
    },
    {
      title: "Customer support voice note",
      type: "FAKE",
      risk: 78,
      clue: "The voice has flat room tone and odd pauses before account numbers.",
      details: ["No natural breath profile", "Robotic sibilance", "Urgent payment request"]
    },
    {
      title: "Recorded campus interview",
      type: "REAL",
      risk: 22,
      clue: "Lighting, micro-expression timing, and compression artifacts remain consistent.",
      details: ["Natural head motion", "Stable reflections", "Organic background chatter"]
    },
    {
      title: "Celebrity giveaway livestream",
      type: "FAKE",
      risk: 91,
      clue: "The face patch is sharper than the hairline and the offer demands crypto transfer.",
      details: ["High-pressure CTA", "Mouth shape mismatch", "Suspicious channel history"]
    }
  ];

  let index = 0;
  let score = 0;
  let streak = 0;

  function currentRound() {
    return rounds[index % rounds.length];
  }

  function renderRound() {
    const round = currentRound();
    document.querySelector("[data-round-number]").textContent = `${index + 1}/${rounds.length}`;
    document.querySelector("[data-scenario-title]").textContent = round.title;
    document.querySelector("[data-scenario-risk]").textContent = `${round.risk}%`;
    document.querySelector("[data-scenario-meter]").style.setProperty("--value", `${round.risk}%`);
    document.querySelector("[data-feedback]").classList.remove("show");

    const clues = document.querySelector("[data-clues]");
    clues.innerHTML = "";
    round.details.forEach((detail) => {
      const item = document.createElement("div");
      item.className = "clue";
      item.textContent = detail;
      clues.appendChild(item);
    });

    document.querySelectorAll("[data-choice]").forEach((button) => {
      button.disabled = false;
      button.classList.remove("correct", "wrong");
    });
  }

  function updateStats() {
    document.querySelector("[data-score]").textContent = String(score);
    document.querySelector("[data-streak]").textContent = String(streak);
  }

  function answer(choice, button) {
    const round = currentRound();
    const correct = choice === round.type;
    const feedback = document.querySelector("[data-feedback]");

    document.querySelectorAll("[data-choice]").forEach((btn) => {
      btn.disabled = true;
      if (btn.dataset.choice === round.type) btn.classList.add("correct");
    });

    if (correct) {
      score += 100;
      streak += 1;
      button.classList.add("correct");
      feedback.textContent = `Correct. ${round.clue}`;
      if (window.DeepfakeLab) window.DeepfakeLab.awardXp(25, streak >= 3 ? "Pattern Hunter" : "");
    } else {
      streak = 0;
      button.classList.add("wrong");
      feedback.textContent = `Missed signal. ${round.clue}`;
    }

    feedback.classList.add("show");
    updateStats();
  }

  function nextRound() {
    index += 1;
    if (index >= rounds.length) {
      const accuracy = Math.round((score / (rounds.length * 100)) * 100);
      if (window.DeepfakeLab) {
        window.DeepfakeLab.awardXp(50, "Challenge Complete");
        window.DeepfakeLab.showModal("Final investigation result", `Score ${score}. Accuracy ${accuracy}%. Review the evidence cards, then rerun the challenge to sharpen your detection instincts.`);
      }
      index = 0;
      score = 0;
      streak = 0;
      updateStats();
    }
    renderRound();
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-choice]").forEach((button) => {
      button.addEventListener("click", () => answer(button.dataset.choice, button));
    });
    document.querySelector("[data-next-round]")?.addEventListener("click", nextRound);
    renderRound();
    updateStats();
  });
})();
