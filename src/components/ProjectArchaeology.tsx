"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ChevronDown, GitBranch, Cpu, Shield, Database, ExternalLink } from "lucide-react";

type Project = {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  icon: typeof GitBranch;
  tags: string[];
  problem: string;
  failure: string;
  fix: string;
  architecture: { label: string; desc: string }[];
  codeSnippet: string;
  ghostLabel: string;
  link?: string;
  color: string;
};

const projects: Project[] = [
  {
    id: "graphrag",
    num: "01",
    title: "GraphRAG Knowledge Engine",
    subtitle: "Retrieval-Augmented Generation over graph-structured corpora",
    icon: GitBranch,
    tags: ["Python", "Neo4j", "LangChain", "OpenAI", "FastAPI"],
    problem:
      "Standard RAG systems lost relational context between entities — asking about drug interactions returned isolated facts, not connected chains of evidence.",
    failure:
      "First attempt used flat vector embeddings. Precision was 61%. The system hallucinated connections between unrelated entities at 23% rate.",
    fix:
      "Introduced a hybrid retrieval layer: sparse graph traversal (BFS to depth 3) + dense FAISS retrieval, fused via a learned cross-attention re-ranker. Precision jumped to 89%.",
    architecture: [
      { label: "Ingestion", desc: "Entity extraction → Neo4j graph builder" },
      { label: "Retrieval", desc: "BFS graph walk + FAISS dense search" },
      { label: "Fusion", desc: "Cross-attention re-ranker (T5-small fine-tuned)" },
      { label: "Generation", desc: "GPT-4o with structured citation grounding" },
    ],
    codeSnippet: `# Hybrid retrieval fusion
graph_hits = neo4j.traverse(query_entity, depth=3)
dense_hits = faiss_index.search(query_emb, k=20)

fused = cross_attention_reranker(
  graph_context=graph_hits,
  dense_context=dense_hits,
  query=query
)
return fused[:TOP_K]`,
    ghostLabel: "Graph → Vector → Re-rank → Generate",
    color: "#00f5ff",
  },
  {
    id: "cnn-xai",
    num: "02",
    title: "CNN-XAI Medical Imaging",
    subtitle: "Explainable AI for imbalanced medical dataset classification",
    icon: Cpu,
    tags: ["PyTorch", "SHAP", "GMM-SMOTE", "React", "FastAPI"],
    problem:
      "Medical dataset had 94:6 class imbalance. Standard SMOTE generated synthetic samples in overlapping decision boundaries, causing 31% false-positive rate on minority class.",
    failure:
      "Baseline ResNet-50 hit 96% accuracy but 0% recall on the minority class — a model that predicted majority class every time would have scored identically.",
    fix:
      "Implemented GMM-Density SMOTE: fitted Gaussian Mixture Models to minority class distribution, sampled only in high-density sub-manifolds. F1 on minority class improved from 0.04 → 0.78. Used SHAP + GradCAM for XAI overlays.",
    architecture: [
      { label: "Data", desc: "GMM-Density SMOTE oversampling" },
      { label: "Model", desc: "ResNet-50 with focal loss (γ=2)" },
      { label: "XAI", desc: "SHAP values + GradCAM heatmaps" },
      { label: "UI", desc: "React dashboard with real-time explanation overlays" },
    ],
    codeSnippet: `# GMM-Density SMOTE
gmm = GaussianMixture(n_components=8)
gmm.fit(X_minority)

# Sample only from high-density regions
samples, _ = gmm.sample(n_synthetic)
density = gmm.score_samples(samples)
mask = density > density.mean() + 0.5 * density.std()
X_synthetic = samples[mask]`,
    ghostLabel: "GMM → Sample → Filter → Augment → Train",
    color: "#7b2fff",
  },
  {
    id: "secfile",
    num: "03",
    title: "Secure File Sharing System",
    subtitle: "End-to-end encrypted P2P file transfer with zero-knowledge server",
    icon: Shield,
    tags: ["Rust", "WebRTC", "AES-256-GCM", "Ed25519", "React"],
    problem:
      "Existing solutions either stored plaintext on servers or required both parties online simultaneously — neither acceptable for sensitive document transfer.",
    failure:
      "First protocol used RSA-2048 for key exchange. Under formal verification, found a padding oracle vulnerability in the PKCS#1 v1.5 implementation. Scrapped entirely.",
    fix:
      "Rebuilt with X25519 ECDH for key exchange + AES-256-GCM for payload encryption + Ed25519 for signing. Server operates in zero-knowledge mode — stores only encrypted blobs. Passed STRIDE threat model analysis.",
    architecture: [
      { label: "Key Exchange", desc: "X25519 ECDH ephemeral keypairs" },
      { label: "Encryption", desc: "AES-256-GCM with per-message nonces" },
      { label: "Signing", desc: "Ed25519 sender authentication" },
      { label: "Transport", desc: "WebRTC DataChannel with ICE fallback" },
    ],
    codeSnippet: `// X25519 key exchange (Rust)
let ephemeral = EphemeralSecret::random(&mut OsRng);
let public = PublicKey::from(&ephemeral);

// Send public key, receive peer's
let shared = ephemeral.diffie_hellman(&peer_public);
let key = hkdf_sha256(shared.as_bytes(), b"secfile-v1");

// Encrypt with AES-256-GCM
let cipher = Aes256Gcm::new_from_slice(&key)?;
let nonce = Nonce::from_slice(&rand_nonce());
let ciphertext = cipher.encrypt(nonce, payload.as_ref())?;`,
    ghostLabel: "X25519 → HKDF → AES-GCM → Sign → Transfer",
    color: "#00ff88",
  },
  {
    id: "distributed",
    num: "04",
    title: "Distributed Task Orchestrator",
    subtitle: "Fault-tolerant job queue with priority scheduling across heterogeneous workers",
    icon: Database,
    tags: ["Go", "Redis Streams", "Docker", "gRPC", "Prometheus"],
    problem:
      "Monolithic job processor became a single point of failure — one bad ML job would freeze the entire queue for hours, blocking 200+ downstream tasks.",
    failure:
      "Naïve worker pool with Redis LPOP had a thundering herd problem: all workers would wake simultaneously on queue activity, causing Redis CPU spikes to 95%.",
    fix:
      "Redesigned with Redis Streams (XREADGROUP) for consumer group isolation. Added circuit breakers per worker, exponential backoff, and dead-letter queues. Reduced queue stalls from ~3/day to 0 in 6 weeks of production.",
    architecture: [
      { label: "Queue", desc: "Redis Streams with consumer groups" },
      { label: "Workers", desc: "Dockerized Go workers with circuit breakers" },
      { label: "Scheduling", desc: "Priority queue with deadline-aware dispatch" },
      { label: "Observability", desc: "Prometheus + Grafana real-time dashboards" },
    ],
    codeSnippet: `// Redis Streams consumer group
entries, err := rdb.XReadGroup(ctx, &redis.XReadGroupArgs{
  Group:    workerID,
  Consumer: nodeID,
  Streams:  []string{"jobs", ">"},
  Count:    batchSize,
  Block:    100 * time.Millisecond,
}).Result()

for _, entry := range entries {
  go w.process(ctx, entry, circuitBreaker)
}`,
    ghostLabel: "Enqueue → Priority Sort → Circuit Break → Execute → ACK",
    color: "#ff6b35",
  },
];

