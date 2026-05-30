import { detectScam } from './heuristics';
import { buildKnowledgeContext, searchKnowledgeBase } from './knowledgeBase';
import { groqChat, GroqMessage } from './groqClient';
import { detectContext, type PageContext } from './contextDetection';
import { buildContextualSystemPrompt } from './contextualPrompts';

type AssistantResult = {
  reply: string;
  sources: ReturnType<typeof searchKnowledgeBase>;
  signal: ReturnType<typeof detectScam>;
};

type ThreatProfile = {
  displayName: string;
  immediateSteps: string[];
  prevention: string[];
  laws: string[];
  reporting: string[];
  emergencyContacts: string[];
};

const THREAT_ALIASES: Record<string, string> = {
  'otp-scam': 'otp-fraud',
  'payment-scam': 'upi-fraud',
  'upi-fraud': 'upi-fraud',
  'bank-impersonation': 'phishing',
  'phishing-link': 'phishing',
  'qr-scam': 'qr-scam',
  'remote-access': 'remote-access-scam',
  'investment-scam': 'crypto-scam',
  'crypto-scam': 'crypto-scam',
  'reward-scam': 'reward-scam',
  'ransomware': 'ransomware',
  'sextortion': 'sextortion',
  'ai-voice-scam': 'ai-voice-scam',
  'fake-job-scam': 'fake-job-scam',
  'deepfake-scam': 'deepfake-scam',
  'general-scam': 'general-scam',
};

