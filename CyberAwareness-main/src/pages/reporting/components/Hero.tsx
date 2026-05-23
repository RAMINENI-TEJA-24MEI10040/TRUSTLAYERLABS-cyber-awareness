import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <header className="pt-24 bg-gray-50 dark:bg-slate-950/50 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-cyan-400 text-sm font-semibold uppercase tracking-[0.3em] mb-3">
            Incident Reporting
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 text-gray-900 dark:text-white">Report Cybercrime — Steps & Guidance</h1>
          <p className="text-gray-700 dark:text-slate-400 max-w-3xl">A concise, step-by-step guide to reporting cyber incidents to the National Cyber Crime Portal and local authorities. Preserve evidence and follow safety steps immediately.</p>
        </motion.div>
      </div>
    </header>
  );
}
