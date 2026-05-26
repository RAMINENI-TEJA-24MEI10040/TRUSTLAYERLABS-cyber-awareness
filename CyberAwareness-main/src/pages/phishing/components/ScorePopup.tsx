import { AnimatePresence, motion } from "framer-motion";

export default function ScorePopup({ show, correct, streak }: { show: boolean; correct: boolean; streak: number }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`ph-score-pop ${correct ? "good" : "bad"}`}
          initial={{ opacity: 0, scale: 0.75, y: 0 }}
          animate={{ opacity: 1, scale: 1, y: -56 }}
          exit={{ opacity: 0, scale: 0.9, y: -90 }}
        >
          <strong>{correct ? "+10" : "-5"}</strong>
          <span>{correct ? `Correct${streak > 1 ? ` x${streak}` : ""}` : "Wrong"}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