const THREAT_PROFILES: Record<string, ThreatProfile> = {
  phishing: {
    displayName: 'Phishing',
    immediateSteps: [
      'Do not click the link or open the attachment.',
      'If you entered credentials, change the password from the official website immediately.',
      'Check recent account activity and log out of unknown sessions.',
    ],
    prevention: [
      'Open websites directly from bookmarks or the official app.',
      'Verify sender names, domains, and spelling before signing in.',
      'Use two-factor authentication that is not delivered through the same channel as the scam.',
    ],
    laws: [
      'Information Technology Act, 2000: Sections 66C and 66D for identity theft and cheating by impersonation.',
      'Bharatiya Nyaya Sanhita: cheating, impersonation, and fraud-related provisions may apply.',
    ],
    reporting: [
      'Preserve the full message, sender ID, URL, and screenshots.',
      'Report the message to the platform and to cybercrime.gov.in.',
      'If credentials were shared, notify the bank, email provider, or account provider right away.',
    ],
    emergencyContacts: ['1930 cyber fraud helpline', '112 emergency number', 'local cyber cell or police station'],
  },
  'otp-fraud': {
    displayName: 'OTP Fraud',
    immediateSteps: [
      'Never share the OTP, PIN, password, or CVV with anyone.',
      'If you already shared a code, block the account or card through the official app or bank helpline.',
      'Review login history, transaction alerts, and linked devices immediately.',
    ],
    prevention: [
      'Treat every OTP as private, even if the caller says they are from support.',
      'Use app-based verification where possible and keep alerts turned on.',
      'Confirm service requests through official numbers only.',
    ],
    laws: [
      'Information Technology Act, 2000: Sections 66C and 66D are commonly used in OTP theft cases.',
      'Bharatiya Nyaya Sanhita: cheating, identity theft, and fraud-related provisions may apply.',
    ],
    reporting: [
      'Save message logs, screenshots, and timestamps.',
      'Report the attempt immediately to your bank or service provider.',
      'Use cybercrime.gov.in and the 1930 helpline if money loss is possible.',
    ],
    emergencyContacts: ['1930 cyber fraud helpline', '112 emergency number', 'bank/card helpline'],
  },
  'upi-fraud': {
    displayName: 'UPI Fraud',
    immediateSteps: [
      'Do not approve collect requests or scan payment requests from unknown contacts.',
      'If you sent money, contact your bank or UPI app support immediately and raise a dispute.',
      'Share the UPI ID, transaction ID, and screenshots with the complaint.',
    ],
    prevention: [
      'Confirm the exact payee name before any UPI transfer.',
      'Never approve a collect request just because the sender says it is urgent.',
      'Use the official app to check status instead of trusting a message screenshot.',
    ],
    laws: [
      'Information Technology Act, 2000: Sections 66C and 66D may apply when credentials or impersonation are involved.',
      'Bharatiya Nyaya Sanhita: cheating, fraud, and theft-related provisions may apply.',
    ],
    reporting: [
      'Report the transaction through your bank or UPI app as soon as possible.',
      'File a complaint on cybercrime.gov.in and call 1930 for financial fraud support.',
      'Keep the UPI reference number, timestamp, and recipient details.',
    ],
    emergencyContacts: ['1930 cyber fraud helpline', '112 emergency number', 'bank or UPI app support'],
  },
  'qr-scam': {
    displayName: 'QR Scam',
    immediateSteps: [
      'Do not scan a QR code sent in an unsolicited message.',
      'If you scanned it and payment details opened, do not confirm the transfer unless you trust the merchant and amount.',
      'Check whether the QR was meant for receiving money or for a collect request disguised as payment.',
    ],
    prevention: [
      'Verify the merchant or sender by an official channel before scanning.',
      'Use only trusted payment apps and confirm the payee name on screen.',
      'Avoid QR images shared through chat when the request is unexpected.',
    ],
    laws: [
      'Information Technology Act, 2000: Sections 66C and 66D may apply when QR messages are used to impersonate a service or steal credentials.',
      'Bharatiya Nyaya Sanhita: cheating and fraud provisions may apply.',
    ],
    reporting: [
      'Save the QR image, message, sender ID, and app screens.',
      'Report the fraud to the payment app and to cybercrime.gov.in.',
      'If money moved, call 1930 immediately.',
    ],
    emergencyContacts: ['1930 cyber fraud helpline', '112 emergency number', 'payment app or bank support'],
  },
  'crypto-scam': {
    displayName: 'Crypto Scam',
    immediateSteps: [
      'Never share your seed phrase or private key.',
      'Do not move money to unlock a reward, withdrawal, or tax claim unless the source is verified.',
      'If a wallet is involved, stop interacting and review connected approvals through the official wallet tool.',
    ],
    prevention: [
      'Use only official exchange apps and verify wallet addresses character by character.',
      'Treat guaranteed returns, airdrops, and “support fee” demands as red flags.',
      'Keep large balances in trusted wallets and enable hardware or app-based security where available.',
    ],
    laws: [
      'Information Technology Act, 2000: Sections 66C and 66D may apply when fake platforms or impersonation are used.',
      'Bharatiya Nyaya Sanhita: cheating, fraud, and criminal breach of trust provisions may apply.',
    ],
    reporting: [
      'Capture the wallet address, transaction hash, exchange name, and chat logs.',
      'Report the fraud to the exchange or platform and file a complaint on cybercrime.gov.in.',
      'If money was transferred from a bank account, call 1930 quickly.',
    ],
    emergencyContacts: ['1930 cyber fraud helpline', '112 emergency number', 'exchange or wallet support'],
  },
  ransomware: {
    displayName: 'Ransomware',
    immediateSteps: [
      'Disconnect the affected device from Wi-Fi, Ethernet, and shared drives immediately.',
      'Do not pay the ransom or follow attacker instructions to restore files.',
      'Preserve the device and any visible ransom note for incident response.',
    ],
    prevention: [
      'Keep offline or immutable backups of important files.',
      'Patch systems quickly and avoid opening unknown attachments.',
      'Limit admin privileges and keep endpoint protection enabled.',
    ],
    laws: [
      'Information Technology Act, 2000: Sections 43, 66, and 66F may be relevant depending on the intrusion.',
      'Bharatiya Nyaya Sanhita: extortion, criminal intimidation, and mischief-related provisions may apply.',
    ],
    reporting: [
      'Isolate the machine and document what changed, when it started, and which files were affected.',
      'Report the incident to your IT/security team and cybercrime.gov.in.',
      'If business operations are affected, contact local police or cyber cell immediately.',
    ],
    emergencyContacts: ['112 emergency number', 'local cyber cell', 'cybercrime.gov.in'],
  },
  sextortion: {
    displayName: 'Sextortion',
    immediateSteps: [
      'Do not pay, negotiate, or send more content.',
      'Save the chat, username, profile link, and any threats before blocking the account.',
      'Tell a trusted adult, friend, or family member right away so you are not handling it alone.',
    ],
    prevention: [
      'Keep intimate content private and limit who can contact or view your profiles.',
      'Never trust a sudden request for a private call or explicit image from a new account.',
      'Use strong privacy settings and separate public and personal profiles where possible.',
    ],
    laws: [
      'Information Technology Act, 2000: Sections 66E, 67, and 67A may apply to privacy and sexually explicit content.',
      'Bharatiya Nyaya Sanhita: extortion, criminal intimidation, and harassment provisions may apply.',
    ],
    reporting: [
      'Preserve evidence and report the account to the platform.',
      'File a complaint on cybercrime.gov.in and contact local cyber police or women’s support services if needed.',
      'If a child is involved or there is immediate danger, call emergency services at once.',
    ],
    emergencyContacts: ['112 emergency number', '1930 if money loss occurred', 'local cyber cell or police'],
  },
  'ai-voice-scam': {
    displayName: 'AI Voice Scam',
    immediateSteps: [
      'Do not send money or share secrets just because the voice sounds familiar.',
      'Call the person back using a saved number or another verified channel.',
      'Ask a challenge question or confirmation detail that a clone would not know.',
    ],
    prevention: [
      'Treat urgent voice requests for money, OTPs, or credentials as suspicious until verified.',
      'Use call-back verification for bosses, relatives, and support agents.',
      'Warn family and coworkers that voice cloning can copy accents and tone.',
    ],
    laws: [
      'Information Technology Act, 2000: Sections 66C and 66D may apply when identity and impersonation are used.',
      'Bharatiya Nyaya Sanhita: cheating, impersonation, and fraud provisions may apply.',
    ],
    reporting: [
      'Record the number, voicemail, and message transcript if possible.',
      'Report impersonation attempts to the platform, employer, or bank involved.',
      'If money or account access was at risk, file a complaint on cybercrime.gov.in.',
    ],
    emergencyContacts: ['1930 cyber fraud helpline', '112 emergency number', 'local cyber cell'],
  },
  'fake-job-scam': {
    displayName: 'Fake Job Scam',
    immediateSteps: [
      'Do not pay registration, training, or verification fees.',
      'Stop sharing ID documents, bank details, or OTPs with the recruiter.',
      'Check whether the company has a real careers page and public contact details.',
    ],
    prevention: [
      'Verify the recruiter, company domain, and official job listing before applying.',
      'Be cautious of jobs promising easy money, instant hiring, or chat-only interviews.',
      'Never move communication to a private app before confirming the employer is real.',
    ],
    laws: [
      'Information Technology Act, 2000: Sections 66C and 66D may apply when identity theft or impersonation is used.',
      'Bharatiya Nyaya Sanhita: cheating, fraud, and forgery-related provisions may apply.',
    ],
    reporting: [
      'Save the job post, recruiter profile, email domain, and payment request.',
      'Report the listing to the platform and to cybercrime.gov.in.',
      'If documents or money were already shared, contact the bank and affected services immediately.',
    ],
    emergencyContacts: ['1930 cyber fraud helpline', '112 emergency number', 'local cyber cell or police'],
  },
  'deepfake-scam': {
    displayName: 'Deepfake Scam',
    immediateSteps: [
      'Do not trust a video, image, or voice note without checking it through a separate channel.',
      'Pause any payment or disclosure request until you confirm the real person is involved.',
      'Capture the media, username, and platform link before deleting or blocking it.',
    ],
    prevention: [
      'Verify suspicious media by calling the person back or using a known contact method.',
      'Watch for lip-sync errors, odd lighting, and mismatched audio when reviewing clips.',
      'Keep privacy settings tight and assume any urgent media request could be synthetic.',
    ],
    laws: [
      'Information Technology Act, 2000: Sections 66D, 66E, 67, and 67A may be relevant depending on the abuse.',
      'Bharatiya Nyaya Sanhita: cheating, impersonation, extortion, and defamation-related provisions may apply.',
    ],
    reporting: [
      'Keep the file, post link, and account details as evidence.',
      'Report the deepfake to the platform and to cybercrime.gov.in.',
      'If it is being used to extort or blackmail, contact police/cyber cell immediately.',
    ],
    emergencyContacts: ['112 emergency number', '1930 if financial loss occurred', 'local cyber cell'],
  },
  'remote-access-scam': {
    displayName: 'Remote Access Scam',
    immediateSteps: [
      'Do not install remote-control tools or share your screen with unknown contacts.',
      'If you already allowed access, disconnect the session and change important passwords from a safe device.',
      'Review recent logins and banking activity for unusual actions.',
    ],
    prevention: [
      'Only start remote support from an official support page or known vendor.',
      'Never give screen control to a stranger who contacted you first.',
      'Keep sensitive apps closed when sharing your screen for legitimate reasons.',
    ],
    laws: [
      'Information Technology Act, 2000: Sections 43, 66, 66C, and 66D may apply.',
      'Bharatiya Nyaya Sanhita: cheating, intrusion, and fraud-related provisions may apply.',
    ],
    reporting: [
      'Uninstall the remote tool if it was installed under pressure and document what happened.',
      'Report the incident to the company, bank, or platform that was impersonated.',
      'Use cybercrime.gov.in if any account or money risk is involved.',
    ],
    emergencyContacts: ['1930 cyber fraud helpline', '112 emergency number', 'local cyber cell'],
  },
  'reward-scam': {
    displayName: 'Prize Scam',
    immediateSteps: [
      'Do not pay any fee to claim the prize.',
      'Avoid sharing personal documents or banking details with the sender.',
      'Verify the offer through the official brand website before responding.',
    ],
    prevention: [
      'Treat unexpected winnings, vouchers, and lottery claims as suspicious until proven real.',
      'Search the brand’s official channels before clicking or replying.',
      'Free prizes should not require urgent payment or secrecy.',
    ],
    laws: [
      'Information Technology Act, 2000: Section 66D may apply when impersonation or fake offers are used.',
      'Bharatiya Nyaya Sanhita: cheating and fraud provisions may apply.',
    ],
    reporting: [
      'Save the message, sender ID, and any payment request.',
      'Report the claim to the brand and to cybercrime.gov.in.',
      'If money was sent, call 1930 immediately.',
    ],
    emergencyContacts: ['1930 cyber fraud helpline', '112 emergency number', 'brand support or local cyber cell'],
  },
  'general-scam': {
    displayName: 'General Scam',
    immediateSteps: [
      'Stop interacting until the sender is verified.',
      'Do not share codes, passwords, card data, or OTPs.',
      'Save the evidence in case you need to report it.',
    ],
    prevention: [
      'Use official apps and websites instead of links in messages.',
      'Confirm urgent requests with the source through a known channel.',
      'Be suspicious of pressure, secrecy, or rewards that feel too good to be true.',
    ],
    laws: [
      'Information Technology Act, 2000: Sections 66C and 66D are common cyber-fraud provisions.',
      'Bharatiya Nyaya Sanhita: cheating, impersonation, and fraud-related provisions may apply.',
    ],
    reporting: [
      'File a complaint with cybercrime.gov.in and keep screenshots, numbers, and transaction IDs.',
      'Contact the relevant app, bank, or platform support immediately if money or credentials are involved.',
      'Call 1930 for financial fraud support.',
    ],
    emergencyContacts: ['1930 cyber fraud helpline', '112 emergency number', 'local cyber cell'],
  },
};

