import { Link } from "react-router-dom";
import "./css/deepfake.css";

export default function DeepfakeHome() {
  return (
    <div className="deepfake-shell transition-colors duration-300">
      <div className="df-page">
        <h1 className="text-4xl font-bold mb-6">
          Deepfake Awareness Module
        </h1>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link className="df-card df-card-link" to="/deepfake/awareness">
            Awareness
          </Link>
          <Link className="df-card df-card-link" to="/deepfake/challenge">
            Challenge
          </Link>
          <Link className="df-card df-card-link" to="/deepfake/case-study">
            Cases
          </Link>
          <Link className="df-card df-card-link" to="/deepfake/report">
            Report
          </Link>
        </div>
      </div>
    </div>
  );
}