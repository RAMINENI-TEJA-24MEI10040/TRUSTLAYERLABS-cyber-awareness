import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';
import ScrollToTop from './components/ScrollToTop';
import LoadingScreen from './components/LoadingScreen';
import ProtectedRoute from './components/auth/ProtectedRoute';

const NotFound = lazy(() => import('./pages/NotFound'));
const HomePage = lazy(() => import('./pages/index'));
const AnalyzerPage = lazy(() => import('./pages/analyzer'));
const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));
const AdminPage = lazy(() => import('./pages/admin'));
const UrlScannerPage = lazy(() => import('./pages/url-scanner'));
const ThreatFeedPage = lazy(() => import('./pages/threat-feed'));
const IPScannerPage = lazy(() => import('./pages/ip-scanner'));
const BreachCheckerPage = lazy(() => import('./pages/breach-checker'));

const Phishing = lazy(() => import('./pages/phishing'));
const Deepfake = lazy(() => import('./pages/deepfake'));
const DeepfakeAwareness = lazy(() => import('./pages/deepfake/Awareness'));
const DeepfakeChallenge = lazy(() => import('./pages/deepfake/Challenge'));
const DeepfakeCaseStudy = lazy(() => import('./pages/deepfake/CaseStudy'));
const DeepfakeReport = lazy(() => import('./pages/deepfake/Report'));

const QR = lazy(() => import('./pages/qr'));
const QRScanner = lazy(() => import('./pages/qr/Scanner'));
const QRChallenge = lazy(() => import('./pages/qr/Challenge'));
const QRCaseStudy = lazy(() => import('./pages/qr/CaseStudy'));
const QRAwareness = lazy(() => import('./pages/qr/Awareness'));
const QRReport = lazy(() => import('./pages/qr/Report'));

const UPI = lazy(() => import('./pages/upi'));
const UPIAwareness = lazy(() => import('./pages/upi/Awareness'));
const UPICaseStudy = lazy(() => import('./pages/upi/CaseStudy'));
const UPIDemo = lazy(() => import('./pages/upi/Demo'));
const UPIReport = lazy(() => import('./pages/upi/Report'));

const Laws = lazy(() => import('./pages/laws'));
const LawIpc = lazy(() => import('./pages/laws/Ipc'));
const LawBns = lazy(() => import('./pages/laws/Bns'));
const LawItAct = lazy(() => import('./pages/laws/ItAct'));
const LawReporting = lazy(() => import('./pages/laws/Reporting'));
const LawRights = lazy(() => import('./pages/laws/Rights'));
const LawAwareness = lazy(() => import('./pages/laws/Awareness'));
const LawPenalties = lazy(() => import('./pages/laws/Penalties'));
const LawCaseStudy = lazy(() => import('./pages/laws/CaseStudy'));

const Quiz = lazy(() => import('./pages/quiz'));
const Awareness = lazy(() => import('./pages/awareness'));
const AwarenessPhishing = lazy(() => import('./pages/awareness/Phishing'));
const AwarenessUpiFraud = lazy(() => import('./pages/awareness/UpiFraud'));
const AwarenessQrScam = lazy(() => import('./pages/awareness/QrScam'));
const AwarenessSocialMedia = lazy(() => import('./pages/awareness/SocialMedia'));
const AwarenessDeepfake = lazy(() => import('./pages/awareness/Deepfake'));
const AwarenessIdentityTheft = lazy(() => import('./pages/awareness/IdentityTheft'));
const AwarenessPasswordMfa = lazy(() => import('./pages/awareness/PasswordMfa'));

const Reporting = lazy(() => import('./pages/reporting'));

export default function App() {
  return (
    <>
      <ScrollToTop />

      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Full-screen cinematic pages — no MainLayout navbar/footer */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
          <Route path="/dashboard" element={<Navigate to="/awareness" replace />} />

          <Route element={<MainLayout />}>
            <Route path="/analyzer" element={<AnalyzerPage />} />
            <Route path="/ai-scanner" element={<Navigate to="/analyzer" replace />} />
            <Route path="/url-scanner" element={<UrlScannerPage />} />
            <Route path="/threat-feed" element={<ThreatFeedPage />} />
            <Route path="/ip-scanner" element={<IPScannerPage />} />
            <Route path="/breach-checker" element={<BreachCheckerPage />} />
            <Route index element={<HomePage />} />
            <Route path="/learn" element={<Navigate to="/awareness" replace />} />
            <Route path="/awareness-hub" element={<Navigate to="/awareness" replace />} />
            <Route path="/awareness" element={<Awareness />} />
            <Route path="/awareness/phishing" element={<AwarenessPhishing />} />
            <Route path="/awareness/qr" element={<AwarenessQrScam />} />
            <Route path="/awareness/qr-scam" element={<Navigate to="/awareness/qr" replace />} />
            <Route path="/awareness/upi" element={<AwarenessUpiFraud />} />
            <Route path="/awareness/upi-fraud" element={<Navigate to="/awareness/upi" replace />} />
            <Route path="/awareness/identity-theft" element={<AwarenessIdentityTheft />} />
            <Route path="/awareness/identity" element={<Navigate to="/awareness/identity-theft" replace />} />
            <Route path="/awareness/password-mfa" element={<AwarenessPasswordMfa />} />
            <Route path="/awareness/password" element={<Navigate to="/awareness/password-mfa" replace />} />
            <Route path="/awareness/social-media" element={<AwarenessSocialMedia />} />
            <Route path="/awareness/social" element={<Navigate to="/awareness/social-media" replace />} />
            <Route path="/awareness/deepfake" element={<AwarenessDeepfake />} />

            <Route path="/phishing" element={<Phishing />} />

            <Route path="/deepfake-lab" element={<Navigate to="/deepfake" replace />} />
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

            <Route path="/report" element={<Navigate to="/reporting" replace />} />
            <Route path="/reporting" element={<Reporting />} />

            <Route path="/cyber-laws" element={<Navigate to="/laws" replace />} />
            <Route path="/laws" element={<Laws />} />
            <Route path="/laws/dashboard" element={<Navigate to="/laws" replace />} />
            <Route path="/laws/ipc" element={<LawIpc />} />
            <Route path="/laws/bns" element={<LawBns />} />
            <Route path="/laws/it-act" element={<LawItAct />} />
            <Route path="/laws/reporting" element={<LawReporting />} />
            <Route path="/laws/rights" element={<LawRights />} />
            <Route path="/laws/awareness" element={<LawAwareness />} />
            <Route path="/laws/penalties" element={<LawPenalties />} />
            <Route path="/laws/case-study" element={<LawCaseStudy />} />

            <Route path="/challenges" element={<Navigate to="/quiz" replace />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/quiz/play" element={<Quiz />} />
            <Route path="/quiz/challenge" element={<Quiz />} />
            <Route path="/quiz/case-study" element={<Quiz />} />
            <Route path="/quiz/leaderboard" element={<Quiz />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
