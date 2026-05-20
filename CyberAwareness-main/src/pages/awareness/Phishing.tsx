import AwarenessCard from '../../components/awareness/AwarenessCard';
import TopicLayout from '../../components/awareness/TopicLayout';

export default function Phishing() {
  return (
    <TopicLayout icon="🎣" title="Phishing Awareness" accentColor="#f87171"
      subtitle="Criminals impersonate trusted entities via email, SMS, or calls to steal your credentials, OTPs, and financial data.">
      <AwarenessCard title="⚠️ Warning Signs" color="red" items={[
        "Urgent messages asking you to 'verify your account immediately'",
        "Sender email domain doesn't match the official website",
        "Links that look similar but are slightly misspelled (e.g., sbi-bank.com)",
        "Requests for OTP, password, or Aadhaar number via email/SMS",
        "Unexpected attachments from unknown or spoofed senders",
      ]} />
      <AwarenessCard title="✅ How to Stay Safe" color="green" items={[
        "Never click links in unsolicited emails or SMS — go directly to the official website",
        "Check the sender's full email address, not just the display name",
        "Banks and government agencies NEVER ask for OTP or password via email/call",
        "Enable spam filters on your email client",
        "Report phishing emails to report.phishing@cert-in.org.in",
      ]} />
      <AwarenessCard title="🇮🇳 Indian Context" color="cyan" items={[
        "Fake IRCTC, SBI, HDFC, and Income Tax refund emails are extremely common",
        "Fake Aadhaar update SMS with malicious links circulate widely",
        "Fake KYC expiry messages from telecom providers (Jio, Airtel, BSNL)",
        "Fake TRAI call threatening to disconnect your number unless you 'verify'",
      ]} />
    </TopicLayout>
  );
}
