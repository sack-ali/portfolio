"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, GitBranch, Cpu, Shield, ExternalLink } from "lucide-react";

type Project = {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  icon: typeof GitBranch;
  tags: string[];
  context: string;
  challenge: string;
  approach: string;
  architecture: { label: string; desc: string }[];
  codeSnippet: string;
  ghostLabel: string;
  link: string;
  color: string;
};

const projects: Project[] = [
  {
    id: "trumorgpt",
    num: "01",
    title: "TrumorGPT",
    subtitle: "GraphRAG pipeline for health misinformation detection",
    icon: GitBranch,
    tags: ["Python", "BERT", "distilgpt2", "Knowledge Graphs", "PageRank", "NLI"],
    context:
      "Health misinformation spreads relationally — a false claim gains credibility by linking to real entities. Standard NLP classifiers treat each claim in isolation and miss these chains. Built as a research project and presented at the Üsküdar University Student Research Congress, 2025.",
    challenge:
      "BERT fine-tuned on claim text alone plateaued at ~71% F1. It had no way to reason about the credibility of the entities referenced in a claim, or their relationships to established medical knowledge.",
    approach:
      "Built a knowledge graph from verified medical sources. Used PageRank to score entity credibility, then retrieved relevant subgraphs per claim. A Natural Language Inference (NLI) head then verified each claim against the retrieved evidence — combining structural graph reasoning with language model classification.",
    architecture: [
      { label: "Ingest", desc: "Build KG from verified medical corpora" },
      { label: "Rank", desc: "PageRank entity credibility scores" },
      { label: "Retrieve", desc: "Subgraph retrieval per claim entity" },
      { label: "Verify", desc: "NLI head: claim vs. evidence" },
      { label: "Generate", desc: "distilgpt2 explanation output" },
    ],
    codeSnippet: `# PageRank entity credibility scoring
G = build_knowledge_graph(verified_sources)
credibility = nx.pagerank(G, alpha=0.85)

# Subgraph retrieval for claim entities
entities = extract_entities(claim)  # BERT NER
subgraph = G.subgraph(
    nx.ego_graph(G, e, radius=2)
    for e in entities
)

# NLI verification
evidence = graph_to_text(subgraph)
label = nli_model(premise=evidence, hypothesis=claim)`,
    ghostLabel: "Claim → Entity Extract → KG Lookup → NLI → Label",
    link: "https://github.com/sack-ali/TrumorGPT",
    color: "#00f5ff",
  },
  {
    id: "zk-secure",
    num: "02",
    title: "ZK-SecureStorage",
    subtitle: "Zero-knowledge encrypted file sharing — graduation project",
    icon: Shield,
    tags: ["Next.js", "React", "Web Crypto API", "Supabase", "TypeScript"],
    context:
      "Graduation project. Led frontend and UX. The goal: a file-sharing system where the server stores only ciphertext — it never sees plaintext, and key material never leaves the client.",
    challenge:
      "The first prototype stored encrypted files but managed keys server-side, which defeats zero-knowledge entirely. We also had to handle large file encryption without blocking the UI thread.",
    approach:
      "Moved all cryptography into the browser using the Web Crypto API. Keys are derived client-side with PBKDF2 from the user's passphrase. Files are encrypted with AES-256-GCM before upload. Supabase stores only the ciphertext blob. Used Web Workers to keep encryption off the main thread for files >10MB.",
    architecture: [
      { label: "Key Derive", desc: "PBKDF2 from passphrase (client-only)" },
      { label: "Encrypt", desc: "AES-256-GCM via Web Crypto API" },
      { label: "Worker", desc: "Web Worker for non-blocking large files" },
      { label: "Store", desc: "Supabase receives ciphertext only" },
      { label: "Share", desc: "Encrypted link with embedded IV" },
    ],
    codeSnippet: `// Client-side key derivation — key never leaves browser
const keyMaterial = await crypto.subtle.importKey(
  "raw",
  new TextEncoder().encode(passphrase),
  "PBKDF2",
  false,
  ["deriveKey"]
);
const key = await crypto.subtle.deriveKey(
  { name: "PBKDF2", salt, iterations: 310_000, hash: "SHA-256" },
  keyMaterial,
  { name: "AES-GCM", length: 256 },
  false,
  ["encrypt", "decrypt"]
);
const ciphertext = await crypto.subtle.encrypt(
  { name: "AES-GCM", iv },
  key,
  fileBuffer
);`,
    ghostLabel: "Passphrase → PBKDF2 → AES-GCM → Ciphertext → Supabase",
    link: "https://github.com/sack-ali/ZK-SecureStorage",
    color: "#00ff88",
  },
  {
    id: "path",
    num: "03",
    title: "PATH",
    subtitle: "Fairness-aware classification for imbalanced clinical data",
    icon: Cpu,
    tags: ["Python", "scikit-learn", "SMOTE", "ADASYN", "Fairness Metrics"],
    context:
      "Clinical datasets routinely have severe class imbalance — the minority class represents rare but critical outcomes. A model that ignores this will have near-zero recall on exactly the patients who most need to be flagged.",
    challenge:
      "Standard accuracy metrics are deeply misleading here. A classifier that always predicts the majority class scores 95%+ accuracy on a 95:5 split while being useless in practice. The secondary challenge was that some resampling methods introduced fairness violations across demographic subgroups.",
    approach:
      "Systematically evaluated SMOTE, ADASYN, borderline-SMOTE, and random undersampling across multiple clinical datasets. Measured not just F1 and recall, but equalized odds and demographic parity to surface fairness trade-offs. Results showed ADASYN with threshold-moving outperformed pure resampling on minority recall without introducing demographic disparity.",
    architecture: [
      { label: "Baseline", desc: "Majority-class dummy — exposes metric illusion" },
      { label: "Resample", desc: "SMOTE / ADASYN / borderline variants" },
      { label: "Train", desc: "Logistic regression + random forest + SVM" },
      { label: "Evaluate", desc: "F1, recall, equalized odds, dem. parity" },
      { label: "Select", desc: "ADASYN + threshold-moving — best fairness/recall" },
    ],
    codeSnippet: `from imblearn.over_sampling import ADASYN
from sklearn.metrics import classification_report
from fairlearn.metrics import equalized_odds_difference

# Resample training data only (never touch test set)
X_res, y_res = ADASYN(random_state=42).fit_resample(X_train, y_train)

clf.fit(X_res, y_res)
y_pred = clf.predict(X_test)

print(classification_report(y_test, y_pred))
eod = equalized_odds_difference(
    y_test, y_pred, sensitive_features=X_test["subgroup"]
)
print(f"Equalized Odds Difference: {eod:.3f}")`,
    ghostLabel: "Imbalanced Data → ADASYN → Train → Fairness Audit → Select",
    link: "https://github.com/sack-ali/PATH",
    color: "#7b2fff",
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
            <div aria-hidden="true" className="self-center text-[var(--cyan)] opacity-40 shrink-0 mt-1">→</div>
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
        <div aria-hidden="true" className="w-3 h-3 rounded-full bg-red-500/60" />
        <div aria-hidden="true" className="w-3 h-3 rounded-full bg-yellow-500/60" />
        <div aria-hidden="true" className="w-3 h-3 rounded-full bg-green-500/60" />
        <span className="ml-2 font-mono text-xs text-[var(--text-muted)]">snippet.py</span>
      </div>
      <pre className="p-4 font-mono text-xs text-[var(--text-primary)] overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>

      <AnimatePresence>
        {showGhost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "rgba(0,8,20,0.88)", backdropFilter: "blur(4px)" }}
            aria-hidden="true"
          >
            <div className="text-center px-6">
              <div className="w-12 h-12 rounded-full border border-[var(--cyan)] flex items-center justify-center mx-auto mb-3"
                style={{ boxShadow: "0 0 20px rgba(0,245,255,0.3)" }}>
                <Cpu size={20} className="text-[var(--cyan)]" />
              </div>
              <p className="font-mono text-xs text-[var(--cyan)] tracking-widest mb-2 uppercase">Data Flow</p>
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
        <div className="flex items-center gap-3 shrink-0 mt-1">
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${project.title} on GitHub`}
            onClick={(e) => e.stopPropagation()}
            className="text-[var(--text-muted)] hover:text-[var(--cyan)] transition-colors"
          >
            <ExternalLink size={16} />
          </a>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            aria-hidden="true"
          >
            <ChevronDown size={20} className="text-[var(--text-muted)]" />
          </motion.div>
        </div>
      </button>

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
              <div className="pt-6">
                <div className="mb-6">
                  <p className="font-mono text-[10px] tracking-widest text-[var(--cyan)] uppercase mb-2">Context</p>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">{project.context}</p>
                </div>
                <div className="mb-6">
                  <p className="font-mono text-[10px] tracking-widest text-red-400 uppercase mb-2">The Challenge</p>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">{project.challenge}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-widest text-green-400 uppercase mb-2">The Approach</p>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">{project.approach}</p>
                </div>
              </div>

              <div className="pt-6">
                <p className="font-mono text-[10px] tracking-widest text-[var(--cyan)] uppercase mb-2">Architecture Flow</p>
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
            — 03. Projects
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)]">
            Real Work.{" "}
            <span className="gradient-text">Real Trade-offs.</span>
          </h2>
          <p className="mt-4 text-[var(--text-muted)] max-w-xl text-lg">
            Three projects I can talk through end-to-end — the context, the problems, and the decisions behind each one.
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
