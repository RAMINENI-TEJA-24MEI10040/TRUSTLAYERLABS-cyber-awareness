import { AnimatePresence, motion } from "framer-motion";
import type { Badge } from "../data";

export default function BadgeUnlock({ badge, onClose }: { badge: Badge | null; onClose: () => void }) {
  if (!badge) return null;
  const Icon = badge.Icon;
  return (
    <AnimatePresence>
      <motion.div className="ph-badge-toast" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} onClick={onClose}>
        <Icon size={22} />
        <div><strong>Badge unlocked</strong><span>{badge.title}</span></div>
      </motion.div>
    </AnimatePresence>
  );
}