function getContextFromPage(): PageContext {
  if (typeof window !== 'undefined') {
    return detectContext(window.location.pathname);
  }
  return { type: 'general', path: '/' };
}

function getKnowledgeRoute(context: PageContext): string {
  switch (context.type) {
    case 'phishing':
      return '/phishing';
    case 'qr-scam':
      return '/qr';
    case 'deepfake':
      return '/deepfake';
    case 'cyber-law':
      return '/laws';
    case 'reporting':
      return '/reporting';
    case 'awareness':
      return '/awareness';
    default:
      return 'general';
  }
}

function mapThreatType(threatType: string | undefined, signalCategory: string | undefined) {
  const normalized = threatType ? THREAT_ALIASES[threatType] ?? threatType : 'general-scam';
  if (normalized !== 'general-scam') return normalized;

  const category = signalCategory?.toLowerCase() ?? '';
  if (category.includes('phishing')) return 'phishing';
  if (category.includes('otp')) return 'otp-fraud';
  if (category.includes('upi')) return 'upi-fraud';
  if (category.includes('qr')) return 'qr-scam';
  if (category.includes('crypto')) return 'crypto-scam';
  if (category.includes('ransom')) return 'ransomware';
  if (category.includes('sextortion')) return 'sextortion';
  if (category.includes('voice')) return 'ai-voice-scam';
  if (category.includes('job')) return 'fake-job-scam';
  if (category.includes('deepfake')) return 'deepfake-scam';
  return 'general-scam';
}

