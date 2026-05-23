import { KnowledgeEntry } from './phishing';

export const otpFraudData: KnowledgeEntry[] = [
  {
    id: 'otp-never-share',
    title: 'Never share OTP',
    text: 'Your OTP is like your digital signature—never share it with anyone, even if they claim to be from your bank. Banks and apps will NEVER ask for OTP via call, email, or SMS.',
    keywords: ['otp', 'never', 'share', 'bank', 'call', 'sms'],
  },
  {
    id: 'otp-time-limit',
    title: 'OTP has time limit',
    text: "OTP codes expire within 1–10 minutes. If someone asks you to share an OTP they just sent, it's a scam. Hang up immediately and verify by calling your bank.",
    keywords: ['otp', 'time', 'limit', 'expire', 'sent', 'scam'],
  },
  {
    id: 'otp-remote-access',
    title: 'Remote access + OTP scam',
    text: 'Scammers ask for OTP after gaining remote access to your phone. They pretend to be tech support or bank staff. Never give remote access to your phone or computer to strangers.',
    keywords: ['otp', 'remote', 'access', 'phone', 'scam', 'support'],
  },
  {
    id: 'otp-generate',
    title: 'Generating OTP yourself is safer',
    text: 'Apps like Google Authenticator or Microsoft Authenticator generate OTPs on YOUR device—no SMS needed. Use these for banking and email instead of SMS OTP when possible.',
    keywords: ['otp', 'generate', 'app', 'authenticator', 'sms', 'secure'],
  },
  {
    id: 'otp-if-leaked',
    title: 'What to do if OTP is compromised',
    text: 'If scammers used your OTP to access your account, change your password immediately, check transaction history, and call your bank. File a cyber complaint at cybercrime.gov.in.',
    keywords: ['otp', 'compromised', 'leaked', 'password', 'bank', 'complaint'],
  },
];
