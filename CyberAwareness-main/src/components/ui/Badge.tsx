import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  size = "md",
  className = "",
}: BadgeProps) {
  const variantStyles = {
    default: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",

    success: "bg-green-500/10 border-green-500/30 text-green-400",

    warning: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",

    danger: "bg-red-500/10 border-red-500/30 text-red-400",

    info: "bg-blue-500/10 border-blue-500/30 text-blue-400",
  };

  const sizeStyles = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border backdrop-blur-sm font-medium ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
}