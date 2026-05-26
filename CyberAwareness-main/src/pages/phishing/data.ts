import type { LucideIcon } from "lucide-react";
import {
  Award,
  BadgeCheck,
  Banknote,
  BrainCircuit,
  Briefcase,
  CheckCircle2,
  CreditCard,
  Eye,
  Gift,
  Globe2,
  KeyRound,
  Link2,
  MailWarning,
  QrCode,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Trophy,
  Truck,
  UserRoundSearch,
  Zap,
} from "lucide-react";

export type ScenarioType = "email" | "sms" | "qr";
export type Difficulty = "easy" | "medium" | "hard";
export type Severity = "low" | "medium" | "high";

export interface PhishingType {
  title: string;
  body: string;
  Icon: LucideIcon;
}

export interface Tip {
  title: string;
  body: string;
  Icon: LucideIcon;
}

export interface ThreatIndicator {
  label: string;
  detail: string;
  severity: Severity;
}

export interface PhishingScenario {
  id: string;
  type: ScenarioType;
  category: string;
  difficulty: Difficulty;
  isPhishing: boolean;
  sender: string;
  senderEmail: string;
  subject: string;
  body: string;
  link?: string;
  attachment?: string;
  indicators: ThreatIndicator[];
  explanation: string;
  lesson: string;
}

export interface Level {
  title: string;
  minScore: number;
  color: string;
  Icon: LucideIcon;
  description: string;
}

export interface Badge {
  id: string;
  title: string;
  requirement: string;
  Icon: LucideIcon;
}

export const typingPhrases = [
  "spot fake domains before they steal credentials",
  "detect QR phishing traps in seconds",
  "stop OTP fraud before money moves",
  "read social engineering like a security analyst",
];

export const phishingTypes: PhishingType[] = [
  { title: "Fake emails", body: "Attackers impersonate banks, cloud tools, delivery firms, and HR teams to steal logins or payment details.", Icon: MailWarning },
  { title: "QR phishing", body: "Malicious QR codes hide the real URL and push users toward fake payment or credential pages.", Icon: QrCode },
  { title: "OTP fraud", body: "Scammers manufacture panic, then ask for OTPs, PINs, or remote access to complete transactions.", Icon: KeyRound },
  { title: "Fake domains", body: "Lookalike domains swap letters, add hyphens, or use odd endings to mimic trusted brands.", Icon: Globe2 },
  { title: "Scam links", body: "Short links and tracking links can mask credential harvesters, malware downloads, or fake forms.", Icon: Link2 },
  { title: "Social engineering", body: "Fear, urgency, authority, greed, and curiosity are used to bypass careful thinking.", Icon: BrainCircuit },
];

export const identifyTips: Tip[] = [
  { title: "Check the sender", body: "Read the exact domain after @. Trusted brands do not use random support domains.", Icon: Eye },
  { title: "Slow down urgency", body: "Deadlines, threats, and account locks are designed to rush your click.", Icon: Siren },
  { title: "Never share secrets", body: "OTPs, PINs, passwords, recovery codes, and CVVs are never requested by support teams.", Icon: ShieldCheck },
  { title: "Open sites directly", body: "Type the official address or use the app instead of clicking message links.", Icon: CheckCircle2 },
];

export const dailyTips = [
  "Hover over links on desktop and long-press previews on mobile before opening.",
  "A small fee request can be a card-skimming trap.",
  "Real refunds usually return to the original payment method automatically.",
  "Do not scan QR codes from random posters, invoices, or vehicle notices.",
  "Verify job offers through the company's official careers portal.",
];

