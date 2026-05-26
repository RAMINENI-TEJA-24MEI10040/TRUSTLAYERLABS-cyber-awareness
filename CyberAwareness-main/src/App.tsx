import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';

import ScrollToTop from './components/ScrollToTop';
import LoadingScreen from './components/LoadingScreen';

import NotFound from './pages/NotFound';

import Phishing from './pages/phishing';
import Deepfake from './pages/deepfake';
import DeepfakeAwareness from './pages/deepfake/Awareness';
import DeepfakeChallenge from './pages/deepfake/Challenge';
import DeepfakeCaseStudy from './pages/deepfake/CaseStudy';
import DeepfakeReport from './pages/deepfake/Report';
import QR from './pages/qr';
import QRScanner from './pages/qr/Scanner';
import QRChallenge from './pages/qr/Challenge';
import QRCaseStudy from './pages/qr/CaseStudy';
import QRAwareness from './pages/qr/Awareness';
import QRReport from './pages/qr/Report';
import UPI from './pages/upi';
import UPIAwareness from './pages/upi/Awareness';
import UPICaseStudy from './pages/upi/CaseStudy';
import UPIDemo from './pages/upi/Demo';
import UPIReport from './pages/upi/Report';
import Laws from './pages/laws';
import LawIpc from './pages/laws/Ipc';
import LawBns from './pages/laws/Bns';
import LawItAct from './pages/laws/ItAct';
import LawReporting from './pages/laws/Reporting';
import LawRights from './pages/laws/Rights';
import LawAwareness from './pages/laws/Awareness';
import LawPenalties from './pages/laws/Penalties';
import LawCaseStudy from './pages/laws/CaseStudy';
import Quiz from './pages/quiz';
import QuizPlay from './pages/quiz/Quiz';
import QuizChallenge from './pages/quiz/Challenge';
import QuizCaseStudy from './pages/quiz/CaseStudy';
import QuizLeaderboard from './pages/quiz/Leaderboard';
import Awareness from './pages/awareness';
import AwarenessPhishing from './pages/awareness/Phishing';
import AwarenessUpiFraud from './pages/awareness/UpiFraud';
import AwarenessQrScam from './pages/awareness/QrScam';
import AwarenessSocialMedia from './pages/awareness/SocialMedia';
import AwarenessDeepfake from './pages/awareness/Deepfake';
import AwarenessIdentityTheft from './pages/awareness/IdentityTheft';
import AwarenessPasswordMfa from './pages/awareness/PasswordMfa';
import Reporting from './pages/reporting';
import UrlScannerPage from "./pages/url-scanner";
import ThreatFeedPage from "./pages/threat-feed";
import IPScannerPage from "./pages/ip-scanner";
import BreachCheckerPage from "./pages/breach-checker";
import HomePage from './pages/index';
import AnalyzerPage from "./pages/analyzer";
import { Login, Signup } from "./pages/auth";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminPage from "./pages/admin";
import ScamLibrary from "./pages/scam-library";
import ScamDetailPage from "./pages/scam-library/[id]";
export default function App() {
  return (
    <>
      <ScrollToTop />

      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route
            path="/analyzer"
            element={<AnalyzerPage />}
          />
            <Route path="/login" element={<Login />} />

            <Route path="/signup" element={<Signup />} />
            <Route path="/url-scanner" element={<UrlScannerPage />} />
            <Route path="/threat-feed" element={<ThreatFeedPage />} />
            <Route path="/ip-scanner" element={<IPScannerPage />} />
            <Route path="/breach-checker" element={<BreachCheckerPage />} />
            <Route index element={<HomePage />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route path="/awareness" element={<Awareness />} />
            <Route path="/awareness/phishing" element={<AwarenessPhishing />} />
            <Route path="/awareness/upi-fraud" element={<AwarenessUpiFraud />} />
            <Route path="/awareness/qr-scam" element={<AwarenessQrScam />} />
            <Route path="/awareness/social-media" element={<AwarenessSocialMedia />} />
            <Route path="/awareness/deepfake" element={<AwarenessDeepfake />} />
            <Route path="/awareness/identity-theft" element={<AwarenessIdentityTheft />} />
            <Route path="/awareness/password-mfa" element={<AwarenessPasswordMfa />} />

            <Route path="/phishing" element={<Phishing />} />

            <Route path="/deepfake" element={<Deepfake />} />
            <Route path="/deepfake/awareness" element={<DeepfakeAwareness />} />
            <Route path="/deepfake/challenge" element={<DeepfakeChallenge />} />
            <Route path="/deepfake/case-study" element={<DeepfakeCaseStudy />} />
            <Route path="/deepfake/report" element={<DeepfakeReport />} />

            <Route path="/qr" element={<QR />} />
            <Route path="/qr/scanner" element={<QRScanner />} />
            <Route path="/qr/challenge" element={<QRChallenge />} />
            <Route path="/qr/case-study" element={<QRCaseStudy />} />
            <Route path="/qr/awareness" element={<QRAwareness />} />
            <Route path="/qr/report" element={<QRReport />} />

            <Route path="/upi" element={<UPI />} />
            <Route path="/upi/awareness" element={<UPIAwareness />} />
            <Route path="/upi/case-study" element={<UPICaseStudy />} />
            <Route path="/upi/demo" element={<UPIDemo />} />
            <Route path="/upi/report" element={<UPIReport />} />

            <Route path="/reporting" element={<Reporting />} />

            <Route path="/laws" element={<Laws />} />
            <Route path="/laws/dashboard" element={<Laws />} />
            <Route path="/laws/ipc" element={<LawIpc />} />
            <Route path="/laws/bns" element={<LawBns />} />
            <Route path="/laws/it-act" element={<LawItAct />} />
            <Route path="/laws/reporting" element={<LawReporting />} />
            <Route path="/laws/rights" element={<LawRights />} />
            <Route path="/laws/awareness" element={<LawAwareness />} />
            <Route path="/laws/penalties" element={<LawPenalties />} />
            <Route path="/laws/case-study" element={<LawCaseStudy />} />

            <Route path="/quiz" element={<Quiz />} />
            <Route path="/quiz/play" element={<QuizPlay />} />
            <Route path="/quiz/challenge" element={<QuizChallenge />} />
            <Route path="/quiz/case-study" element={<QuizCaseStudy />} />
            <Route path="/quiz/leaderboard" element={<QuizLeaderboard />} />

            <Route path="/scam-library" element={<ScamLibrary />} />
            <Route path="/scam-library/:id" element={<ScamDetailPage />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
