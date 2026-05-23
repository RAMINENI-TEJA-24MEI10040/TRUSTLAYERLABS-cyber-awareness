import { useEffect, useState } from "react";

import {
  onAuthStateChanged,
} from "firebase/auth";

import { Navigate } from "react-router-dom";

import { auth } from "../../firebase/config";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const [user, setUser] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);

        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}