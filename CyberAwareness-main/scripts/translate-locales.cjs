#!/usr/bin/env node
/**
 * CommonJS version so `node` can run when package.json sets "type": "module".
 */
const fs = require('fs');
const path = require('path');
const { translate } = require('@vitalets/google-translate-api');

const root = path.resolve(__dirname, '..');
const localesDir = path.join(root, 'src', 'i18n', 'locales');
const enFile = path.join(localesDir, 'en', 'translation.json');

const supportedLangMap = {
  as: 'as',
  bn: 'bn',
  brx: null,
  doi: null,
  gu: 'gu',
  hi: 'hi',
  kn: 'kn',
  ks: null,
  kok: null,
  mai: 'mai',
  ml: 'ml',
  mni: null,
  mr: 'mr',
  ne: 'ne',
  or: 'or',
  pa: 'pa',
  sa: null,
  sat: null,
  sd: 'sd',
  ta: 'ta',
  te: 'te',
  ur: 'ur',
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
      await new Promise((r) => setTimeout(r, 120));
    } catch (err) {
      console.error(`translate error for ${pathKey} -> ${target}:`, err.message || err);
      setByPath(result, pathKey, value);
    }
  }
  return result;
}

(async function run() {
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
})();
