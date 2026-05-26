import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  badge?: string;
  badgeIcon?: LucideIcon;
  title: string;
  subtitle?: string;
  highlight?: string;
  className?: string;
}

export default function SectionHeader({
  badge,
  badgeIcon: BadgeIcon,
  title,
  subtitle,
  highlight,
  className = "",
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`text-center ${className}`}
    >
      {badge && (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-sm mb-6">
          {BadgeIcon && (
            <BadgeIcon className="w-4 h-4 text-cyan-400" />
          )}

          <span className="text-sm font-medium text-cyan-400">
            {badge}
          </span>
        </div>
      )}

      <h2 className="mb-4 text-4xl font-black text-white sm:text-5xl">
        {title}

        {highlight && (
          <span className="block text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text">
            {highlight}
          </span>
        )}
      </h2>

      {subtitle && (
        <p className="max-w-2xl mx-auto text-lg text-slate-400">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}