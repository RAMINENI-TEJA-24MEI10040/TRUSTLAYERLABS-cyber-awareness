import { KnowledgeEntry } from './phishing';

export const socialEngineeringData: KnowledgeEntry[] = [
  {
    id: 'se-impersonation',
    title: 'Impersonation scams',
    text: 'Scammers call pretending to be bank staff, tech support, tax officials, or police. Real organizations will never call asking for passwords, card details, or OTP. Hang up and call the official number.',
    keywords: ['call', 'impersonation', 'pretend', 'bank', 'official', 'password'],
  },
  {
    id: 'se-trust-building',
    title: 'Trust-building tactics',
    text: 'Scammers use personal details from your social media or public records to sound credible. They build rapport slowly before asking for money. Be skeptical of unsolicited calls and contacts.',
    keywords: ['trust', 'scammer', 'credible', 'money', 'call', 'rapport'],
  },
  {
    id: 'se-job-offer',
    title: 'Fake job offer scams',
    text: "Fraudsters post fake job listings offering high pay with minimal work. They ask for upfront \"training fees\" or \"verification deposits.\" Real jobs don't ask for money before hiring.",
    keywords: ['job', 'offer', 'fee', 'money', 'hiring', 'fake'],
  },
  {
    id: 'se-romance-scam',
    title: 'Romance and relationship scams',
    text: 'Scammers create fake profiles on dating apps, build emotional connection, then ask for money for "travel," "medical," or "business" reasons. Video calls are faked or not done. Verify identity before trusting.',
    keywords: ['romance', 'dating', 'fake', 'profile', 'money', 'travel'],
  },
  {
    id: 'se-authority',
    title: 'False authority and urgency',
    text: 'Scammers claim to be from tax office, police, or government agencies threatening arrest or legal action. They create fear and pressure you to pay quickly. Hang up and verify independently.',
    keywords: ['authority', 'police', 'tax', 'urgency', 'threat', 'pay'],
  },
  {
    id: 'se-verify-before-trust',
    title: 'Always verify caller identity',
    text: "Never trust caller ID (it can be spoofed). Hang up, find the official number online, and call back. Ask for employee ID or reference number and verify in the organization's system independently.",
    keywords: ['verify', 'caller', 'id', 'official', 'number', 'check'],
  }
];
