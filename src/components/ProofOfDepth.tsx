"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, FileText, CheckCircle, Award } from "lucide-react";

const securityProjects = [
  {
    name: "ZK-SecureStorage",
    checks: [
      "AES-256-GCM client-side encryption",
      "PBKDF2 key derivation (310k iterations)",
      "Zero-knowledge server — ciphertext only",
      "IV randomised per file",
      "Web Worker — main thread unblocked",
    ],
  },
  {
    name: "TrumorGPT",
    checks: [
      "Input sanitization on claim text",
      "Rate limiting on inference endpoint",
      "No PII stored in knowledge graph",
      "Adversarial prompt boundary tested",
    ],
  },
];

const credentials = [
  { label: "AWS Cloud Practitioner", status: "certified", color: "#f89939" },
  { label: "CompTIA Security+", status: "in progress", color: "#00f5ff" },
];

type ScanState = "idle" | "scanning" | "done";

function SecurityScan({ project }: { project: typeof securityProjects[0] }) {
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [revealed, setRevealed] = useState(0);

  const startScan = () => {
    if (scanState !== "idle") return;
    setScanState("scanning");
    setRevealed(0);
    project.checks.forEach((_, i) => {
      setTimeout(() => {
        setRevealed(i + 1);
        if (i === project.checks.length - 1) setScanState("done");
      }, 400 + i * 480);
    });
  };

  const reset = () => { setScanState("idle"); setRevealed(0); };

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mb-1">
            Security Review
          </p>
          <h3 className="text-lg font-bold text-[var(--text-primary)]">{project.name}</h3>
        </div>
        <button
          onClick={scanState === "done" ? reset : startScan}
          disabled={scanState === "scanning"}
          aria-label={`${scanState === "done" ? "Reset" : "Run"} security scan for ${project.name}`}
          aria-busy={scanState === "scanning"}
          className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-widest transition-all ${
            scanState === "done"
              ? "border border-green-400/40 text-green-400 hover:bg-green-400/10"
              : scanState === "scanning"
              ? "border border-[var(--cyan)]/40 text-[var(--cyan)] cursor-wait"
              : "glass neon glow-pulse hover:scale-105"
          }`}
        >
          {scanState === "done" ? "Reset" : scanState === "scanning" ? "Scanning..." : "Run Scan"}
        </button>
      </div>

      <div className="h-1 rounded-full bg-[var(--glass-bg)] mb-4 overflow-hidden" aria-hidden="true">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #00f5ff, #7b2fff)" }}
          animate={{ width: `${(revealed / project.checks.length) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <div className="space-y-2" role="list" aria-label="Security checks">
        {project.checks.map((check, i) => (
          <div key={check} className="flex items-center gap-3" role="listitem">
            <AnimatePresence mode="wait">
              {i < revealed ? (
                <motion.div key="check" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="shrink-0">
                  <CheckCircle size={16} className="text-green-400" />
                </motion.div>
              ) : (
                <motion.div key="wait" className="shrink-0" aria-hidden="true">
                  <div className="w-4 h-4 rounded-full border border-[var(--glass-border)]" />
                </motion.div>
              )}
            </AnimatePresence>
            <motion.p
              animate={{ opacity: i < revealed ? 1 : 0.3 }}
              transition={{ duration: 0.3 }}
              className="font-mono text-sm text-[var(--text-primary)]"
            >
              {check}
            </motion.p>
            {i < revealed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-auto text-[10px] font-mono text-green-400">
                VERIFIED
              </motion.span>
            )}
          </div>
        ))}
      </div>

      {scanState === "done" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 rounded-xl border border-green-400/30 bg-green-400/5 text-center"
          role="status"
        >
          <p className="font-mono text-sm text-green-400">✓ All checks passed</p>
        </motion.div>
      )}
    </div>
  );
}

export default function ProofOfDepth() {
  return (
    <section id="depth" className="relative">
      <div className="container mx-auto px-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="font-mono text-xs tracking-[0.4em] text-[var(--cyan)] mb-4 uppercase">
            — 05. Proof of Depth
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)]">
            Research &{" "}
            <span className="gradient-text">Credentials</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left: real research credential + credentials block */}
          <div className="flex flex-col gap-6">
            {/* The one real thing */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(0,245,255,0.1)", border: "1px solid rgba(0,245,255,0.3)" }}>
                  <FileText size={18} className="text-[var(--cyan)]" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(0,245,255,0.1)", color: "var(--cyan)", border: "1px solid rgba(0,245,255,0.3)" }}>
                    Presented
                  </span>
                  <h3 className="text-base font-bold text-[var(--text-primary)] mt-2 leading-snug">
                    TrumorGPT — GraphRAG for Health Misinformation Detection
                  </h3>
                  <p className="text-xs font-mono text-[var(--cyan)] mt-1">
                    Üsküdar University Student Research Congress, 2025
                  </p>
                  <p className="text-sm text-[var(--text-muted)] mt-3 leading-relaxed">
                    Presented the full pipeline: knowledge graph construction, PageRank entity scoring,
                    and NLI-based claim verification. First public presentation of the project.
                  </p>
                  <div className="flex gap-2 flex-wrap mt-4">
                    {["GraphRAG", "NLP", "Health AI", "Knowledge Graphs"].map((tag) => (
                      <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-[var(--glass-border)] text-[var(--text-muted)]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Credentials */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-6"
            >
              <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mb-5">
                Certifications
              </p>
              <div className="space-y-0">
                {credentials.map((cert) => (
                  <div key={cert.label} className="flex items-center gap-3 py-3 border-b border-[var(--glass-border)] last:border-0">
                    <Award size={16} style={{ color: cert.color }} className="shrink-0" />
                    <span className="text-sm text-[var(--text-primary)] flex-1">{cert.label}</span>
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full capitalize"
                      style={{
                        background: `${cert.color}15`,
                        color: cert.color,
                        border: `1px solid ${cert.color}40`,
                      }}
                    >
                      {cert.status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: security scans */}
          <div className="flex flex-col gap-6">
            <p className="font-mono text-xs tracking-[0.3em] text-[var(--cyan)] uppercase">
              Live Security Review
            </p>
            {securityProjects.map((proj) => (
              <SecurityScan key={proj.name} project={proj} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