export const phishingScenarios: PhishingScenario[] = [
  {
    id: "bank-lock",
    type: "email",
    category: "Banking",
    difficulty: "easy",
    isPhishing: true,
    sender: "SBI Security Desk",
    senderEmail: "alerts@sbi-secure-verify.net",
    subject: "Account suspended: verify within 24 hours",
    body: "Dear customer, unusual access was detected. Restore access now by confirming account number, ATM PIN, and OTP.",
    link: "https://sbi-secure-verify.net/restore",
    attachment: "Account_Verification.pdf",
    indicators: [
      { label: "Fake domain", detail: "The domain is not the official SBI domain.", severity: "high" },
      { label: "Secret request", detail: "Banks never ask for ATM PINs or OTPs.", severity: "high" },
      { label: "Urgency", detail: "A 24-hour threat pressures quick action.", severity: "medium" },
    ],
    explanation: "This is phishing. The sender uses a lookalike domain and asks for secrets a bank would never request.",
    lesson: "Visit the bank site or app directly and call the official helpline if needed.",
  },
  {
    id: "amazon-refund",
    type: "email",
    category: "Refund",
    difficulty: "easy",
    isPhishing: true,
    sender: "Amazon Refunds",
    senderEmail: "refund@amazon-india-support.com",
    subject: "Refund of Rs. 4,829 pending",
    body: "You were overcharged. Claim your refund by verifying card details before the link expires.",
    link: "https://amazon-refund-india.com/claim",
    indicators: [
      { label: "Lookalike domain", detail: "The message does not come from amazon.in or amazon.com.", severity: "high" },
      { label: "Payment details", detail: "Refunds do not require re-entering card details.", severity: "high" },
    ],
    explanation: "This is a fake refund lure meant to collect payment details.",
    lesson: "Check refunds inside the official shopping app.",
  },
  {
    id: "payroll-safe",
    type: "email",
    category: "Workplace",
    difficulty: "medium",
    isPhishing: false,
    sender: "Payroll Team",
    senderEmail: "payroll@trustlayerlabs.com",
    subject: "April payslip is available",
    body: "Your payslip is available in the employee portal. Open the HR app from your dashboard and sign in with SSO.",
    indicators: [
      { label: "No link pressure", detail: "The message asks you to use the known portal.", severity: "low" },
      { label: "Known domain", detail: "The sender is from the organization domain.", severity: "low" },
    ],
    explanation: "This looks safe. It avoids attachments, urgency, and secret requests.",
    lesson: "Even safe messages should be handled through known portals.",
  },
  {
    id: "qr-parking",
    type: "qr",
    category: "QR Fine",
    difficulty: "hard",
    isPhishing: true,
    sender: "Parking Payment Cell",
    senderEmail: "notice@smart-parking-portal.in",
    subject: "Scan QR to avoid Rs. 2,000 penalty",
    body: "A printed notice says your vehicle has an unpaid fine and asks you to scan a QR code today.",
    link: "https://mcpayment-india.xyz/fine",
    attachment: "QR_Payment_Code.png",
    indicators: [
      { label: "Hidden destination", detail: "QR codes conceal the URL until scanned.", severity: "high" },
      { label: "Odd domain", detail: "Official payments should use verified government portals.", severity: "high" },
      { label: "Penalty pressure", detail: "A sudden large penalty is a fear tactic.", severity: "medium" },
    ],
    explanation: "This is QR phishing. The QR sends victims to a fake payment page.",
    lesson: "Use the official municipal website instead of scanning random notices.",
  },
  {
    id: "otp-call",
    type: "sms",
    category: "OTP Fraud",
    difficulty: "medium",
    isPhishing: true,
    sender: "ICICI Fraud Team",
    senderEmail: "VM-ICICIB",
    subject: "Unauthorized login detected",
    body: "Your account is frozen. Call this security officer and share the OTP sent to your mobile to unblock it.",
    indicators: [
      { label: "OTP request", detail: "No legitimate bank employee needs your OTP.", severity: "high" },
      { label: "Callback trap", detail: "The message pushes you to an unverified phone number.", severity: "high" },
    ],
    explanation: "This is OTP fraud. Sharing the OTP lets the attacker approve transactions.",
    lesson: "Never share OTPs, PINs, or passwords with anyone.",
  },
  {
    id: "delivery-fee",
    type: "sms",
    category: "Delivery",
    difficulty: "hard",
    isPhishing: true,
    sender: "Delhivery Update",
    senderEmail: "tracking@delhivery-parcel.xyz",
    subject: "Package delivery failed",
    body: "Your address is incomplete. Pay Rs. 29 to reschedule delivery within 24 hours.",
    link: "https://delhivery-parcel.xyz/reschedule",
    indicators: [
      { label: "Fake courier domain", detail: "The domain is not the courier's official domain.", severity: "high" },
      { label: "Small fee lure", detail: "Tiny payments are often used to steal full card details.", severity: "high" },
    ],
    explanation: "This is a delivery scam that leads to a fake payment page.",
    lesson: "Track parcels only through the official courier app or website.",
  },
  {
    id: "job-offer",
    type: "email",
    category: "Job Offer",
    difficulty: "medium",
    isPhishing: true,
    sender: "TCS Recruitment",
    senderEmail: "hr@tcs-jobs-india.org",
    subject: "Offer letter: Software Engineer",
    body: "Confirm your Rs. 8.5 LPA offer by paying a refundable security deposit and uploading documents.",
    link: "https://tcs-jobs-india.org/confirm",
    attachment: "Offer_Letter.pdf",
    indicators: [
      { label: "Payment for job", detail: "Legitimate employers do not charge security deposits.", severity: "high" },
      { label: "Fake domain", detail: "The message is not from the company's official domain.", severity: "high" },
    ],
    explanation: "This is a fake job offer designed to steal money and identity documents.",
    lesson: "Verify offers through the official careers site and HR contacts.",
  },
  {
    id: "github-safe",
    type: "email",
    category: "Developer Tools",
    difficulty: "medium",
    isPhishing: false,
    sender: "GitHub",
    senderEmail: "noreply@github.com",
    subject: "New sign-in to your account",
    body: "A new sign-in was detected. If this was you, no action is needed. Review sessions from GitHub settings.",
    indicators: [
      { label: "Official domain", detail: "The sender uses github.com.", severity: "low" },
      { label: "No credential form", detail: "It points users to account settings instead of collecting data.", severity: "low" },
    ],
    explanation: "This appears legitimate because it uses the official domain and does not ask for secrets.",
    lesson: "Security alerts can be real. Navigate to the service directly to verify.",
  },
  {
    id: "crypto-gift",
    type: "email",
    category: "Crypto",
    difficulty: "easy",
    isPhishing: true,
    sender: "Crypto Foundation",
    senderEmail: "giveaway@bitcoin-bonus.live",
    subject: "Send 0.01 BTC and receive 1 BTC",
    body: "A celebrity giveaway will multiply any wallet transfer for the next 30 minutes.",
    link: "https://bitcoin-bonus.live/send",
    indicators: [
      { label: "Impossible reward", detail: "Crypto doubling offers are scams.", severity: "high" },
      { label: "Fake scarcity", detail: "Short countdowns push impulsive transfers.", severity: "medium" },
    ],
    explanation: "This is a crypto giveaway scam. Transfers cannot be reversed.",
    lesson: "Any send-one-get-more crypto offer is fraudulent.",
  },
  {
    id: "scholarship",
    type: "email",
    category: "Scholarship",
    difficulty: "medium",
    isPhishing: true,
    sender: "National Grants Desk",
    senderEmail: "apply@edu-india-grants.com",
    subject: "You are selected for Rs. 75,000 scholarship",
    body: "Submit Aadhaar, marksheets, bank details, and a refundable Rs. 499 processing fee.",
    link: "https://edu-india-grants.com/apply",
    indicators: [
      { label: "Processing fee", detail: "Legitimate scholarships do not demand fees through random links.", severity: "high" },
      { label: "Identity theft", detail: "Aadhaar plus bank details can enable fraud.", severity: "high" },
    ],
    explanation: "This is a scholarship scam collecting money and sensitive identity data.",
    lesson: "Use official education portals and never pay to receive a grant.",
  },
];

