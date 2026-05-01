"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

const HeroMesh = dynamic(() => import("./HeroMesh"), { ssr: false });

const words = ["GraphRAG", "Secure Architectures", "Intelligent Systems"];

function KineticTitle() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10"
    >
      <p className="font-mono text-xs tracking-[0.4em] text-[var(--cyan)] mb-6 uppercase">
        — Available for 2026 Roles
      </p>
      <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight">
        <span className="gradient-text">Engineering</span>
        <br />
        <span className="text-[var(--text-primary)]">Intelligent Systems</span>
        <br />
        <span className="text-[var(--text-muted)] text-4xl md:text-5xl">
          through{" "}
          <span className="neon">GraphRAG</span>
          {" "}& Secure Architectures
        </span>
      </h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-6 max-w-xl text-[var(--text-muted)] text-lg leading-relaxed"
      >
        AI/ML Engineer · Cybersecurity Researcher · Full-Stack Architect.
        I build systems that think, protect, and scale.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-10 flex gap-4 flex-wrap"
      >
        <a
          href="#archaeology"
          className="px-6 py-3 rounded-lg glass neon text-sm font-mono tracking-widest uppercase glow-pulse hover:scale-105 transition-transform"
        >
          View Work
        </a>
        <a
          href="#terminal"
          className="px-6 py-3 rounded-lg border border-[var(--glass-border)] text-[var(--text-muted)] text-sm font-mono tracking-widest uppercase hover:border-[var(--cyan)] hover:text-[var(--cyan)] transition-all"
        >
          Contact --send
        </a>
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section
      id="statement"
      className="relative min-h-screen flex items-center grid-bg overflow-hidden"
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,245,255,0.06) 0%, transparent 70%)" }}
      />

      <HeroMesh />

      <div className="relative container mx-auto px-8 max-w-6xl">
        <KineticTitle />
      </div>

      {/* Scroll indicator */}
      <motion.div
        aria-hidden="true"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--text-muted)]"
      >
        <span className="font-mono text-xs tracking-widest">SCROLL</span>
        <ArrowDown size={16} className="text-[var(--cyan)]" />
      </motion.div>
    </section>
  );
}