function getThreatProfile(signal: ReturnType<typeof detectScam>, query: string): ThreatProfile {
  const mappedThreat = mapThreatType(signal?.threatType, signal?.category);
  if (THREAT_PROFILES[mappedThreat]) return THREAT_PROFILES[mappedThreat];

  const lowerQuery = query.toLowerCase();
  if (lowerQuery.includes('otp')) return THREAT_PROFILES['otp-fraud'];
  if (lowerQuery.includes('upi') || lowerQuery.includes('collect')) return THREAT_PROFILES['upi-fraud'];
  if (lowerQuery.includes('crypto') || lowerQuery.includes('wallet')) return THREAT_PROFILES['crypto-scam'];
  if (lowerQuery.includes('ransom')) return THREAT_PROFILES['ransomware'];
  if (lowerQuery.includes('sextortion')) return THREAT_PROFILES['sextortion'];
  if (lowerQuery.includes('voice')) return THREAT_PROFILES['ai-voice-scam'];
  if (lowerQuery.includes('job')) return THREAT_PROFILES['fake-job-scam'];
  if (lowerQuery.includes('deepfake')) return THREAT_PROFILES['deepfake-scam'];
  return THREAT_PROFILES['general-scam'];
}

function uniqueLines(lines: string[]) {
  return Array.from(new Set(lines.map((line) => line.trim()).filter(Boolean)));
}

