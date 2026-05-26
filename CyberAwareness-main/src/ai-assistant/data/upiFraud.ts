import { KnowledgeEntry } from './phishing';

export const upiFraudData: KnowledgeEntry[] = [
  {
    id: 'upi-collect-scam',
    title: 'UPI collect request scams',
    text: 'Scammers send fake UPI collect requests pretending to be friends or businesses. The request shows high amount (e.g., Rs. 10,000). Do NOT approve unknown collect requests. Always verify with the sender first.',
    keywords: ['upi', 'collect', 'request', 'scam', 'verify', 'approval'],
  },
  {
    id: 'upi-fake-refund',
    title: 'Fake refund and reversal scams',
    text: 'Scammers claim a payment "bounced" and send a fake UPI refund link. Clicking it may collect money from YOUR account. Real refunds appear directly in your bank account, not via links.',
    keywords: ['upi', 'refund', 'fake', 'link', 'scam', 'reversal'],
  },
  {
    id: 'upi-remote-access',
    title: 'Remote access UPI fraud',
    text: 'Scammers get remote access to your phone, open UPI app, and make payments. Prevention: Never give remote access (even to "tech support"). Use biometric authentication on your UPI app.',
    keywords: ['upi', 'remote', 'access', 'fraud', 'scam', 'phone'],
  },
  {
    id: 'upi-accidental-payment',
    title: 'Accidental UPI payment exploitation',
    text: "If you send money to wrong UPI ID, contact the recipient's bank immediately. UPI does not reverse automatically. Some scammers ask you to send money \"by mistake\" then refuse to return it.",
    keywords: ['upi', 'accidental', 'wrong', 'payment', 'reverse', 'contact'],
  },
  {
    id: 'upi-pin-protection',
    title: 'Protect your UPI PIN',
    text: 'Never share your UPI PIN with anyone—not even bank staff. Banks NEVER ask for UPI PIN. Do not share OTP or PIN for UPI transactions. Cover the keypad when entering PIN at shops.',
    keywords: ['upi', 'pin', 'protect', 'never', 'share', 'otp'],
  },
  {
    id: 'upi-verification-scam',
    title: 'UPI verification and KYC scams',
    text: 'Scammers send fake "UPI verification" or "KYC update" links claiming your account will be blocked. Clicking links or entering details leads to fraud. Legitimate apps update KYC within the app itself.',
    keywords: ['upi', 'verification', 'kyc', 'update', 'scam', 'blocked'],
  },
];
