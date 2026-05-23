(function () {
  const cases = [
    {
      title: "Voice-cloned CEO payment order",
      impact: "Finance team nearly wired emergency vendor funds.",
      signal: "Caller avoided video and pushed a 20-minute deadline.",
      response: "Verify through a second channel and require payment approval."
    },
    {
      title: "Fake hiring interview kit",
      impact: "Applicants were asked to upload IDs to a cloned portal.",
      signal: "Interview video used looped nods and generic answers.",
      response: "Check company domain, recruiter identity, and offer sequence."
    },
    {
      title: "Synthetic investment livestream",
      impact: "Viewers were routed to a crypto wallet deposit page.",
      signal: "Pinned comments repeated the same wallet pressure script.",
      response: "Pause, search official channels, and report the stream."
    }
  ];

  const examples = [
    { label: "REAL", title: "Natural webcam recording", note: "Compression artifacts are consistent across face, hair, and background." },
    { label: "FAKE", title: "Face-swapped executive clip", note: "Edges around glasses shimmer during fast head movement." },
    { label: "FAKE", title: "AI voice ransom call", note: "Emotion is exaggerated but breath and room tone stay flat." }
  ];

  function card(item) {
    return `<article class="df-card"><span class="df-badge red">Case file</span><h3>${item.title}</h3><p>${item.impact}</p><ul class="df-list"><li>${item.signal}</li><li>${item.response}</li></ul></article>`;
  }

  function example(item) {
    const badgeClass = item.label === "REAL" ? "green" : "red";
    return `<article class="df-card"><span class="df-badge ${badgeClass}">${item.label}</span><h3>${item.title}</h3><p>${item.note}</p><button class="df-button" data-scan-target="#exampleScanner" data-badge="Example Analyst">Scan Evidence</button></article>`;
  }

  document.addEventListener("DOMContentLoaded", () => {
    const caseGrid = document.querySelector("[data-case-grid]");
    const exampleGrid = document.querySelector("[data-example-grid]");
    if (caseGrid) caseGrid.innerHTML = cases.map(card).join("");
    if (exampleGrid) exampleGrid.innerHTML = examples.map(example).join("");
  });
})();
