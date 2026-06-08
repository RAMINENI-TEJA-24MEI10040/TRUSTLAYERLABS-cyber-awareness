import React from 'react';
import { motion } from 'framer-motion';

const CIWSidebar: React.FC = () => {
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 bg-[rgba(10,20,30,0.6)] backdrop-blur-lg border-r border-cyan-800/30 p-4 flex-shrink-0"
    >
      <div className="text-cyan-300 font-semibold mb-4">CIW</div>
      <nav className="space-y-2 text-sm text-cyan-100/90">
        <button className="w-full text-left py-2 px-3 rounded-md hover:bg-cyan-900/20">Scanners</button>
        <button className="w-full text-left py-2 px-3 rounded-md hover:bg-cyan-900/20">Cases</button>
        <button className="w-full text-left py-2 px-3 rounded-md hover:bg-cyan-900/20">AI Assist</button>
        <button className="w-full text-left py-2 px-3 rounded-md hover:bg-cyan-900/20">Export</button>
      </nav>
      <div className="mt-6 text-xs text-cyan-200/60">Neon SOC · Glass grid</div>
    </motion.aside>
  );
};

export default CIWSidebar;
