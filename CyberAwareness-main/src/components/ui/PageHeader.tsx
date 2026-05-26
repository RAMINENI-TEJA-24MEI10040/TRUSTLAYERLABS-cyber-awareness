import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  children?: ReactNode;
}

export default function PageHeader({
  title,
  description,
  icon: Icon,
  children,
}: PageHeaderProps) {
  return (
    <div className="relative py-16 border-b border-cyan-500/20">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-emerald-500/5" />

      <div className="relative max-w-7xl px-4 mx-auto sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-start gap-6"
        >
          {Icon && (
            <div className="hidden p-4 border rounded-2xl md:block bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border-cyan-500/30">
              <Icon className="w-8 h-8 text-cyan-400" />
            </div>
          )}

          <div className="flex-1">
            <h1 className="mb-4 text-4xl font-black text-white sm:text-5xl">
              {title}
            </h1>

            <p className="max-w-3xl text-lg text-slate-400">
              {description}
            </p>

            {children && <div className="mt-6">{children}</div>}
          </div>
        </motion.div>
      </div>
    </div>
  );
}