function buildExplanationPrompt(query: string, context: PageContext, signal: ReturnType<typeof detectScam>, sources: ReturnType<typeof searchKnowledgeBase>) {
  const knowledgeRoute = getKnowledgeRoute(context);
  const knowledgeContext = buildKnowledgeContext(query, knowledgeRoute);
  const sourceSnippet = sources.length > 0
    ? sources.map((source) => `- ${source.title}: ${source.text}`).join('\n')
    : 'No direct local source match was found.';

  return [
    `Threat type: ${signal?.category ?? 'Unknown'}`,
    `Risk level: ${signal?.riskLevel ?? 'Medium'}`,
    `Indicators: ${signal?.indicators?.length ? signal.indicators.join(', ') : 'none detected'}`,
    `Suspicious URLs: ${signal?.suspiciousUrls?.length ? signal.suspiciousUrls.join(', ') : 'none'}`,
    `Local knowledge: ${knowledgeContext}`,
    `Source snippets:\n${sourceSnippet}`,
    'Write 2-3 short sentences for the Scam Explanation section only.',
    'Be specific, practical, and non-generic. Mention the likely scam mechanism and why it is dangerous.',
    'Do not mention policies, do not mention you are an AI, and do not repeat the other sections.',
  ].join('\n\n');
}

async function buildScamExplanation(query: string, context: PageContext, signal: ReturnType<typeof detectScam>, sources: ReturnType<typeof searchKnowledgeBase>) {
  const systemPrompt = `${buildContextualSystemPrompt(context.type, context.topic)}\nYou write only the Scam Explanation section of a cyber guidance report. Keep it concise, specific, and grounded in the supplied evidence.`;
  const messages: GroqMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: buildExplanationPrompt(query, context, signal, sources) },
  ];

  try {
    const reply = await groqChat(messages, 0.35);
    return reply.trim();
  } catch {
    return '';
  }
}

