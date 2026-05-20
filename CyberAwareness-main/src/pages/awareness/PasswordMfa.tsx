import AwarenessCard from '../../components/awareness/AwarenessCard';
import TopicLayout from '../../components/awareness/TopicLayout';

export default function PasswordMfa() {
  return (
    <TopicLayout icon="🔐" title="Password & MFA Guidance" accentColor="#4ade80"
      subtitle="Weak passwords and missing multi-factor authentication are the #1 cause of account takeovers. Your credentials are your first line of defense.">
      <AwarenessCard title="⚠️ Common Password Mistakes" color="red" items={[
        "Using simple passwords: 123456, password, name+birthdate, or 'iloveyou'",
        "Reusing the same password across multiple accounts",
        "Sharing passwords via WhatsApp, SMS, or email",
        "Not changing default passwords on routers, smart devices, or work accounts",
        "Saving passwords in plain text files, sticky notes, or browser autofill without a master password",
      ]} />
      <AwarenessCard title="✅ Strong Password Guidelines" color="green" items={[
        "Use at least 12 characters with uppercase, lowercase, numbers, and symbols",
        "Use a passphrase: e.g., 'Mango$Rain#2024Delhi' — easy to remember, hard to crack",
        "Use a completely different password for every account",
        "Use a trusted password manager (Bitwarden is free & open-source) to store passwords",
        "Change passwords immediately if a breach is suspected",
        "Check if your email is in a known breach at haveibeenpwned.com",
      ]} />
      <AwarenessCard title="🔑 Multi-Factor Authentication (MFA)" color="teal" items={[
        "MFA adds a second verification step beyond your password — even if stolen, you're protected",
        "Types: OTP via SMS, Authenticator app (Google/Microsoft Authenticator), hardware key (YubiKey)",
        "Authenticator apps are safer than SMS OTP — they resist SIM swap attacks",
        "Enable MFA on: email, banking apps, social media, DigiLocker, and work accounts",
        "Never share your MFA OTP with anyone — no legitimate service will ever ask for it",
      ]} />
      <AwarenessCard title="🇮🇳 Indian Context" color="cyan" items={[
        "RBI mandates 2FA for all online banking and card transactions in India",
        "Enable MFA on DigiLocker, UMANG, and all government portals",
        "Aadhaar-based OTP is a form of MFA — never share it with anyone",
        "Report account takeovers to cybercrime.gov.in | Helpline: 1930",
      ]} />
    </TopicLayout>
  );
}
