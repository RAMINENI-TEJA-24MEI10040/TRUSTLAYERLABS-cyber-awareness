import AwarenessCard from '../../components/awareness/AwarenessCard';
import TopicLayout from '../../components/awareness/TopicLayout';

export default function SocialMedia() {
  return (
    <TopicLayout icon="📱" title="Social Media Scams" accentColor="#60a5fa"
      subtitle="Fake profiles, lottery fraud, romance scams, and investment traps are rampant across WhatsApp, Instagram, and Telegram.">
      <AwarenessCard title="⚠️ Common Social Media Scams" color="red" items={[
        "Fake profiles impersonating friends/family asking for urgent money transfers",
        "Lottery/prize scams: 'You've won ₹10 lakh! Click here to claim'",
        "Fake job offers on LinkedIn/WhatsApp asking for registration or training fees",
        "Romance scams — building fake relationships over weeks to extract money",
        "Investment scams in WhatsApp/Telegram groups promising 30–40% daily returns",
        "Fake government scheme links shared via WhatsApp forwards",
      ]} />
      <AwarenessCard title="✅ How to Stay Safe" color="green" items={[
        "Verify friend requests — check mutual friends and profile creation date",
        "Never send money based on a social media message alone — call the person directly",
        "Enable privacy settings: limit who can see your posts and contact info",
        "Do not join unknown investment groups on WhatsApp or Telegram",
        "Report fake profiles directly on the platform and to cybercrime.gov.in",
        "Think before you share — fake news spreads fast and can harm others",
      ]} />
      <AwarenessCard title="🇮🇳 Indian Context" color="cyan" items={[
        "WhatsApp is the #1 platform for scam forwards in India",
        "Fake PM/CM scheme links are widely circulated to steal Aadhaar details",
        "IT Act Section 66D covers cheating by impersonation online — up to 3 years",
        "Report to cybercrime.gov.in | Helpline: 1930",
      ]} />
    </TopicLayout>
  );
}
