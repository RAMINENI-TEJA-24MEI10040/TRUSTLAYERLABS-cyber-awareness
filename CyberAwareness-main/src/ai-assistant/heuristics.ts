export type ScamSignal = {
  category: string;
  summary: string;
  score: number; // 0-100
  confidence: number; // 0-1
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  indicators: string[];
  guidance: string[];
  suspiciousUrls: string[];
  threatType: string;
};

const rules: Array<{
  type: string;
  category: string;
  label: string;
  weight: number;
  re: RegExp;
  indicator: string;
  guidance: string[];
}> = [
  {
    type: 'otp-scam',
    category: 'OTP Fraud',
    label: 'OTP or verification code request',
    weight: 25,
    re: /\b(otp|one[- ]time pass(code)?|verification code|m-pin|mpin|cvv|atm pin)\b/i,
    indicator: 'Sensitive OTP or authentication request',
    guidance: ['Never share OTPs or verification codes.', 'Banks and services will not ask for passcodes via chat or SMS.', 'Report unexpected authentication requests.'],
  },
  {
    type: 'urgent-scam',
    category: 'Urgency Scam',
    label: 'Urgent deadline or pressure',
    weight: 20,
    re: /\b(immediate|urgent|act now|verify now|within 24 hours|last chance|limited time|expire|suspend|temporarily locked|blocked)\b/i,
    indicator: 'Urgent pressure or deadline trigger',
    guidance: ['Do not act under pressure.', 'Verify the sender using official channels.', 'Legitimate services do not force instant action via chat.'],
  },
  {
    type: 'bank-impersonation',
    category: 'Bank Impersonation',
    label: 'Bank or financial credential request',
    weight: 18,
    re: /\b(bank|account number|ifsc|upi id|netbanking|banking|customer care|debit card|credit card|statement)\b/i,
    indicator: 'Bank or financial credential request',
    guidance: ['Do not share account or card details in messages.', 'Contact your bank directly through official channels.', 'Avoid replying to unverified banking messages.'],
  },
  {
    type: 'upi-fraud',
    category: 'UPI Fraud',
    label: 'Payment or UPI request',
    weight: 18,
    re: /\b(pay now|request money|collect request|scan to pay|scan this qr|upi collect|send money|refund request)\b/i,
    indicator: 'UPI or payment request language',
    guidance: ['Verify the recipient before approving any payment request.', 'Do not accept collect requests from unknown contacts.', 'Use your own bank or UPI app to confirm the transaction.'],
  },
  {
    type: 'phishing-link',
    category: 'Phishing Link',
    label: 'Suspicious link included',
    weight: 22,
    re: /https?:\/\/[\w-./?=&%#]+/i,
    indicator: 'Suspicious link or URL included',
    guidance: ['Do not click unfamiliar links.', 'Open official websites directly instead of following links.', 'Inspect links for typos and unusual domains.'],
  },
  {
    type: 'qr-scam',
    category: 'QR Scam',
    label: 'QR code or scan request',
    weight: 18,
    re: /\b(qr code|scan the code|scan this code|bharat qr|bhim|scan now)\b/i,
    indicator: 'QR code or scanning prompt',
    guidance: ['Do not scan QR codes from unknown sources.', 'Check who shared the QR code and why.', 'Official payment flows do not use random QR images in unsolicited messages.'],
  },
  {
    type: 'remote-access',
    category: 'Remote Access Scam',
    label: 'Remote access or screen sharing request',
    weight: 23,
    re: /\b(screen share|remote access|anydesk|teamviewer|remote support|remote desktop|join my screen)\b/i,
    indicator: 'Remote access or screen sharing request',
    guidance: ['Do not provide remote access unless you initiated the support session.', 'Disconnect and contact official support directly if asked to share your screen.', 'Avoid installing remote-control tools from unknown senders.'],
  },
  {
    type: 'crypto-scam',
    category: 'Crypto Scam',
    label: 'Crypto wallet, token, or profit offer',
    weight: 24,
    re: /\b(crypto|bitcoin|ethereum|usdt|wallet|seed phrase|private key|airdrop|token|web3|nft|mine|staking|guaranteed returns|double your money|money flipping|pump and dump)\b/i,
    indicator: 'Crypto investment or wallet request',
    guidance: ['Never share a seed phrase or private key.', 'Treat guaranteed crypto profits as a red flag.', 'Use only official exchange apps and verify wallet addresses before any transfer.'],
  },
  {
    type: 'ransomware',
    category: 'Ransomware',
    label: 'Files locked or ransom demand',
    weight: 30,
    re: /\b(ransomware|your files are locked|decrypt key|pay to decrypt|ransom|encrypt(?:ed|ion)? files|restore access|malware locked)\b/i,
    indicator: 'Ransom demand or file lock message',
    guidance: ['Disconnect the device from the network immediately.', 'Do not pay the ransom or click recovery links from the attacker.', 'Preserve the affected device for incident response and recovery.'],
  },
  {
    type: 'sextortion',
    category: 'Sextortion',
    label: 'Explicit-content blackmail',
    weight: 30,
    re: /\b(sextortion|nude|naked|explicit video|intimate video|private photos|blackmail|leak your photos|share the video|send money or I will)\b/i,
    indicator: 'Blackmail using intimate content',
    guidance: ['Do not pay or continue the conversation.', 'Save screenshots and block the sender.', 'Tell a trusted person immediately and report the account and evidence.'],
  },
  {
    type: 'ai-voice-scam',
    category: 'AI Voice Scam',
    label: 'Cloned or deepfake voice call',
    weight: 28,
    re: /\b(ai voice|voice clone|cloned voice|deepfake voice|synthetic voice|audio deepfake|sound like my boss|sound like my family)\b/i,
    indicator: 'Voice-clone or synthetic audio clue',
    guidance: ['Verify the caller through a second channel before sending money or data.', 'Treat urgent money requests by voice as suspicious until verified.', 'Ask a challenge question only the real person would know.'],
  },
  {
    type: 'fake-job-scam',
    category: 'Fake Job Scam',
    label: 'Job offer or hiring fee trap',
    weight: 26,
    re: /\b(job offer|work from home|hiring now|recruiter|interview fee|registration fee|training fee|telegram job|task scam|easy money job|salary too high)\b/i,
    indicator: 'Employment offer or fee request',
    guidance: ['Do not pay any hiring, training, or registration fee.', 'Check the company website, email domain, and official careers page.', 'Be wary of jobs that demand fast decisions or instant onboarding.'],
  },
  {
    type: 'deepfake-scam',
    category: 'Deepfake Scam',
    label: 'Manipulated image, video, or call',
    weight: 28,
    re: /\b(deepfake|fake video|manipulated video|ai video|synthetic media|face swap|edited clip|video call scam|lookalike video)\b/i,
    indicator: 'Manipulated media or synthetic identity',
    guidance: ['Do not trust media alone for identity verification.', 'Check for inconsistencies in lighting, lip-sync, and audio delay.', 'Confirm the person through a known, separate contact method.'],
  },
  {
    type: 'reward-scam',
    category: 'Reward Scam',
    label: 'Prize or lottery claim',
    weight: 16,
    re: /\b(congratulations|you have won|prize|claim your reward|lottery|gift voucher|redeem now)\b/i,
    indicator: 'Prize or reward claim language',
    guidance: ['Do not share personal details to claim rewards.', 'Verify offers with the official brand website.', 'Free prizes should not require an upfront payment.'],
  },
];

const urlPattern = /https?:\/\/[\w-./?=&%#]+/gi;
const suspiciousShortener = /\b(?:bit\.ly|tinyurl\.com|t\.co|cutt\.ly|tiny\.cc|goo\.gl|s\.id|rb\.gy|ow\.ly|lnkd\.in|is\.gd|buff\.ly)\b/i;
const suspiciousTld = /\.(?:xyz|top|club|review|online|info|bid|win|live|pw|country|center|loan|tech|store)\b/i;
const fakeLoginPattern = /\b(?:secure|verify|login|account|support|online|india|confirm|update)(?:[-\w]*?)\.(?:com|in|net|org|online|info|xyz|site|biz|ru|pw|cc)\b/i;

function extractUrls(text: string): string[] {
  return Array.from(text.matchAll(urlPattern), (match) => match[0]);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function detectScam(message: string): ScamSignal | null {
  const normalized = message.trim();
  if (!normalized) return null;

  const indicators: string[] = [];
  const guidanceSet = new Set<string>();
  const categoryScores: Record<string, number> = {};
  const threatScores: Record<string, number> = {};
  let score = 0;

  for (const rule of rules) {
    if (rule.re.test(normalized)) {
      score += rule.weight;
      indicators.push(rule.indicator);
      rule.guidance.forEach((g) => guidanceSet.add(g));
      categoryScores[rule.category] = (categoryScores[rule.category] ?? 0) + rule.weight;
      threatScores[rule.type] = (threatScores[rule.type] ?? 0) + rule.weight;
    }
  }

  const urls = extractUrls(normalized);
  const suspiciousUrls = urls.filter((url) => suspiciousShortener.test(url) || suspiciousTld.test(url) || fakeLoginPattern.test(url));

  if (urls.length > 0) {
    score += 15;
    guidanceSet.add('Do not click suspicious links. Open official apps or websites directly.');
    if (suspiciousUrls.length > 0) {
      score += 20;
      indicators.push('Suspicious or shortened URL detected');
      guidanceSet.add('Shortened and unusual domain links are commonly used in phishing attacks.');
    }
  }

  const urgentMatch = /\b(urgent|immediate|verify now|act now|within 24 hours|last chance|limited time|expire|suspend|blocked)\b/i.test(normalized);
  const authMatch = /\b(otp|verification code|m-pin|mpin|cvv|atm pin|password)\b/i.test(normalized);
  const moneyMatch = /\b(payment|transfer|deposit|collect|refund|pay now|send money|request money|upi|qr code|bank account|ifsc|account number)\b/i.test(normalized);

  if (urgentMatch && !indicators.includes('Urgent pressure or deadline trigger')) {
    score += 14;
    indicators.push('Urgent pressure or deadline trigger');
    guidanceSet.add('Do not respond to urgent demands without verifying the sender.');
  }

  if (authMatch && !indicators.includes('Sensitive OTP or authentication request')) {
    score += 18;
    indicators.push('Sensitive auth or OTP request');
    guidanceSet.add('Never share OTPs, passwords, or PINs with anyone claiming to be support.');
  }

  if (moneyMatch && !indicators.includes('Financial transaction or payment request')) {
    score += 12;
    indicators.push('Financial transaction or payment request');
    guidanceSet.add('Verify any money request with the official provider before sending funds.');
  }

  const hasPhoneTerms = /\b(call|whatsapp|message|sms|phone number)\b/i.test(normalized);
  if (hasPhoneTerms && !indicators.includes('Direct contact request detected')) {
    score += 8;
    indicators.push('Direct contact request detected');
    guidanceSet.add('Avoid calling or texting unknown numbers for verification requests.');
  }

  const totalScore = clamp(score, 0, 100);
  const confidence = clamp(0.25 + totalScore / 180 + indicators.length * 0.03, 0.2, 0.96);
  const category = Object.entries(categoryScores).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'General scam';
  const threatType = Object.entries(threatScores).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'general-scam';
  const summary = indicators.length > 0 ? `Detected ${category} signals` : 'No clear scam signals detected';
  const riskLevel: ScamSignal['riskLevel'] = totalScore >= 75 || threatType === 'ransomware' || threatType === 'sextortion'
    ? 'Critical'
    : totalScore >= 55
      ? 'High'
      : totalScore >= 30
        ? 'Medium'
        : 'Low';

  return {
    category,
    summary,
    score: totalScore,
    confidence,
    riskLevel,
    indicators: Array.from(new Set(indicators)),
    guidance: Array.from(guidanceSet),
    suspiciousUrls,
    threatType,
  };
}

export function ruleBasedReply(message: string) {
  const det = detectScam(message);
  if (!det) return null;
  const lines = [
    `⚠️ Possible scam signal detected: ${det.summary}.`,
    `Scam category: ${det.category}.`,
    `Risk level: ${det.riskLevel}.`,
    `Confidence: ${Math.round(det.confidence * 100)}%.`,
    '',
    'Recommended steps:',
  ];
  det.guidance.forEach((g, i) => lines.push(`${i + 1}. ${g}`));
  if (det.suspiciousUrls.length > 0) {
    lines.push('', `Suspicious links: ${det.suspiciousUrls.join(', ')}`);
  }
  lines.push('', 'If this looks urgent or financial, stop interacting immediately.', 'Call 1930 or report at cybercrime.gov.in');
  return lines.join('\n');
}

export {};