export const levels: Level[] = [
  { title: "New Analyst", minScore: 0, color: "slate", Icon: ShieldAlert, description: "Learning the first signs of deception." },
  { title: "Signal Spotter", minScore: 35, color: "sky", Icon: Eye, description: "Catches common sender and link traps." },
  { title: "Cyber Defender", minScore: 65, color: "violet", Icon: ShieldCheck, description: "Strong judgment under pressure." },
  { title: "Threat Hunter", minScore: 85, color: "emerald", Icon: Trophy, description: "Elite phishing detection instincts." },
];

export const badges: Badge[] = [
  { id: "first-catch", title: "First Catch", requirement: "Answer one scenario correctly", Icon: BadgeCheck },
  { id: "streak-3", title: "Hot Streak", requirement: "Reach a 3-answer streak", Icon: Zap },
  { id: "perfect", title: "Perfect Run", requirement: "Finish with 100% accuracy", Icon: Award },
  { id: "banking", title: "Finance Shield", requirement: "Detect banking or payment fraud", Icon: CreditCard },
  { id: "qr", title: "QR Guardian", requirement: "Detect QR phishing", Icon: QrCode },
];

export const categoryIcons: Record<string, LucideIcon> = {
  Banking: Banknote,
  Refund: Gift,
  Workplace: Briefcase,
  "QR Fine": QrCode,
  "OTP Fraud": KeyRound,
  Delivery: Truck,
  "Job Offer": Briefcase,
  "Developer Tools": ShieldCheck,
  Crypto: Zap,
  Scholarship: UserRoundSearch,
};

export const getLevel = (score: number) =>
  [...levels].reverse().find((level) => score >= level.minScore) ?? levels[0];
