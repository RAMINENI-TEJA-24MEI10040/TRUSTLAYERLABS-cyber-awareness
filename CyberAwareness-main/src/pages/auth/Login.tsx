import { useState } from "react";

import {
  signInWithEmailAndPassword,
} from "firebase/auth";

import {
  Shield,
  Lock,
  Mail,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import { useTranslation } from "react-i18next";

import { auth } from "../../firebase/config";

export default function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const login = async () => {
    try {
      setLoading(true);

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      navigate("/admin");

    } catch (error) {
      console.error(error);

      alert(t('auth.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white px-4">

      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10">

          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-5">

            <Shield className="w-8 h-8 text-cyan-400" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold">
            {t('auth.loginTitle')}
          </h1>

          <p className="text-zinc-400 mt-3 text-sm sm:text-base">
            {t('auth.loginDescription')}
          </p>
        </div>

        {/* Email */}
        <div className="mb-5">

          <label className="text-sm text-zinc-400 mb-2 block">
            {t('auth.emailLabel')}
          </label>

          <div className="relative">

            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />

            <input
              type="email"
              placeholder={t('auth.emailPlaceholder')}
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full bg-black border border-zinc-700 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-cyan-500 transition-all text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-8">

          <label className="text-sm text-zinc-400 mb-2 block">
            {t('auth.passwordLabel')}
          </label>

          <div className="relative">

            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />

            <input
              type="password"
              placeholder={t('auth.passwordPlaceholder')}
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full bg-black border border-zinc-700 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-cyan-500 transition-all text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Button */}
        <button
          onClick={login}
          disabled={loading}
          className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-black font-bold py-4 rounded-2xl transition-all text-base sm:text-lg"
        >
          {loading
            ? t('auth.loggingIn')
            : t('auth.loginBtn')}
        </button>

        {/* Footer */}
        <p className="text-center text-zinc-500 text-sm mt-6">
          {t('auth.loginFooter')}
        </p>
      </div>
    </div>
  );
}