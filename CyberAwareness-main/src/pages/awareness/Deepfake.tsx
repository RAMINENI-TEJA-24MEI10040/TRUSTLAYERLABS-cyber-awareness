import AwarenessCard from '../../components/awareness/AwarenessCard';
import TopicLayout from '../../components/awareness/TopicLayout';

export default function Deepfake() {
  return (
    <TopicLayout icon="🎭" title="Deepfake Awareness" accentColor="#22d3ee"
      subtitle="AI-generated fake videos, images, and audio are being used for blackmail, financial fraud, and political manipulation.">
      <AwarenessCard title="⚠️ How Deepfakes Are Misused" color="red" items={[
        "Fake video calls impersonating a relative in distress to demand emergency money",
        "Non-consensual intimate images (NCII) created to blackmail victims",
        "Fake celebrity endorsements for investment and cryptocurrency scams",
        "Impersonating politicians or officials to spread misinformation",
        "Voice cloning to impersonate family members over phone calls",
      ]} />
      <AwarenessCard title="🔍 How to Spot a Deepfake" color="yellow" items={[
        "Unnatural blinking patterns or stiff, robotic eye movement",
        "Blurry or inconsistent edges around the face, hair, or neck",
        "Lighting on the face doesn't match the background environment",
        "Lip sync is slightly off — audio doesn't perfectly match mouth movement",
        "Skin texture looks unnaturally smooth or waxy",
        "Use tools like Microsoft Video Authenticator or Deepware Scanner to verify",
      ]} />
      <AwarenessCard title="✅ How to Stay Safe" color="green" items={[
        "Verify unexpected video/audio messages by calling the person on a known number",
        "Limit public photos and videos on social media to reduce misuse potential",
        "If targeted with deepfake content, report to cybercrime.gov.in immediately",
        "Do not share or spread unverified viral videos — you may be spreading fake content",
      ]} />
      <AwarenessCard title="🇮🇳 Indian Legal Context" color="cyan" items={[
        "IT Act Section 66E: Violation of privacy — up to 3 years imprisonment + fine",
        "IT Act Section 67: Publishing obscene material — up to 5 years imprisonment",
        "BNS Section 356: Criminal intimidation covers deepfake-based blackmail",
        "Report to cybercrime.gov.in | Helpline: 1930",
      ]} />
    </TopicLayout>
  );
}
