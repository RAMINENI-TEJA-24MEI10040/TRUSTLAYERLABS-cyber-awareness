const LawCaseStudy = (() => {
  const cases = [
    {
      title: "UPI Screen Share Trap",
      brief: "A caller pretending to be support asks the victim to install a screen-sharing app and read OTP alerts.",
      choices: [
        { label: "Disconnect, freeze payment instruments, preserve call logs, report within golden hour.", score: 3, type: "correct" },
        { label: "Keep negotiating with the caller to recover the amount directly.", score: 0, type: "risky" },
        { label: "Delete the app and wait for the bank statement.", score: 1, type: "" },
      ],
      lesson: "Fast preservation and formal reporting improve tracing and reduce further compromise.",
    },
    {
      title: "Morphed Image Extortion",
      brief: "A student receives threats that edited images will be posted unless money is paid.",
      choices: [
        { label: "Pay once and ask the offender to delete everything.", score: 0, type: "risky" },
        { label: "Save evidence, avoid engagement, inform trusted adults, report cyber harassment.", score: 3, type: "correct" },
        { label: "Reply publicly with screenshots on social media.", score: 1, type: "" },
      ],
      lesson: "Harassment cases need evidence capture, platform takedown, and legal reporting without escalating exposure.",
    },
    {
      title: "Company Data Leak",
      brief: "An employee finds customer records posted in a private chat after a phishing compromise.",
      choices: [
        { label: "Notify incident response, revoke access, preserve logs, assess legal notification duties.", score: 3, type: "correct" },
        { label: "Quietly delete the chat and reset only their password.", score: 1, type: "" },
        { label: "Ask the group admin to remove the files and close the matter.", score: 0, type: "risky" },
      ],
      lesson: "Data incidents demand containment, audit trail preservation, and responsible escalation.",
    },
  ];

  let index = 0;
  let score = 0;
  const answered = new Set();

  const render = () => {
    const stage = document.querySelector("[data-case-stage]");
    const meter = document.querySelector("[data-case-meter]");
    if (!stage) return;
    const item = cases[index];
    stage.innerHTML = `
      <p class="eyebrow">Case ${index + 1} / ${cases.length}</p>
      <h2>${item.title}</h2>
      <p class="lead">${item.brief}</p>
      <div class="choice-grid">
        ${item.choices.map((choice, choiceIndex) => `
          <button class="choice" data-choice="${choiceIndex}">${choice.label}</button>
        `).join("")}
      </div>
      <p data-case-lesson hidden>${item.lesson}</p>
    `;
    if (meter) meter.style.width = `${Math.round((index / cases.length) * 100)}%`;
  };

  const choose = (button) => {
    const choiceIndex = Number(button.dataset.choice);
    const item = cases[index];
    const choice = item.choices[choiceIndex];
    if (!choice || answered.has(index)) return;

    answered.add(index);
    score += choice.score;
    button.classList.add("selected", choice.type);
    document.querySelector("[data-case-lesson]").hidden = false;
    document.querySelectorAll("[data-choice]").forEach((node) => {
      const picked = item.choices[Number(node.dataset.choice)];
      if (picked.type === "correct") node.classList.add("correct");
    });

    if (choice.type === "correct") {
      LawsUI.showAchievement("Clean Response", "You chose the strongest legal response path.");
    }
  };

  const next = () => {
    if (index < cases.length - 1) {
      index += 1;
      render();
      return;
    }

    const max = cases.length * 3;
    const pct = Math.round((score / max) * 100);
    document.querySelector("[data-case-stage]").innerHTML = `
      <p class="eyebrow">Debrief Complete</p>
      <h2>Response score: ${pct}%</h2>
      <p class="lead">You completed the interactive case desk. Strong responses preserve evidence, reduce harm, and move quickly into official channels.</p>
      <button class="law-btn primary" data-restart-case>Restart desk</button>
    `;
    document.querySelector("[data-case-meter]").style.width = "100%";
    LawsUI.showAchievement("Case Analyst", "All case-study decisions completed.");
  };

  const init = () => {
    if (!document.querySelector("[data-case-stage]")) return;
    render();
    document.addEventListener("click", (event) => {
      const choice = event.target.closest("[data-choice]");
      if (choice) choose(choice);
      if (event.target.closest("[data-next-case]")) next();
      if (event.target.closest("[data-restart-case]")) {
        index = 0;
        score = 0;
        answered.clear();
        render();
      }
    });
  };

  return { init };
})();

document.addEventListener("DOMContentLoaded", LawCaseStudy.init);
