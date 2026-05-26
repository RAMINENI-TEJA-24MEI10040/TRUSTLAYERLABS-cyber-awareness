import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  gradient?: string;
}

export default function Card({
  children,
  className = "",
  hover = true,
  glow = false,
  gradient = "from-cyan-500/20 to-emerald-500/20",
}: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : undefined}
      className={`relative p-6 rounded-2xl bg-slate-900/50 backdrop-blur-sm border border-cyan-500/20 transition-all duration-300 ${
        hover
          ? "hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-500/20"
          : ""
      } ${className}`}
    >
      {hover && (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none`}
        />
      )}

      {glow && (
        <div className="absolute -inset-1 bg-gradient-to-br from-cyan-500 to-emerald-500 opacity-20 blur-xl pointer-events-none" />
      )}

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}