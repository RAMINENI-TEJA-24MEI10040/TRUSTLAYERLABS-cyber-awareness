import AwarenessCard from '../../components/awareness/AwarenessCard';
import TopicLayout from '../../components/awareness/TopicLayout';

export default function QrScam() {
  return (
    <TopicLayout icon="📷" title="QR Code Scam Awareness" accentColor="#eab308"
      subtitle="QR codes can be weaponized to silently initiate payments, steal credentials, or redirect you to phishing sites.">
      <AwarenessCard title="⚠️ Common QR Scam Tactics" color="red" items={[
        "Scammer sends a QR code claiming it will 'send you money' — it actually deducts money",
        "Fake QR codes pasted over legitimate ones at shops, petrol pumps, or parking meters",
        "QR codes in emails/SMS leading to phishing websites that steal your login",
        "Fake UPI QR codes on OLX/Facebook Marketplace for 'advance payment'",
        "QR codes in fake job offer letters asking for registration or security fees",
      ]} />
      <AwarenessCard title="✅ How to Stay Safe" color="green" items={[
        "Scanning a QR code to RECEIVE money is not possible — it always initiates a payment",
        "Preview the URL before opening any QR code link on your phone",
        "Physically inspect QR codes at shops — ensure no sticker is pasted over the original",
        "Use your bank's official app to scan QR codes, not third-party scanners",
        "Never scan QR codes sent by strangers online or via WhatsApp",
      ]} />
      <AwarenessCard title="🇮🇳 Indian Context" color="cyan" items={[
        "Bharat QR and UPI QR are widely misused in scams across India",
        "RBI advisory warns against scanning QR codes from unknown sources",
        "Report to cybercrime.gov.in or call 1930 immediately after fraud",
      ]} />
    </TopicLayout>
  );
}
