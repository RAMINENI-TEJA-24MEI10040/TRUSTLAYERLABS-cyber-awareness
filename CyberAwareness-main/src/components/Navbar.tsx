import { useEffect, useRef, useState } from "react";

import { Link } from "react-router-dom";

import {
  Shield,
  Menu,
  X,
  Bot,
  ChevronDown,
  Check,
  Languages,
  Sun,
  Moon,
} from "lucide-react";

import { useTranslation } from "react-i18next";

import { useAssistant } from "../ai-assistant/assistantStore";
import { useTheme } from "../ai-assistant/ThemeContext";

export default function Navbar() {
  const [open, setOpen] =
    useState(false);

  const [learningOpen, setLearningOpen] =
    useState(false);

  const [languageOpen, setLanguageOpen] =
    useState(false);

  const [mobileLanguageOpen, setMobileLanguageOpen] =
    useState(false);

  const { openAssistant } =
    useAssistant();

  const { theme, setTheme } =
    useTheme();

  const { t, i18n } =
    useTranslation();

  const desktopLanguageRef =
    useRef<HTMLDivElement | null>(null);

  const mobileLanguageRef =
    useRef<HTMLDivElement | null>(null);

  const languageOptions = [
    {
      code: "en",
      label: "English",
      nativeLabel: "EN",
    },
    {
      code: "as",
      label: "Assamese",
      nativeLabel: "অসমীয়া",
    },
    {
      code: "bn",
      label: "Bengali",
      nativeLabel: "বাংলা",
    },
    {
      code: "brx",
      label: "Bodo",
      nativeLabel: "बर'",
    },
    {
      code: "doi",
      label: "Dogri",
      nativeLabel: "डोगरी",
    },
    {
      code: "gu",
      label: "Gujarati",
      nativeLabel: "ગુજરાતી",
    },
    {
      code: "hi",
      label: "Hindi",
      nativeLabel: "हिन्दी",
    },
    {
      code: "kn",
      label: "Kannada",
      nativeLabel: "ಕನ್ನಡ",
    },
    {
      code: "ks",
      label: "Kashmiri",
      nativeLabel: "कॉशुर",
    },
    {
      code: "kok",
      label: "Konkani",
      nativeLabel: "कोंकणी",
    },
    {
      code: "mai",
      label: "Maithili",
      nativeLabel: "मैथिली",
    },
    {
      code: "ml",
      label: "Malayalam",
      nativeLabel: "മലയാളം",
    },
    {
      code: "mni",
      label: "Manipuri",
      nativeLabel: "ꯃꯤꯇꯩ",
    },
    {
      code: "mr",
      label: "Marathi",
      nativeLabel: "मराठी",
    },
    {
      code: "or",
      label: "Odia",
      nativeLabel: "ଓଡ଼ିଆ",
    },
    {
      code: "pa",
      label: "Punjabi",
      nativeLabel: "ਪੰਜਾਬੀ",
    },
    {
      code: "sa",
      label: "Sanskrit",
      nativeLabel: "संस्कृतम्",
    },
    {
      code: "sat",
      label: "Santali",
      nativeLabel: "ᱥᱟᱱᱛᱟᱲᱤ",
    },
    {
      code: "sd",
      label: "Sindhi",
      nativeLabel: "سنڌي",
    },
    {
      code: "ta",
      label: "Tamil",
      nativeLabel: "தமிழ்",
    },
    {
      code: "te",
      label: "Telugu",
      nativeLabel: "తెలుగు",
    },
    {
      code: "ur",
      label: "Urdu",
      nativeLabel: "اردو",
    },
  ];

  const currentLanguageCode =
    (i18n.resolvedLanguage || i18n.language || "en")
      .split("-")[0]
      .toLowerCase();

  const currentLanguage =
    languageOptions.find(
      (language) =>
        language.code === currentLanguageCode,
    ) || languageOptions[0];

  const navLinks = [
      {
        label: t("navbar.awareness"),
        to: "/awareness",
      },

      {
        label: t("navbar.cyberLaws"),
        to: "/laws",
      },

      {
        label: "Scam Library",
        to: "/scam-library",
      },

      {
        label: t("navbar.report"),
        to: "/reporting",
      },

      {
        label: "Threat Feed",
        to: "/threat-feed",
      },

      {
        label: "URL Scanner",
        to: "/url-scanner",
      },

      {
        label: "IP Scanner",
        to: "/ip-scanner",
      },

      {
        label: "Breach Checker",
        to: "/breach-checker",
      },
    ];

  const learningLinks = [
    {
      to: "/deepfake/awareness",
      label: t("navbar.deepfakeAwareness"),
    },
    {
      to: "/awareness/phishing",
      label: t("navbar.phishingProtection"),
    },
    {
      to: "/awareness/qr-scam",
      label: t("navbar.qrScamSafety"),
    },
    {
      to: "/upi",
      label: t("navbar.upiFraud"),
    },
    {
      to: "/awareness/social-media",
      label: t("navbar.socialMediaSafety"),
    },
    {
      to: "/awareness/password-mfa",
      label: t("navbar.passwordMfa"),
    },
  ];

  useEffect(() => {
    if (open) {
      document.body.style.overflow =
        "hidden";
    } else {
      document.body.style.overflow =
        "auto";
    }

    return () => {
      document.body.style.overflow =
        "auto";
    };
  }, [open]);

  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent,
    ) => {
      const target =
        event.target as Node;

      if (
        desktopLanguageRef.current &&
        !desktopLanguageRef.current.contains(
          target,
        )
      ) {
        setLanguageOpen(false);
      }

      if (
        mobileLanguageRef.current &&
        !mobileLanguageRef.current.contains(
          target,
        )
      ) {
        setMobileLanguageOpen(false);
      }
    };

    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setLanguageOpen(false);
        setMobileLanguageOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );
    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-white/60 dark:bg-slate-950/80 border-b border-gray-200/60 dark:border-gray-800 transition-colors duration-300">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
          >
            <div className="relative">

              <Shield
                className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 transition-colors"
                strokeWidth={2}
              />

              <div className="absolute inset-0 blur-sm bg-cyan-400/30 rounded-full group-hover:bg-cyan-300/40 transition-all" />
            </div>

            <span className="font-bold text-lg tracking-tight text-cyan-400">
              Cybershield
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">

            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-cyan-400 transition-colors relative group px-1 py-1 focus-visible:ring-2 focus-visible:ring-cyan-400/30 rounded"
              >
                {link.label}

                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}

            {/* Learning Dropdown */}
            <div
              className="relative flex items-center h-full"
              onMouseEnter={() =>
                setLearningOpen(true)
              }
              onMouseLeave={() =>
                setLearningOpen(false)
              }
            >
              <button className="flex items-center gap-1 h-16 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-cyan-400 transition-colors">

                {t("navbar.learning")}

                <ChevronDown className="w-4 h-4" />
              </button>

              {learningOpen && (
                <div className="absolute top-full left-0 pt-2 w-64 rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-slate-900 shadow-2xl p-3 space-y-1 transition-colors duration-300">

                  {learningLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="block rounded-lg px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-400 transition"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            {/* Theme Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800 dark:bg-gray-700 hover:bg-cyan-500/20 dark:hover:bg-cyan-500/20 text-slate-400 dark:text-gray-400 hover:text-cyan-400 transition-colors duration-300"
                aria-label="Toggle theme"
                title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Language Switch */}
            <div
              ref={desktopLanguageRef}
              className="relative"
            >
              <button
                onClick={() =>
                  setLanguageOpen(
                    !languageOpen,
                  )
                }
                className="flex items-center gap-2 rounded-lg border border-gray-300/80 bg-white/80 px-3 py-2 text-xs font-medium text-gray-700 backdrop-blur-sm transition-colors duration-200 hover:border-cyan-400 hover:text-cyan-500 dark:border-gray-700 dark:bg-slate-900/80 dark:text-gray-300 dark:hover:border-cyan-400 dark:hover:text-cyan-400"
                aria-haspopup="menu"
                aria-expanded={languageOpen}
                aria-label="Language"
              >
                <Languages className="h-4 w-4" />
                <span>{currentLanguage.nativeLabel}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${languageOpen ? "rotate-180" : ""}`} />
              </button>

              {languageOpen && (
                <div className="absolute right-0 z-50 mt-2 w-44 rounded-xl border border-gray-200 bg-white p-1 shadow-xl dark:border-gray-700 dark:bg-slate-900 max-h-56 overflow-y-auto">
                  {languageOptions.map(
                    (language) => {
                      const isActive =
                        language.code ===
                        currentLanguageCode;

                      return (
                        <button
                          key={language.code}
                          onClick={() => {
                            i18n.changeLanguage(
                              language.code,
                            );
                            setLanguageOpen(false);
                          }}
                          className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-cyan-500/10 hover:text-cyan-500 dark:text-gray-300 dark:hover:text-cyan-400"
                        >
                          <span>{language.label}</span>
                          <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            {language.nativeLabel}
                            {isActive && (
                              <Check className="h-3.5 w-3.5 text-cyan-500" />
                            )}
                          </span>
                        </button>
                      );
                    },
                  )}
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-gray-700 dark:text-gray-300 hover:text-cyan-500 focus-visible:ring-4 focus-visible:ring-cyan-400/20 transition-colors z-[60]"
            onClick={() =>
              setOpen(!open)
            }
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? (
              <X className="w-7 h-7" />
            ) : (
              <Menu className="w-7 h-7" />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 bg-black/80 dark:bg-gray-950/95 backdrop-blur-xl md:hidden transition-colors duration-300">

          <div className="flex flex-col h-full pt-24 px-6">

            <div className="space-y-6">

              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="block text-2xl font-semibold text-slate-200 dark:text-gray-200 hover:text-cyan-400 transition"
                  onClick={() =>
                    setOpen(false)
                  }
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Theme Toggle */}
              <div className="pt-2 pb-4 border-t border-slate-700 dark:border-gray-700">
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="flex items-center gap-3 w-full rounded-lg px-4 py-3 bg-slate-800 dark:bg-gray-700 hover:bg-cyan-500/20 dark:hover:bg-cyan-500/20 text-slate-200 dark:text-gray-200 hover:text-cyan-400 transition-colors duration-300 font-medium"
                  title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-5 h-5" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="w-5 h-5" />
                      Dark Mode
                    </>
                  )}
                </button>
              </div>

              {/* Mobile Languages */}
              <div
                ref={mobileLanguageRef}
                className="pt-6"
              >
                <button
                  onClick={() =>
                    setMobileLanguageOpen(
                      !mobileLanguageOpen,
                    )
                  }
                  className="flex w-full items-center justify-between rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-medium text-slate-200 transition-colors hover:border-cyan-400 hover:text-cyan-300 dark:border-gray-700 dark:bg-gray-800"
                  aria-haspopup="menu"
                  aria-expanded={mobileLanguageOpen}
                  aria-label="Language"
                >
                  <span className="flex items-center gap-2">
                    <Languages className="h-4 w-4" />
                    Language: {currentLanguage.label}
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${mobileLanguageOpen ? "rotate-180" : ""}`} />
                </button>

                {mobileLanguageOpen && (
                  <div className="mt-2 space-y-1 rounded-xl border border-slate-700 bg-slate-900 p-2 dark:border-gray-700 dark:bg-gray-900 max-h-56 overflow-y-auto">
                    {languageOptions.map(
                      (language) => {
                        const isActive =
                          language.code ===
                          currentLanguageCode;

                        return (
                          <button
                            key={language.code}
                            onClick={() => {
                              i18n.changeLanguage(
                                language.code,
                              );
                              setMobileLanguageOpen(false);
                            }}
                            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-slate-200 transition-colors hover:bg-cyan-500/10 hover:text-cyan-300"
                          >
                            <span>{language.label}</span>
                            <span className="flex items-center gap-1 text-xs text-slate-400">
                              {language.nativeLabel}
                              {isActive && (
                                <Check className="h-3.5 w-3.5 text-cyan-400" />
                              )}
                            </span>
                          </button>
                        );
                      },
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-auto pb-10">

              <button
                onClick={() => {
                  openAssistant();

                  setOpen(false);
                }}
                className="w-full flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-300 px-6 py-4 text-lg font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-cyan-400/30"
              >
                <Bot className="w-5 h-5" />

                {t("navbar.aiAssistant")}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}