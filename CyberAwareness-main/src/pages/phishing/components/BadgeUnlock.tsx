import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { Badge } from "../data";

export default function BadgeUnlock({ badge, onClose }: { badge: Badge | null; onClose: () => void }) {
  const { t } = useTranslation();
  if (!badge) return null;
  const Icon = badge.Icon;
  return (
    <AnimatePresence>
      <motion.div className="ph-badge-toast" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} onClick={onClose}>
        <Icon size={22} />
        <div>
          <strong>{t("phishing.badge.unlocked", "Badge unlocked")}</strong>
          <span>{t(`phishing.badges.${badge.id}.title`, badge.title)}</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
