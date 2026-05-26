import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  children,
  onClick,
  className = "",
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  const baseStyles =
    "relative inline-flex items-center justify-center gap-2 font-bold rounded-xl overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 hover:shadow-2xl hover:shadow-cyan-500/50 group",

    secondary:
      "bg-slate-900/80 backdrop-blur-sm border border-cyan-500/30 text-cyan-400 hover:border-cyan-400/50 hover:bg-slate-800/80",

    ghost:
      "text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/10",

    danger:
      "bg-gradient-to-r from-red-500 to-rose-500 text-white hover:shadow-2xl hover:shadow-red-500/50",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
    >
      {variant === "primary" && (
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}

      {Icon && iconPosition === "left" && (
        <Icon className="relative z-10 w-5 h-5" />
      )}

      <span className="relative z-10">{children}</span>

      {Icon && iconPosition === "right" && (
        <Icon className="relative z-10 w-5 h-5" />
      )}
    </motion.button>
  );
}