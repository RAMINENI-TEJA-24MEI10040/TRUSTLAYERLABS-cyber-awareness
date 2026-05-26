"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/* ─────────────────────────────────────────────
   Utility: smooth scroll
───────────────────────────────────────────── */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ─────────────────────────────────────────────
   Sub-component: Radar Ring
───────────────────────────────────────────── */
function RadarRing({ delay, radius }: { delay: number; radius: number }) {
  return (
    <motion.span
      className="absolute rounded-full border border-cyan-400/30 pointer-events-none"
      style={{ width: radius * 2, height: radius * 2, top: "50%", left: "50%", x: "-50%", y: "-50%" }}
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: [0, 0.6, 0], scale: [0.4, 1.2, 1.6] }}
      transition={{ duration: 2.4, delay, repeat: Infinity, ease: "easeOut" }}
    />
  );
}

/* ─────────────────────────────────────────────
   Sub-component: Corner Bracket
───────────────────────────────────────────── */
function CornerBracket({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const posMap = {
    tl: "top-0 left-0 border-t border-l",
    tr: "top-0 right-0 border-t border-r",
    bl: "bottom-0 left-0 border-b border-l",
    br: "bottom-0 right-0 border-b border-r",
  };
  return (
    <span
      className={`absolute w-2.5 h-2.5 border-cyan-400/80 ${posMap[position]}`}
    />
  );
}

/* ─────────────────────────────────────────────
   Sub-component: Neural Grid Lines
───────────────────────────────────────────── */
function NeuralGrid() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* horizontal lines */}
      {[14, 28, 42].map((y) => (
        <line key={`h-${y}`} x1="6" y1={y} x2="50" y2={y} stroke="#22d3ee" strokeWidth="0.4" />
      ))}
      {/* vertical lines */}
      {[14, 28, 42].map((x) => (
        <line key={`v-${x}`} x1={x} y1="6" x2={x} y2="50" stroke="#22d3ee" strokeWidth="0.4" />
      ))}
      {/* node dots */}
      {[14, 28, 42].flatMap((x) =>
        [14, 28, 42].map((y) => (
          <circle key={`d-${x}-${y}`} cx={x} cy={y} r="1" fill="#34d399" />
        ))
      )}
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Sub-component: Upward Data Stream
───────────────────────────────────────────── */
function DataStream() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 56 56"
      fill="none"
      overflow="visible"
    >
      {[20, 28, 36].map((x, i) => (
        <motion.line
          key={x}
          x1={x}
          x2={x}
          y1={60}
          y2={-4}
          stroke="url(#streamGrad)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 0], opacity: [0, 0.9, 0] }}
          transition={{
            duration: 1.2,
            delay: i * 0.15,
            repeat: Infinity,
            repeatDelay: 1.8,
            ease: "easeInOut",
          }}
        />
      ))}
      <defs>
        <linearGradient id="streamGrad" x1="0" y1="0" x2="0" y2="1" gradientTransform="rotate(90)">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
          <stop offset="50%" stopColor="#34d399" stopOpacity="1" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Sub-component: Central Chevron Mark
───────────────────────────────────────────── */
function CyberChevron({ hovered }: { hovered: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className="w-5 h-5 relative z-10"
      fill="none"
      stroke="url(#chevronGrad)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={hovered ? { y: -2 } : { y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* double chevron up for "nav node" feel */}
      <motion.polyline
        points="18 15 12 9 6 15"
        animate={hovered ? { opacity: 1 } : { opacity: 0.5 }}
        transition={{ duration: 0.25 }}
      />
      <motion.polyline
        points="18 20 12 14 6 20"
        animate={hovered ? { opacity: 0.5 } : { opacity: 0.25 }}
        transition={{ duration: 0.25 }}
      />
      <defs>
        <linearGradient id="chevronGrad" x1="6" y1="9" x2="18" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
}

/* ─────────────────────────────────────────────
   Sub-component: Status Indicator
───────────────────────────────────────────── */
function StatusDot() {
  return (
    <span className="absolute -top-1 -right-1 flex items-center justify-center w-3.5 h-3.5">
      <motion.span
        className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-60"
        animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <span className="relative inline-flex rounded-full w-2 h-2 bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.7)]" />
    </span>
  );
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Tilt effect via mouse proximity
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-30, 30], [12, -12]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-30, 30], [-12, 12]), { stiffness: 200, damping: 20 });

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    mouseX.set(e.clientX - cx);
    mouseY.set(e.clientY - cy);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setHovered(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-8 right-6 z-50 sm:bottom-10 sm:right-8"
          initial={{ opacity: 0, y: 24, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.75 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
        >
          {/* Ambient float drift */}
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* 3-D tilt container */}
            <motion.div
              style={{ rotateX, rotateY, perspective: 400 }}
              className="relative"
            >
              {/* Radar pulse rings — rendered behind button */}
              {hovered && (
                <>
                  <RadarRing delay={0}    radius={28} />
                  <RadarRing delay={0.4}  radius={36} />
                  <RadarRing delay={0.8}  radius={44} />
                </>
              )}

              {/* ── The Button ── */}
              <motion.button
                ref={buttonRef}
                onClick={scrollToTop}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
                aria-label="Scroll to top"
                whileTap={{ scale: 0.92 }}
                className="
                  relative w-14 h-14 rounded-xl
                  flex items-center justify-center
                  overflow-hidden cursor-pointer
                  select-none outline-none
                  border border-cyan-500/40
                  bg-[rgba(2,18,28,0.72)]
                  backdrop-blur-md
                  shadow-[0_0_18px_2px_rgba(34,211,238,0.15),inset_0_1px_0_rgba(255,255,255,0.05)]
                  transition-shadow duration-300
                "
                style={{
                  boxShadow: hovered
                    ? "0 0 28px 6px rgba(34,211,238,0.28), 0 0 60px 8px rgba(52,211,153,0.12), inset 0 1px 0 rgba(255,255,255,0.07)"
                    : "0 0 14px 2px rgba(34,211,238,0.12), inset 0 1px 0 rgba(255,255,255,0.04)",
                }}
              >
                {/* Glassmorphism inner gradient overlay */}
                <span className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.06] to-transparent pointer-events-none" />

                {/* Neural grid background */}
                <NeuralGrid />

                {/* Data stream (on hover) */}
                {hovered && <DataStream />}

                {/* Horizontal scan line */}
                <motion.span
                  className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent pointer-events-none"
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
                />

                {/* Corner brackets — targeting UI feel */}
                <CornerBracket position="tl" />
                <CornerBracket position="tr" />
                <CornerBracket position="bl" />
                <CornerBracket position="br" />

                {/* Central icon */}
                <CyberChevron hovered={hovered} />

                {/* Bottom label */}
                <motion.span
                  className="absolute bottom-[5px] left-0 right-0 text-center font-mono text-[7px] tracking-[0.2em] text-cyan-400/60 uppercase pointer-events-none"
                  animate={hovered ? { opacity: 1 } : { opacity: 0.4 }}
                  transition={{ duration: 0.2 }}
                >
                  NAV
                </motion.span>

                {/* Status dot */}
                <StatusDot />
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}