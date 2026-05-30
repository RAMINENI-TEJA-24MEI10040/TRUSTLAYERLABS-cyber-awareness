#!/usr/bin/env node
/**
 * scripts/translate-locales.js
 *
 * Auto-generate machine translations for locale files under src/i18n/locales/.
 * Uses '@vitalets/google-translate-api'.
 *
 * Usage:
 *   npm install @vitalets/google-translate-api
 *   node scripts/translate-locales.js
 *
 * Notes:
 * - Some less-common Indian languages may not be supported by the translate provider.
 *   In that case the script will fall back to copying English placeholders.
 * - Review generated translations before publishing.
 */

const fs = require('fs');
const path = require('path');
const { translate } = require('@vitalets/google-translate-api');

const root = path.resolve(__dirname, '..');
const localesDir = path.join(root, 'src', 'i18n', 'locales');
const enFile = path.join(localesDir, 'en', 'translation.json');

const supportedLangMap = {
  as: 'as', // Assamese
  bn: 'bn', // Bengali
  brx: null, // Bodo - unsupported
  doi: null, // Dogri - unsupported
  gu: 'gu', // Gujarati
  hi: 'hi', // Hindi
  kn: 'kn', // Kannada
  ks: null, // Kashmiri - unsupported
  kok: null, // Konkani - unsupported
  mai: 'mai', // Maithili (may be supported)
  ml: 'ml', // Malayalam
  mni: null, // Manipuri - unsupported
  mr: 'mr', // Marathi
  ne: 'ne', // Nepali
  or: 'or', // Odia
  pa: 'pa', // Punjabi
  sa: null, // Sanskrit - unsupported
  sat: null, // Santali - unsupported
  sd: 'sd', // Sindhi (may be supported)
  ta: 'ta', // Tamil
  te: 'te', // Telugu
  ur: 'ur', // Urdu
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, obj) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2), 'utf8');
}

function collectStrings(obj, prefix = '') {
  const entries = [];
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    const pathKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') {
      entries.push({ pathKey, value });
    } else if (typeof value === 'object' && value !== null) {
      entries.push(...collectStrings(value, pathKey));
    }
  }
  return entries;
}

function setByPath(obj, pathKey, val) {
  const parts = pathKey.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (!(p in cur)) cur[p] = {};
    cur = cur[p];
  }
  cur[parts[parts.length - 1]] = val;
}

async function translateLocale(entries, target) {
  const result = {};
  for (let i = 0; i < entries.length; i++) {
    const { pathKey, value } = entries[i];
    try {
      const res = await translate(value, { to: target });
      setByPath(result, pathKey, res.text);
      // small delay to avoid rate-limiting
      await new Promise((r) => setTimeout(r, 120));
    } catch (err) {
      console.error(`translate error for ${pathKey} -> ${target}:`, err.message || err);
      setByPath(result, pathKey, value); // fallback to English
    }
  }
  return result;
}

async function run() {
  if (!fs.existsSync(enFile)) {
    console.error('English translation file not found at', enFile);
    process.exit(1);
  }

  const en = readJson(enFile);
  const entries = collectStrings(en);

  const codes = Object.keys(supportedLangMap);
  for (const code of codes) {
    const googleCode = supportedLangMap[code];
    const outFile = path.join(localesDir, code, 'translation.json');
    console.log(`\nProcessing locale '${code}' -> ${outFile}`);
    if (!googleCode) {
      console.log(`  No translator code for '${code}', copying English placeholders.`);
      writeJson(outFile, en);
      continue;
    }

    try {
      const translated = await translateLocale(entries, googleCode);
      writeJson(outFile, translated);
      console.log(`  Wrote ${outFile}`);
    } catch (err) {
      console.error('  Failed to translate', code, err.message || err);
      writeJson(outFile, en);
      console.log('  Fallback: wrote English placeholders');
    }
  }

  console.log('\nAll locales processed. Review translations before publishing.');
}

run().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