function formatSection(title: string, lines: string[]) {
  const content = uniqueLines(lines);
  if (content.length === 0) return `${title}: Not enough evidence yet.`;
  if (content.length === 1) return `${title}: ${content[0]}`;
  return `${title}:\n${content.map((line) => `- ${line}`).join('\n')}`;
}

function composeStructuredReply(
  signal: ReturnType<typeof detectScam>,
  explanation: string,
  profile: ThreatProfile,
) {
  const threatType = profile.displayName;
  const riskLevel = signal?.riskLevel ?? 'Medium';

  const immediateSteps = uniqueLines([
    ...(signal?.guidance ?? []),
    ...profile.immediateSteps,
    signal?.suspiciousUrls?.length ? `Do not open these suspicious links: ${signal.suspiciousUrls.join(', ')}` : '',
  ]);

  const prevention = uniqueLines(profile.prevention);
  const laws = uniqueLines(profile.laws);
  const reporting = uniqueLines([
    ...profile.reporting,
    'Keep screenshots, timestamps, usernames, phone numbers, wallet addresses, and transaction IDs.',
  ]);
  const emergencyContacts = uniqueLines(profile.emergencyContacts);

  return [
    `1. Threat Type: ${threatType}`,
    `2. Risk Level: ${riskLevel}`,
    `3. Scam Explanation: ${explanation || 'This message contains scam indicators, but the exact pattern is not fully clear yet. It still deserves caution and verification.'}`,
    formatSection('4. Immediate Steps', immediateSteps),
    formatSection('5. Prevention', prevention),
    formatSection('6. Applicable Laws', laws),
    formatSection('7. Reporting Guidance', reporting),
    formatSection('8. Emergency Contacts', emergencyContacts),
  ].join('\n\n');
}

async function getAnswer(query: string): Promise<AssistantResult> {
  const context = getContextFromPage();
  const knowledgeRoute = getKnowledgeRoute(context);
  const sources = searchKnowledgeBase(query, knowledgeRoute);
  const signal = detectScam(query);
  const profile = getThreatProfile(signal, query);

  const explanation = await buildScamExplanation(query, context, signal, sources);
  const fallbackExplanation = (() => {
    const sourceText = sources.slice(0, 2).map((hit) => hit.text).join(' ');
    const indicatorText = signal?.indicators?.length ? `I matched these indicators: ${signal.indicators.join(', ')}.` : 'I do not have a strong indicator match yet.';
    const sourceNote = sourceText ? ` Local context also points to: ${sourceText}` : '';
    return `${indicatorText} This looks like a ${profile.displayName.toLowerCase()} pattern.${sourceNote}`;
  })();

  const reply = composeStructuredReply(signal, explanation || fallbackExplanation, profile);

  return { reply, sources, signal };
}

export { getAnswer };
export type { AssistantResult };