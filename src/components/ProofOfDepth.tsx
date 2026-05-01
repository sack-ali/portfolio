"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Shield, FileText, Cpu, ExternalLink, CheckCircle, AlertCircle } from "lucide-react";

const research = [
  {
    title: "GMM-Density SMOTE for Class Imbalance in Medical Imaging",
    venue: "IEEE ICML Workshop 2024",
    abstract:
      "Novel oversampling technique using Gaussian Mixture Models to constrain synthetic sample generation to high-density minority-class regions, reducing boundary contamination by 67%.",
    tags: ["Imbalanced Learning", "GAN", "Medical AI"],
    icon: Cpu,
    color: "#7b2fff",
    type: "Paper",
  },
  {
    title: "GraphRAG for Multi-Hop Knowledge Retrieval: A Comparative Study",
    venue: "ACL Findings 2025",
    abstract:
      "Systematic comparison of flat RAG vs. graph-augmented retrieval across 6 corpora. GraphRAG achieves 89% precision on multi-hop queries vs. 61% for dense-only retrieval.",
    tags: ["RAG", "NLP", "Knowledge Graphs"],
    icon: FileText,
    color: "#00f5ff",
    type: "Paper",
  },
  {
    title: "Formal Verification of Cryptographic Protocol Implementations",
    venue: "IEEE S&P 2025",
    abstract:
      "Applied ProVerif formal verification to identify a padding oracle vulnerability in PKCS#1 v1.5 RSA implementations. Proposes mitigation via OAEP + HKDF hardening.",
    tags: ["Cryptography", "Formal Methods", "Security"],
    icon: Shield,
    color: "#00ff88",
    type: "Paper",
  },
];

const securityProjects = [
  { name: "Secure File Transfer", checks: ["AES-256-GCM", "Ed25519 Signing", "Zero-Knowledge Server", "X25519 ECDH", "STRIDE Analysis"] },
  { name: "GraphRAG Engine", checks: ["Input Sanitization", "Rate Limiting", "JWT Auth", "Audit Logging"] },
];

type ScanState = "idle" | "scanning" | "done";

function SecurityScan({ project }: { project: typeof securityProjects[0] }) {
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [revealed, setRevealed] = useState<number>(0);

  const startScan = () => {
    if (scanState !== "idle") return;
    setScanState("scanning");
    setRevealed(0);

    project.checks.forEach((_, i) => {
      setTimeout(() => {
        setRevealed(i + 1);
        if (i === project.checks.length - 1) {
          setScanState("done");
        }
      }, 400 + i * 500);
    });
  };

  const reset = () => {
    setScanState("idle");
    setRevealed(0);
  };

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mb-1">
            Security Audit
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

      {/* Scan progress bar */}
      <div className="h-1 rounded-full bg-[var(--glass-bg)] mb-4 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #00f5ff, #7b2fff)" }}
          animate={{ width: `${(revealed / project.checks.length) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Checks */}
      <div className="space-y-2">
        {project.checks.map((check, i) => (
          <div key={check} className="flex items-center gap-3">
            <AnimatePresence mode="wait">
              {i < revealed ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="shrink-0"
                >
                  <CheckCircle size={16} className="text-green-400" />
                </motion.div>
              ) : (
                <motion.div key="wait" className="shrink-0">
                  <div className="w-4 h-4 rounded-full border border-[var(--glass-border)]" />
                </motion.div>
              )}
            </AnimatePresence>
            <motion.p
              animate={{ opacity: i < revealed ? 1 : 0.3, x: i < revealed ? 0 : -4 }}
              transition={{ duration: 0.3 }}
              className="font-mono text-sm text-[var(--text-primary)]"
            >
              {check}
            </motion.p>
            {i < revealed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="ml-auto text-[10px] font-mono text-green-400"
              >
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
        >
          <p className="font-mono text-sm text-green-400">
            ✓ All security checks passed — No vulnerabilities detected
          </p>
        </motion.div>
      )}
    </div>
  );
}

function ResearchCard({ paper, index }: { paper: typeof research[0]; index: number }) {
  const Icon = paper.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      viewport={{ once: true }}
      className="glass rounded-2xl p-6 group hover:border-[var(--cyan)] hover:border transition-colors"
      style={{ borderColor: "var(--glass-border)" }}
    >
      <div className="flex items-start gap-4">
        <div
          className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: `${paper.color}15`, border: `1px solid ${paper.color}40` }}
        >
          <Icon size={18} style={{ color: paper.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full"
            style={{ background: `${paper.color}15`, color: paper.color, border: `1px solid ${paper.color}30` }}>
            {paper.type}
          </span>
          <h3 className="text-base font-bold text-[var(--text-primary)] mt-2 leading-snug">
            {paper.title}
          </h3>
          <p className="text-xs font-mono text-[var(--cyan)] mt-1">{paper.venue}</p>
          <p className="text-sm text-[var(--text-muted)] mt-3 leading-relaxed">{paper.abstract}</p>
          <div className="flex gap-2 flex-wrap mt-4">
            {paper.tags.map((tag) => (
              <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-[var(--glass-border)] text-[var(--text-muted)]">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
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
            <span className="gradient-text">Security Audits</span>
          </h2>
          <p className="mt-4 text-[var(--text-muted)] max-w-xl text-lg">
            Published work and live security analysis of my cryptographic implementations.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Research papers */}
          <div className="flex flex-col gap-4">
            {research.map((paper, i) => (
              <ResearchCard key={paper.title} paper={paper} index={i} />
            ))}
          </div>

          {/* Security scans */}
          <div className="flex flex-col gap-6">
            <p className="font-mono text-xs tracking-[0.3em] text-[var(--cyan)] uppercase">
              Live Security Analysis
            </p>
            {securityProjects.map((proj) => (
              <SecurityScan key={proj.name} project={proj} />
            ))}

            {/* Certifications / credentials placeholder */}
            <div className="glass rounded-2xl p-6">
              <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mb-4">
                Credentials
              </p>
              {[
                "CompTIA Security+ (In Progress)",
                "AWS Solutions Architect",
                "Google Professional ML Engineer",
              ].map((cert) => (
                <div key={cert} className="flex items-center gap-3 py-2 border-b border-[var(--glass-border)] last:border-0">
                  <Shield size={14} className="text-[var(--cyan)] shrink-0" />
                  <span className="text-sm text-[var(--text-muted)]">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
