import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import i18n from '../i18n';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LANGUAGE_MAP: Record<string, { name: string; native: string }> = {
  en: { name: 'English', native: 'English' },
  hi: { name: 'Hindi', native: 'हिन्दी' },
  ta: { name: 'Tamil', native: 'தமிழ்' },
  te: { name: 'Telugu', native: 'తెలుగు' },
  gu: { name: 'Gujarati', native: 'ગુજરાતી' },
  ur: { name: 'Urdu', native: 'اردو' },
  mr: { name: 'Marathi', native: 'मराठी' },
  bn: { name: 'Bengali', native: 'বাংলা' },
  sd: { name: 'Sindhi', native: 'سنڌي' },
  ml: { name: 'Malayalam', native: 'മലയാളം' },
};

export default function LanguageSwitcher() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const supported = (i18n.options.supportedLngs || []).filter(
    (code) => code !== 'cimode' && code in LANGUAGE_MAP
  ) as string[];

  const currentLanguageCode = i18n.language || 'en';
  const currentLanguage = LANGUAGE_MAP[currentLanguageCode] || LANGUAGE_MAP.en;

  // Sync with URL search params if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const lng = params.get('lng');
    if (lng && i18n.language !== lng && supported.includes(lng)) {
      i18n.changeLanguage(lng);
    }
  }, [location.search, supported]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectLanguage = (lng: string) => {
    const params = new URLSearchParams(location.search);
    params.set('lng', lng);
    i18n.changeLanguage(lng);
    navigate({ pathname: location.pathname, search: params.toString() });
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-300 select-none cursor-pointer outline-none bg-slate-950/40 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/60 text-slate-200"
        style={{ fontFamily: "'Rajdhani', sans-serif" }}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={t('nav.languageSelector') || 'Select Language'}
      >
        <Globe className="w-3.5 h-3.5 text-cyan-400" />
        <span className="tracking-wide">
          {currentLanguage.native}
          {currentLanguage.name !== currentLanguage.native && ` (${currentLanguage.name})`}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 ${
            isOpen ? 'rotate-180 text-cyan-400' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-64 rounded-2xl overflow-hidden z-50 origin-top-right border border-cyan-500/20 shadow-2xl backdrop-blur-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(5,12,28,0.95) 0%, rgba(2,6,16,0.98) 100%)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            }}
          >
            {/* Header / Subtitle inside dropdown */}
            <div className="px-4 py-2 text-[10px] font-bold tracking-widest text-cyan-400/60 uppercase border-b border-slate-900">
              // Choose Language
            </div>

            <div className="py-1 max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              {supported.map((code) => {
                const lang = LANGUAGE_MAP[code];
                const isActive = code === currentLanguageCode;
                return (
                  <button
                    key={code}
                    onClick={() => selectLanguage(code)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-xs font-semibold transition-all duration-200 hover:bg-cyan-500/10 group cursor-pointer ${
                      isActive
                        ? 'text-cyan-400 bg-cyan-500/5'
                        : 'text-slate-300 hover:text-white'
                    }`}
                    style={{ fontFamily: "'Rajdhani', sans-serif" }}
                  >
                    <div className="flex flex-col">
                      <span className={`tracking-wide text-sm font-semibold transition-colors duration-200 ${
                        isActive ? 'text-cyan-400' : 'text-slate-200 group-hover:text-cyan-300'
                      }`}>
                        {lang.native}
                      </span>
                      {lang.name !== lang.native && (
                        <span className="text-[10px] text-slate-500 group-hover:text-slate-400 font-normal">
                          {lang.name}
                        </span>
                      )}
                    </div>
                    {isActive && (
                      <Check className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
