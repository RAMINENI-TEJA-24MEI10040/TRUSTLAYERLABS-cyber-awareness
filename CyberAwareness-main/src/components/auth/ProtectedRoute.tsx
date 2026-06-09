import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate, useLocation } from "react-router-dom";
import { auth } from "../../firebase/config";
import { isAdminEmail } from "../../lib/adminAccess";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  if (!auth) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white p-6">
        <div className="max-w-md text-center">
          <h1 className="text-3xl font-bold mb-4">Authentication Not Configured</h1>
          <p className="text-slate-400 mb-6">
            Firebase auth is not set up. Please add the required VITE_FIREBASE_* environment variables and restart the app.
          </p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    // Timeout fallback: if auth doesn't respond in 5 seconds, show error
    const timeoutId = setTimeout(() => {
      if (loading) {
        setError(true);
        setLoading(false);
      }
    }, 5000);

    const unsubscribe = onAuthStateChanged(
      auth!,
      (currentUser) => {
        clearTimeout(timeoutId);
        setUser(currentUser);
        setLoading(false);
      },
      (err) => {
        // Handle Firebase auth errors
        clearTimeout(timeoutId);
        console.error("Auth error:", err);
        setError(true);
        setLoading(false);
      }
    );

    return () => {
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Verifying access...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white flex-col gap-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Authentication Service Unavailable</h1>
          <p className="text-slate-400 mb-6">Please try again in a few moments.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-cyan-500 text-black font-semibold rounded hover:bg-cyan-400 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!isAdminEmail(user.email)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
