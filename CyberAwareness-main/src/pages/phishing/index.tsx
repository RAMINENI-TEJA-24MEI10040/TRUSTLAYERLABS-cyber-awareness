import EducationSection from "./components/EducationSection";
import Hero from "./components/Hero";
import Simulator from "./components/Simulator";
import "./phishing.css";

export default function PhishingPage() {
  return (
    <div className="ph-page transition-colors duration-300">
      <Hero />
      <EducationSection />
      <Simulator />
    </div>
  );
}
