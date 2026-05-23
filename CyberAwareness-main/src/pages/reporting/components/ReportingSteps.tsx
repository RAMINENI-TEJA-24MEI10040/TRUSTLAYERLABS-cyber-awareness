import { motion } from 'framer-motion';

const steps = [
  { title: 'Assess the incident', text: 'Stop interacting, do not share OTPs or approve collect requests. Note time, sender, channel.' },
  { title: 'Preserve evidence', text: 'Take screenshots, save chat logs, emails, transaction IDs and URLs. Export or copy files securely.' },
  { title: 'Gather proof', text: 'Collect bank transaction screenshots, UPI collect requests, caller details, and SIM/number info.' },
  { title: 'Block & secure', text: 'Block the sender, change passwords, enable MFA, and contact your bank for blocking transactions.' },
  { title: 'Report on portal', text: 'Visit cybercrime.gov.in or call 1930 to file a complaint. Attach evidence and provide clear chronology.' },
  { title: 'Escalate locally', text: 'If financial loss occurred, contact your bank then visit the local cyber police/cell with copies of evidence.' },
];

export default function ReportingSteps() {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
      <motion.h2 className="text-xl font-bold mb-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Step-by-step reporting flow</motion.h2>

      <ol className="space-y-4">
        {steps.map((s, i) => (
          <motion.li key={s.title} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="flex gap-4">
            <div className="min-w-[36px] h-9 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center font-semibold text-slate-950 dark:text-white">{i + 1}</div>
            <div>
              <div className="font-semibold">{s.title}</div>
              <div className="text-sm text-slate-400">{s.text}</div>
            </div>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
