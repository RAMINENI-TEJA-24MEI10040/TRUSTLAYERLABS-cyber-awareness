(function () {
  const signals = [
    { label: "Facial micro-jitter", value: 82, note: "Eye-line drift and cheek texture mismatch detected." },
    { label: "Audio sync variance", value: 68, note: "Voice cadence is offset from lip motion by 142ms." },
    { label: "Lighting consistency", value: 57, note: "Specular highlights do not match the room light direction." },
    { label: "Compression noise", value: 74, note: "Background and face use different artifact patterns." }
  ];

  function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function renderWaveform() {
    const wave = document.querySelector("[data-waveform]");
    if (!wave) return;
    wave.innerHTML = "";
    for (let i = 0; i < 28; i += 1) {
      const bar = document.createElement("span");
      bar.style.setProperty("--h", `${randomBetween(18, 96)}%`);
      bar.style.setProperty("--d", `${i * 35}ms`);
      wave.appendChild(bar);
    }
  }

  function runAnalysis(fileName) {
    const panel = document.querySelector("[data-analysis-panel]");
    const risk = randomBetween(61, 94);
    const confidence = randomBetween(78, 97);
    const authenticity = Math.max(6, 100 - risk + randomBetween(-5, 5));

    panel.classList.add("scanning");
    document.querySelector("[data-file-name]").textContent = fileName || "synthetic_sample.mp4";
    document.querySelector("[data-risk-score]").textContent = `${risk}%`;
    document.querySelector("[data-confidence-score]").textContent = `${confidence}%`;
    document.querySelector("[data-auth-score]").textContent = `${authenticity}%`;
    document.querySelector("[data-risk-meter]").style.setProperty("--value", `${risk}%`);
    document.querySelector("[data-confidence-meter]").style.setProperty("--value", `${confidence}%`);

    const list = document.querySelector("[data-evidence-list]");
    list.innerHTML = "";
    signals.forEach((signal) => {
      const value = Math.min(99, Math.max(30, signal.value + randomBetween(-10, 10)));
      const card = document.createElement("article");
      card.className = "evidence-card";
      card.innerHTML = `<span class="df-badge red">${value}% anomaly</span><h3>${signal.label}</h3><p>${signal.note}</p>`;
      list.appendChild(card);
    });

    renderWaveform();
    if (window.DeepfakeLab) {
      window.DeepfakeLab.awardXp(35, "Forensic Scan Operator");
    }
  }

  function initUpload() {
    const zone = document.querySelector("[data-upload-zone]");
    const input = document.querySelector("[data-upload-input]");
    const sample = document.querySelector("[data-run-sample]");
    if (!zone || !input) return;

    zone.addEventListener("click", () => input.click());
    input.addEventListener("change", () => runAnalysis(input.files[0]?.name));

    ["dragenter", "dragover"].forEach((eventName) => {
      zone.addEventListener(eventName, (event) => {
        event.preventDefault();
        zone.classList.add("dragging");
      });
    });

    ["dragleave", "drop"].forEach((eventName) => {
      zone.addEventListener(eventName, (event) => {
        event.preventDefault();
        zone.classList.remove("dragging");
      });
    });

    zone.addEventListener("drop", (event) => runAnalysis(event.dataTransfer.files[0]?.name));
    if (sample) sample.addEventListener("click", () => runAnalysis("boardroom_voice_clone.mp4"));
  }

  document.addEventListener("DOMContentLoaded", () => {
    initUpload();
    renderWaveform();
  });
})();