function ArchitectureDiagram({ steps }: { steps: { label: string; desc: string }[] }) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 mt-4 flex-wrap">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-start gap-2">
          <div className="glass rounded-lg p-3 min-w-[110px]">
            <p className="font-mono text-[10px] text-[var(--cyan)] uppercase tracking-widest mb-1">
              {step.label}
            </p>
            <p className="text-[11px] text-[var(--text-muted)] leading-tight">{step.desc}</p>
          </div>
          {i < steps.length - 1 && (
            <div className="self-center text-[var(--cyan)] opacity-40 shrink-0 mt-1">→</div>
          )}
        </div>
      ))}
    </div>
  );
}

function CodeBlock({ code, ghostLabel }: { code: string; ghostLabel: string }) {
  const [showGhost, setShowGhost] = useState(false);

  return (
    <div
      className="relative rounded-xl overflow-hidden glass mt-4 group cursor-pointer"
      onMouseEnter={() => setShowGhost(true)}
      onMouseLeave={() => setShowGhost(false)}
    >
      <div className="flex items-center gap-2 px-4 py-2 border-b border-[var(--glass-border)]">
        <div className="w-3 h-3 rounded-full bg-red-500/60" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
        <div className="w-3 h-3 rounded-full bg-green-500/60" />
        <span className="ml-2 font-mono text-xs text-[var(--text-muted)]">logic.py</span>
      </div>
      <pre className="p-4 font-mono text-xs text-[var(--text-primary)] overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>

      {/* Logic Ghost overlay */}
      <AnimatePresence>
        {showGhost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "rgba(0,8,20,0.88)", backdropFilter: "blur(4px)" }}
          >
            <div className="text-center px-6">
              <div className="w-12 h-12 rounded-full border border-[var(--cyan)] flex items-center justify-center mx-auto mb-3"
                style={{ boxShadow: "0 0 20px rgba(0,245,255,0.3)" }}>
                <Cpu size={20} className="text-[var(--cyan)]" />
              </div>
              <p className="font-mono text-xs text-[var(--cyan)] tracking-widest mb-2 uppercase">
                Data Flow
              </p>
              <p className="font-mono text-sm text-[var(--text-primary)]">{ghostLabel}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = project.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-100px" }}
      className="glass rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-controls={`project-body-${project.id}`}
        className="w-full p-8 flex items-start gap-6 text-left group hover:bg-[var(--cyan-ghost)] transition-colors"
      >
        <div
          aria-hidden="true"
          className="shrink-0 w-14 h-14 rounded-xl flex items-center justify-center border"
          style={{
            borderColor: `${project.color}40`,
            background: `${project.color}10`,
            boxShadow: `0 0 20px ${project.color}20`,
          }}
        >
          <Icon size={24} style={{ color: project.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <span className="font-mono text-xs text-[var(--text-muted)]">{project.num}</span>
            <div className="flex gap-2 flex-wrap">
              {project.tags.map((t) => (
                <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                  style={{ background: `${project.color}15`, color: project.color, border: `1px solid ${project.color}30` }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
          <h3 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--cyan)] transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-[var(--text-muted)] mt-1">{project.subtitle}</p>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          aria-hidden="true"
          className="shrink-0 mt-1"
        >
          <ChevronDown size={20} className="text-[var(--text-muted)]" />
        </motion.div>
      </button>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id={`project-body-${project.id}`}
            role="region"
            aria-label={`${project.title} details`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-8 pb-8 grid md:grid-cols-2 gap-8 border-t border-[var(--glass-border)]">
              {/* Left: Narrative */}
              <div className="pt-6">
                <div className="mb-6">
                  <p className="font-mono text-[10px] tracking-widest text-[var(--cyan)] uppercase mb-2">
                    The Problem
                  </p>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">{project.problem}</p>
                </div>
                <div className="mb-6">
                  <p className="font-mono text-[10px] tracking-widest text-red-400 uppercase mb-2">
                    The Failure
                  </p>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">{project.failure}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-widest text-green-400 uppercase mb-2">
                    The Fix
                  </p>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">{project.fix}</p>
                </div>
              </div>

              {/* Right: Architecture + Code */}
              <div className="pt-6">
                <p className="font-mono text-[10px] tracking-widest text-[var(--cyan)] uppercase mb-2">
                  Architecture Flow
                </p>
                <ArchitectureDiagram steps={project.architecture} />
                <p className="font-mono text-[10px] tracking-widest text-[var(--cyan)] uppercase mt-6 mb-2">
                  Core Logic — hover for data flow
                </p>
                <CodeBlock code={project.codeSnippet} ghostLabel={project.ghostLabel} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ProjectArchaeology() {
  return (
    <section id="archaeology" className="relative">
      <div className="container mx-auto px-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="font-mono text-xs tracking-[0.4em] text-[var(--cyan)] mb-4 uppercase">
            — 03. Project Archaeology
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)]">
            How I Failed.{" "}
            <span className="gradient-text">How I Fixed It.</span>
          </h2>
          <p className="mt-4 text-[var(--text-muted)] max-w-xl text-lg">
            Each project is a case study in real engineering decisions — including the ones that went wrong first.
          </p>
        </motion.div>

        <div className="flex flex-col gap-4">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
