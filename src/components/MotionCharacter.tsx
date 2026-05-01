"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

const messages = [
  "Initializing case study analysis...",
  "Loading project architecture data...",
  "Running security scan on codebase...",
  "GraphRAG nodes: 2,847 connected.",
  "All systems nominal. Let's explore.",
];

function Avatar({ scrollProgress }: { scrollProgress: number }) {
  const eyeY = Math.sin(scrollProgress * Math.PI * 2) * 2;
  const armAngle = scrollProgress * 30;

  return (
    <svg
      viewBox="0 0 120 180"
      className="w-32 h-48"
      style={{ filter: "drop-shadow(0 0 12px rgba(0,245,255,0.4))" }}
    >
      {/* Body glow */}
      <defs>
        <radialGradient id="bodyGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#001d3d" />
          <stop offset="100%" stopColor="#000814" />
        </radialGradient>
        <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f5ff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#00b4d8" stopOpacity="0.6" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Floating ring */}
      <ellipse cx="60" cy="165" rx="25" ry="5" fill="rgba(0,245,255,0.15)" />
      <ellipse cx="60" cy="165" rx="18" ry="3" fill="rgba(0,245,255,0.1)" />

      {/* Body */}
      <rect x="35" y="80" width="50" height="65" rx="14" fill="url(#bodyGrad)" stroke="rgba(0,245,255,0.5)" strokeWidth="1.5" />

      {/* Chest panel */}
      <rect x="44" y="92" width="32" height="20" rx="4" fill="rgba(0,245,255,0.08)" stroke="rgba(0,245,255,0.3)" strokeWidth="1" />
      <rect x="48" y="96" width="8" height="2" rx="1" fill="#00f5ff" opacity="0.8" />
      <rect x="48" y="101" width="14" height="2" rx="1" fill="#00f5ff" opacity="0.4" />
      <rect x="48" y="106" width="10" height="2" rx="1" fill="#00f5ff" opacity="0.6" />
      <circle cx="68" cy="101" r="4" fill="rgba(0,245,255,0.2)" stroke="#00f5ff" strokeWidth="1" />
      <circle cx="68" cy="101" r="2" fill="#00f5ff" />

      {/* Head */}
      <rect x="32" y="30" width="56" height="52" rx="16" fill="url(#bodyGrad)" stroke="rgba(0,245,255,0.6)" strokeWidth="1.5" />

      {/* Eyes */}
      <rect x="42" y={46 + eyeY} width="14" height="8" rx="4" fill="#00f5ff" opacity="0.9" filter="url(#glow)" />
      <rect x="64" y={46 + eyeY} width="14" height="8" rx="4" fill="#00f5ff" opacity="0.9" filter="url(#glow)" />

      {/* Mouth */}
      <rect x="46" y="66" width="28" height="4" rx="2" fill="rgba(0,245,255,0.3)" />
      <rect x="50" y="67" width={Math.max(4, 20 * Math.min(1, scrollProgress * 3))} height="2" rx="1" fill="#00f5ff" />

      {/* Neck */}
      <rect x="52" y="80" width="16" height="6" rx="3" fill="rgba(0,18,51,0.8)" stroke="rgba(0,245,255,0.3)" strokeWidth="1" />

      {/* Left arm */}
      <motion.g
        animate={{ rotate: [-5, 5, -5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "35px 95px" }}
      >
        <rect x="18" y="85" width="18" height="38" rx="8" fill="url(#bodyGrad)" stroke="rgba(0,245,255,0.4)" strokeWidth="1.2" />
        <rect x="20" y="118" width="14" height="12" rx="6" fill="url(#bodyGrad)" stroke="rgba(0,245,255,0.5)" strokeWidth="1" />
      </motion.g>

      {/* Right arm — pointing down */}
      <motion.g
        animate={{ rotate: [armAngle, armAngle + 8, armAngle] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "85px 95px" }}
      >
        <rect x="84" y="85" width="18" height="38" rx="8" fill="url(#bodyGrad)" stroke="rgba(0,245,255,0.4)" strokeWidth="1.2" />
        <rect x="86" y="118" width="14" height="12" rx="6" fill="url(#bodyGrad)" stroke="rgba(0,245,255,0.5)" strokeWidth="1" />
        {/* Pointer finger */}
        <rect x="92" y="128" width="5" height="14" rx="2.5" fill="#00f5ff" opacity="0.8" filter="url(#glow)" />
      </motion.g>

      {/* Antenna */}
      <line x1="60" y1="30" x2="60" y2="14" stroke="rgba(0,245,255,0.5)" strokeWidth="2" />
      <circle cx="60" cy="12" r="4" fill="#00f5ff" filter="url(#glow)" />
      <circle cx="60" cy="12" r="2" fill="white" />

      {/* Legs */}
      <rect x="42" y="143" width="14" height="24" rx="6" fill="url(#bodyGrad)" stroke="rgba(0,245,255,0.35)" strokeWidth="1.2" />
      <rect x="64" y="143" width="14" height="24" rx="6" fill="url(#bodyGrad)" stroke="rgba(0,245,255,0.35)" strokeWidth="1.2" />
      <rect x="40" y="162" width="18" height="8" rx="4" fill="url(#bodyGrad)" stroke="rgba(0,245,255,0.4)" strokeWidth="1" />
      <rect x="62" y="162" width="18" height="8" rx="4" fill="url(#bodyGrad)" stroke="rgba(0,245,255,0.4)" strokeWidth="1" />
    </svg>
  );
}

export default function GuideSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [msgIndex, setMsgIndex] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => setProgress(v));
    return unsub;
  }, [scrollYProgress]);

  useEffect(() => {
    const id = setInterval(() => {
      setMsgIndex((i) => (i + 1) % messages.length);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <section ref={ref} id="guide" className="relative py-32 overflow-hidden">
      {/* Connector line from hero */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24"
        style={{ background: "linear-gradient(to bottom, rgba(0,245,255,0.4), transparent)" }} />

      <div className="container mx-auto px-8 max-w-6xl flex flex-col md:flex-row items-center gap-16">
        {/* Character */}
        <motion.div style={{ y }} className="flex flex-col items-center gap-6 shrink-0">
          <div className="float">
            <Avatar scrollProgress={progress} />
          </div>
          {/* Speech bubble */}
          <AnimatePresence mode="wait">
            <motion.div
              key={msgIndex}
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="glass rounded-xl px-4 py-2 max-w-[200px] text-center"
            >
              <p className="font-mono text-[10px] text-[var(--cyan)] leading-relaxed">
                {messages[msgIndex]}
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <p className="font-mono text-xs tracking-[0.4em] text-[var(--cyan)] mb-4 uppercase">
            — Your Guide
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
            Meet <span className="neon">ARIA</span>
            <br />
            <span className="text-[var(--text-muted)] text-2xl font-normal">
              Adaptive Retrieval Intelligence Agent
            </span>
          </h2>
          <p className="text-[var(--text-muted)] text-lg leading-relaxed max-w-lg">
            ARIA will guide you through each project, surfacing the architecture decisions,
            failure modes, and engineering depth behind every system I've built.
          </p>
          <div className="mt-8 flex gap-3 flex-wrap">
            {["GraphRAG", "CNN-XAI", "Cybersecurity", "Full-Stack"].map((tag) => (
              <span key={tag} className="glass px-3 py-1 rounded-full font-mono text-xs text-[var(--cyan)]">
                {tag}
              </span>
            ))}
          </div>
          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-6">
            {[
              { value: "12+", label: "Projects" },
              { value: "4", label: "Research Papers" },
              { value: "3", label: "Domains" },
            ].map(({ value, label }) => (
              <div key={label} className="glass rounded-xl p-4 text-center">
                <p className="text-2xl font-bold neon">{value}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1 font-mono">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Pointer trail to next section */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
            className="w-1 h-1 rounded-full bg-[var(--cyan)]"
          />
        ))}
      </div>
    </section>
  );
}
