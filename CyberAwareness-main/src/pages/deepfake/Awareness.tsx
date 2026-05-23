import { useState } from "react";
import "./css/deepfake.css";
import { DeepfakeModal, useDeepfakeLab, XpDock } from "./deepfakeReact";

function Awareness() {
  const { xp, modal, setModal, awardXp } = useDeepfakeLab();
  const [scanning, setScanning] = useState(false);

  const validateReadiness = () => {
    setScanning(false);
    window.setTimeout(() => setScanning(true), 0);
    awardXp(15, "Awareness Operator");
  };

  return (
    <div className="deepfake-shell">
      <main className="df-page">
        <section className="df-section">
          <span className="df-kicker">Preparedness</span>

          <h1>Awareness Timeline</h1>

          <p className="df-lead">
            A practical response flow for suspicious video calls, voice notes,
            livestreams, and celebrity or executive impersonation.
          </p>
        </section>

        <section className="df-grid cols-2">
          <div className="df-panel">
            <div className="timeline">
              <div className="timeline-item">
                <h3>Minute 0: Pause</h3>

                <p>
                  Do not click, pay, share OTPs, or send files while pressure
                  is high.
                </p>
              </div>

              <div className="timeline-item">
                <h3>Minute 2: Verify</h3>

                <p>
                  Use a known phone number, official website, or internal
                  directory to confirm identity.
                </p>
              </div>

              <div className="timeline-item">
                <h3>Minute 5: Inspect</h3>

                <p>
                  Look for lip-sync drift, repeating gestures, lighting
                  mismatch, unnatural voice tone, and odd urgency.
                </p>
              </div>

              <div className="timeline-item">
                <h3>Minute 10: Escalate</h3>

                <p>
                  Report to platform support, cyber cell, bank, or internal
                  security team with preserved evidence.
                </p>
              </div>
            </div>
          </div>

          <div
            className={`df-panel scan-ready ${scanning ? "scanning" : ""}`}
            id="readinessScan"
          >
            <span className="df-kicker hot">
              Readiness Checklist
            </span>

            <ul className="df-list">
              <li>
                Use multi-person approval for payments and account changes.
              </li>

              <li>
                Agree on code words for urgent family or executive requests.
              </li>

              <li>
                Keep official reporting links bookmarked before an incident.
              </li>

              <li>
                Train teams to question media that demands secrecy or speed.
              </li>
            </ul>

            <button
              className="df-button"
              onClick={validateReadiness}
            >
              Validate Readiness
            </button>
          </div>
        </section>
      </main>

      <XpDock xp={xp} />
      <DeepfakeModal modal={modal} onClose={() => setModal(null)} />

      <footer className="df-footer">
        Awareness playbooks reduce risk before detection tools are needed.
      </footer>
    </div>
  );
}

export default Awareness;
