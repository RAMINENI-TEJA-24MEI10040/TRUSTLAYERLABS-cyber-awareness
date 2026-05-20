import AwarenessCard from '../../components/awareness/AwarenessCard';
import TopicLayout from '../../components/awareness/TopicLayout';

export default function IdentityTheft() {
  return (
    <TopicLayout icon="🪪" title="Identity Theft Awareness" accentColor="#f87171"
      subtitle="Criminals steal your Aadhaar, PAN, and personal data to commit fraud, take loans in your name, or impersonate you online.">
      <AwarenessCard title="⚠️ How Identity Theft Happens" color="red" items={[
        "Sharing Aadhaar/PAN photos on WhatsApp or email without masking sensitive digits",
        "Data breaches from apps and websites you've registered on",
        "Phishing websites collecting your KYC documents under fake pretexts",
        "Dumpster diving — discarded bank statements, bills, or printed documents",
        "SIM swap fraud — criminal ports your number to a new SIM to intercept OTPs",
        "Fake KYC calls asking for your Aadhaar OTP to 'verify' your identity",
      ]} />
      <AwarenessCard title="✅ How to Protect Your Identity" color="green" items={[
        "Use masked Aadhaar (last 4 digits visible only) for non-critical verification",
        "Lock your Aadhaar biometrics at myaadhaar.uidai.gov.in when not in use",
        "Never share OTP with anyone — UIDAI and banks never ask for it",
        "Regularly check your CIBIL/credit report for unauthorized loans or accounts",
        "Use unique email addresses for banking vs. social media accounts",
        "Enable SIM lock and port protection with your telecom provider",
      ]} />
      <AwarenessCard title="🇮🇳 Indian Legal Context" color="cyan" items={[
        "IT Act Section 66C: Identity theft — up to 3 years imprisonment + ₹1 lakh fine",
        "IT Act Section 66D: Cheating by impersonation — up to 3 years + ₹1 lakh fine",
        "Aadhaar Act Section 29: Prohibits sharing Aadhaar data without consent",
        "Report to cybercrime.gov.in | Helpline: 1930",
      ]} />
    </TopicLayout>
  );
}
