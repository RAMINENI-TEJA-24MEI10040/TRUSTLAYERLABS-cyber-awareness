import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en/translation.json";
import hi from "./locales/hi/translation.json";
import ta from "./locales/ta/translation.json";
import te from "./locales/te/translation.json";
import gu from "./locales/gu/translation.json";
import ur from "./locales/ur/translation.json";
import mr from "./locales/mr/translation.json";
import bn from "./locales/bn/translation.json";
import sd from "./locales/sd/translation.json";
import ml from "./locales/ml/translation.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    hi: {
      translation: hi,
    },
    ta: {
      translation: ta,
    },
    te: {
      translation: te,
    },
    gu: {
      translation: gu,
    },
    ur: {
      translation: ur,
    },
    mr: {
      translation: mr,
    },
    bn: {
      translation: bn,
    },
    sd: {
      translation: sd,
    },
    ml: {
      translation: ml,
    },
  },

  lng: "en",
  fallbackLng: "en",

  supportedLngs: [
    "en",
    "hi",
    "ta",
    "te",
    "gu",
    "ur",
    "mr",
    "bn",
    "sd",
    "ml",
  ],

  load: "languageOnly",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;