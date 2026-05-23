import "./css/deepfake.css";
import { caseFiles, DeepfakeModal, useDeepfakeLab, XpDock } from "./deepfakeReact";

export default function CaseStudy() {
  const { xp, modal, setModal } = useDeepfakeLab();

  return (
    <div className="deepfake-shell">
      <main className="df-page">
        <section className="df-section">
          <span className="df-kicker">Incident Library</span>
          <h1>Scam Case Studies</h1>
          <p className="df-lead">
            Explore common deepfake abuse patterns and the defensive response that stops them from becoming real incidents.
          </p>
        </section>

        <section className="df-grid cols-3">
          {caseFiles.map((item) => (
            <article className="df-card" key={item.title}>
              <span className="df-badge red">Case file</span>
              <h3>{item.title}</h3>
              <p>{item.impact}</p>
              <ul className="df-list">
                <li>{item.signal}</li>
                <li>{item.response}</li>
              </ul>
            </article>
          ))}
        </section>

        <section className="df-section df-panel" style={{ marginTop: 18 }}>
          <span className="df-kicker hot">SOC Rule</span>
          <h2>Trust the workflow over the media</h2>
          <p>
            Deepfake scams succeed when a convincing voice or face bypasses normal approval controls.
            Keep payment checks, identity verification, and incident escalation active even when the message appears familiar.
          </p>
        </section>
      </main>

      <XpDock xp={xp} />
      <DeepfakeModal modal={modal} onClose={() => setModal(null)} />

      <footer className="df-footer">
        Case studies are awareness scenarios based on common scam patterns.
      </footer>
    </div>
  );
}
