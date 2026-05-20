import AwarenessCard from '../../components/awareness/AwarenessCard';
import TopicLayout from '../../components/awareness/TopicLayout';

export default function UpiFraud() {
  return (
    <TopicLayout icon="💸" title="UPI Fraud Awareness" accentColor="#f97316"
      subtitle="Scammers exploit India's UPI payment system by tricking victims into approving collect requests or sharing PINs.">
      <AwarenessCard title="⚠️ Common UPI Scam Types" color="red" items={[
        "Fake 'collect request' — scammer sends a request disguised as a refund or prize",
        "Screen mirroring apps (AnyDesk, TeamViewer) used to watch and steal your UPI PIN",
        "Fake customer care numbers on Google for banks and UPI apps",
        "OLX/Quikr scams — fake buyers send collect requests instead of paying you",
        "Lottery/prize scams asking you to 'pay a small fee' via UPI to claim winnings",
      ]} />
      <AwarenessCard title="✅ How to Stay Safe" color="green" items={[
        "ENTERING your UPI PIN means you are PAYING — never enter PIN to 'receive' money",
        "Never share your UPI PIN, OTP, or QR code with anyone, ever",
        "Do not install screen-sharing apps at anyone's request",
        "Verify customer care numbers only from the official bank website or app",
        "Set a daily UPI transaction limit in your banking app settings",
      ]} />
      <AwarenessCard title="🇮🇳 Indian Context" color="cyan" items={[
        "NPCI regulates UPI — report fraud at npci.org.in",
        "File complaint at cybercrime.gov.in or call 1930 within the golden hour",
        "Freeze your account immediately via your bank's helpline if defrauded",
        "Keep UPI app notifications ON to detect unauthorized transactions instantly",
      ]} />
    </TopicLayout>
  );
}
