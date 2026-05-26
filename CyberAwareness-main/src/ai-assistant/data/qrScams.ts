import { KnowledgeEntry } from './phishing';

export const qrScamsData: KnowledgeEntry[] = [
  {
    id: 'qr-payment-risk',
    title: 'QR codes trigger payment',
    text: "Never assume a QR code is safe just because it's printed. QR codes in public places may redirect to fake payment pages or transmit money instantly. Always verify the source and amount before scanning.",
    keywords: ['qr', 'scan', 'payment', 'code', 'fake', 'transmit'],
  },
  {
    id: 'qr-overlay',
    title: 'Fake QR stickers on real QR codes',
    text: 'Scammers paste their own QR code stickers over legitimate ones (parking meters, ATMs, payment counters). Check for uneven stickers or glue before scanning. If something looks off, ask staff.',
    keywords: ['qr', 'sticker', 'fake', 'overlay', 'atm', 'payment'],
  },
  {
    id: 'qr-phishing',
    title: 'QR phishing links',
    text: 'Scanning a QR code may open a malicious website that looks like your bank or UPI app. Watch for typos in the URL and unencrypted websites. Never enter credentials on pages reached via scanned QR.',
    keywords: ['qr', 'phishing', 'link', 'website', 'bank', 'url'],
  },
  {
    id: 'qr-location',
    title: 'Source and context matter',
    text: "Trust QR codes only from official sources (your bank's app, restaurant receipt, trusted organization). Reject QR codes from strangers, public walls, or suspicious messages.",
    keywords: ['qr', 'source', 'official', 'bank', 'trust', 'verify'],
  },
  {
    id: 'qr-malware',
    title: 'QR codes can install malware',
    text: 'Scanning a malicious QR may auto-download an APK or redirected app that steals data. Always scan QR codes only on phones with updated security software. Consider disabling auto-download for APKs.',
    keywords: ['qr', 'malware', 'apk', 'download', 'security', 'phone'],
  },
  {
    id: 'qr-safe-scanning',
    title: 'Scanning QR safely',
    text: "Use your phone's built-in camera or official UPI app to scan. Check the URL before opening any page. For payments, use official apps (BHIM, Google Pay, PhonePe) not browser redirects.",
    keywords: ['qr', 'scan', 'safe', 'camera', 'app', 'payment'],
  }
];
