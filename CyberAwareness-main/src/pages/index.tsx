import Hero from "../components/Hero";

import CoreModules from "../components/CoreModules";

import DashboardPreview from "../components/DashboardPreview";

import ThreatBanner from "../components/ThreatBanner";

import ThreatTicker from "../components/ThreatTicker";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-300">

      <Hero />

      <ThreatTicker />

      <CoreModules />

      <DashboardPreview />

      <ThreatBanner />

    </div>
  );
}