import i18n from "i18next";

import { initReactI18next } from "react-i18next";

import en from "./locales/en/translation.json";

import as from "./locales/as/translation.json";

import bn from "./locales/bn/translation.json";

import brx from "./locales/brx/translation.json";

import doi from "./locales/doi/translation.json";

import gu from "./locales/gu/translation.json";

import hi from "./locales/hi/translation.json";

import kn from "./locales/kn/translation.json";

import ks from "./locales/ks/translation.json";

import kok from "./locales/kok/translation.json";

import mai from "./locales/mai/translation.json";

import ml from "./locales/ml/translation.json";

import mni from "./locales/mni/translation.json";

import mr from "./locales/mr/translation.json";

import or from "./locales/or/translation.json";

import pa from "./locales/pa/translation.json";

import sa from "./locales/sa/translation.json";

import sat from "./locales/sat/translation.json";

import sd from "./locales/sd/translation.json";

import ta from "./locales/ta/translation.json";

import te from "./locales/te/translation.json";

import ur from "./locales/ur/translation.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },

    as: {
      translation: as,
    },

    bn: {
      translation: bn,
    },

    brx: {
      translation: brx,
    },

    doi: {
      translation: doi,
    },

    gu: {
      translation: gu,
    },

    hi: {
      translation: hi,
    },

    kn: {
      translation: kn,
    },

    ks: {
      translation: ks,
    },

    kok: {
      translation: kok,
    },

    mai: {
      translation: mai,
    },

    ml: {
      translation: ml,
    },

    mni: {
      translation: mni,
    },

    mr: {
      translation: mr,
    },


    or: {
      translation: or,
    },

    pa: {
      translation: pa,
    },

    sa: {
      translation: sa,
    },

    sat: {
      translation: sat,
    },

    sd: {
      translation: sd,
    },

    ta: {
      translation: ta,
    },

    te: {
      translation: te,
    },

    ur: {
      translation: ur,
    },
  },

  lng: "en",

  fallbackLng: "en",

  supportedLngs: [
    "en",
    "as",
    "bn",
    "brx",
    "doi",
    "gu",
    "hi",
    "kn",
    "ks",
    "kok",
    "mai",
    "ml",
    "mni",
    "mr",
    "ne",
    "or",
    "pa",
    "sa",
    "sat",
    "sd",
    "ta",
    "te",
    "ur",
  ],

  load: "languageOnly",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;