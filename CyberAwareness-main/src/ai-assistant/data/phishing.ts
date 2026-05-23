export interface KnowledgeEntry {
  id: string;
  title: string;
  text: string;
  keywords: string[];
}

export const phishingData: KnowledgeEntry[] = [
  {
    id: 'phishing-email-signs',
    title: 'Email phishing red flags',
    text: 'Check sender email domain carefully—scammers use look-alike addresses. Phishing emails often ask you to "verify account" or "confirm password" urgently. Hover over links to see actual URL before clicking.',
    keywords: ['email', 'sender', 'phishing', 'verify', 'password', 'link', 'urgent'],
  },
  {
    id: 'phishing-otp',
    title: 'OTP and verification code scams',
    text: 'Banks NEVER ask for OTP, passwords, or PINs via email/SMS. If someone asks for OTP, hang up and call your bank directly using the number on your card or statement.',
    keywords: ['otp', 'verification', 'code', 'bank', 'sms', 'email'],
  },
  {
    id: 'phishing-fake-login',
    title: 'Fake login page attacks',
    text: 'Scammers create fake login pages for Gmail, banks, or e-commerce sites. Always type the URL directly into your browser, never click email links. Check the padlock icon and "https://" in the address bar.',
    keywords: ['fake', 'login', 'page', 'phishing', 'https', 'url'],
  },
  {
    id: 'phishing-urgent-action',
    title: 'Urgency and threat tactics',
    text: 'Phishing emails use phrases like "urgent action," "confirm now," or "account will close." Real companies give you time. Stop, verify with the official number, and ignore the deadline pressure.',
    keywords: ['urgent', 'action', 'confirm', 'verify', 'threat', 'account'],
  },
  {
    id: 'phishing-attachment',
    title: 'Malicious email attachments',
    text: 'Phishing emails may have attachments (PDF, Excel, Word) that install malware or steal data. Do not open attachments from unknown senders, especially .exe, .bat, or macro-enabled files.',
    keywords: ['attachment', 'malware', 'file', 'pdf', 'excel', 'dangerous'],
  },
  {
    id: 'phishing-what-to-do',
    title: 'What to do if you clicked a phishing link',
    text: "Stop immediately. Change your password, check account activity, and enable 2FA. If it's financial, contact your bank. Report the email to cybercrime.gov.in or your email provider.",
    keywords: ['clicked', 'link', 'password', 'change', 'bank', 'report'],
  }
];
