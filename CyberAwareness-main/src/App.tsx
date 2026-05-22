import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ThreatBanner from './components/ThreatBanner';
import CoreModules from './components/CoreModules';
import DashboardPreview from './components/DashboardPreview';
import Footer from './components/Footer';

import AwarenessIndex  from './pages/awareness/index';
import Phishing        from './pages/awareness/Phishing';
import UpiFraud        from './pages/awareness/UpiFraud';
import QrScam          from './pages/awareness/QrScam';
import SocialMedia     from './pages/awareness/SocialMedia';
import Deepfake        from './pages/awareness/Deepfake';
import IdentityTheft   from './pages/awareness/IdentityTheft';
import PasswordMfa     from './pages/awareness/PasswordMfa';
import IndianCyberLawPage from './pages/Indian Cyber law/IndianCyberlaw';
import IncidentReportingPage from './pages/incident reporting guidance/incidentreporting';
import { AssistantProvider } from './ai-assistant/assistantStore';
import AIAssistantSection from './ai-assistant/AIAssistantSection';
import ChatWidget      from './ai-assistant/ChatWidget';

function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white scroll-smooth">
      <Navbar />
      <Hero />
      <ThreatBanner />
      <CoreModules />
      <DashboardPreview />
      <AIAssistantSection />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AssistantProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/"                          element={<HomePage />} />
          <Route path="/awareness"                 element={<AwarenessIndex />} />
          <Route path="/awareness/phishing"        element={<Phishing />} />
          <Route path="/awareness/upi-fraud"       element={<UpiFraud />} />
          <Route path="/awareness/qr-scam"         element={<QrScam />} />
          <Route path="/awareness/social-media"    element={<SocialMedia />} />
          <Route path="/awareness/deepfake"        element={<Deepfake />} />
          <Route path="/awareness/identity-theft"  element={<IdentityTheft />} />
          <Route path="/awareness/password-mfa"    element={<PasswordMfa />} />
          <Route path="/laws"                      element={<IndianCyberLawPage />} />
          <Route path="/incident-reporting"        element={<IncidentReportingPage />} />
        </Routes>
        <ChatWidget />
      </BrowserRouter>
    </AssistantProvider>
  );
}

export default App;
