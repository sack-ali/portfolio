"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Line = { type: "input" | "output" | "error" | "system"; content: string };

const PROJECTS = [
  "graphrag-engine/       — GraphRAG knowledge retrieval system",
  "cnn-xai/              — Explainable AI for medical imaging",
  "secfile/              — Zero-knowledge encrypted file transfer",
  "task-orchestrator/    — Distributed fault-tolerant job queue",
];

const HELP_TEXT = [
  "Available commands:",
  "  ls projects         — List all projects",
  "  ls research         — List research papers",
  "  cat about           — About Sakarie Hussein Ali",
  "  contact --send      — Open contact form",
  "  whoami              — Identity query",
  "  clear               — Clear terminal",
  "  skills              — List tech stack",
  "  help                — Show this menu",
];

const ABOUT = [
  "Name:     Sakarie Hussein Ali",
  "Role:     AI/ML Engineer · Security Researcher · Full-Stack Architect",
  "Location: Available Remotely / Relocation",
  "Focus:    GraphRAG · Cybersecurity · Intelligent Systems",
  "Status:   Actively seeking 2026 roles",
  "",
  "I build systems that think, protect, and scale.",
  "Ask me anything — or just type `contact --send`.",
];

const RESEARCH = [
  "research/",
  "  ├── gmm-density-smote.pdf          (IEEE ICML Workshop 2024)",
  "  ├── graphrag-comparative-study.pdf  (ACL Findings 2025)",
  "  └── crypto-formal-verification.pdf  (IEEE S&P 2025)",
];

const SKILLS = [
  "AI/ML:      PyTorch · LangChain · FAISS · OpenAI · SHAP · GradCAM",
  "Frontend:   Next.js 15 · React · TypeScript · Framer Motion · Tailwind",
  "Backend:    FastAPI · Go · Rust · Redis · gRPC · Docker",
  "Data:       Neo4j · PostgreSQL · Pandas · NumPy",
  "Security:   AES-256-GCM · Ed25519 · X25519 · ProVerif · STRIDE",
  "DevOps:     Prometheus · Grafana · GitHub Actions · AWS",
];

function processCommand(input: string): Line[] {
  const cmd = input.trim().toLowerCase();
  const lines: Line[] = [{ type: "input", content: `sakarie@portfolio:~$ ${input}` }];

  if (cmd === "ls projects" || cmd === "ls projects/") {
    lines.push({ type: "system", content: "projects/" });
    PROJECTS.forEach((p) => lines.push({ type: "output", content: `  ${p}` }));
  } else if (cmd === "ls research" || cmd === "ls research/") {
    RESEARCH.forEach((r) => lines.push({ type: "output", content: r }));
  } else if (cmd === "cat about" || cmd === "cat about.txt") {
    ABOUT.forEach((a) => lines.push({ type: "output", content: a }));
  } else if (cmd === "contact --send") {
    lines.push({ type: "system", content: "Opening contact protocol..." });
    lines.push({ type: "output", content: "Email:    zackhusein894@gmail.com" });
    lines.push({ type: "output", content: "LinkedIn: linkedin.com/in/sakarie-h-ali-477963186" });
    lines.push({ type: "output", content: "GitHub:   github.com/sack-ali" });
    lines.push({ type: "system", content: "✓ Contact info loaded. Reach out anytime." });
  } else if (cmd === "whoami") {
    lines.push({ type: "output", content: "sakarie-hussein-ali — AI/ML Engineer & Security Researcher" });
    lines.push({ type: "output", content: 'uid=2026(engineer) gid=0(root) groups=0(AI),1(Security),2(Frontend)' });
  } else if (cmd === "skills") {
    SKILLS.forEach((s) => lines.push({ type: "output", content: s }));
  } else if (cmd === "help" || cmd === "?") {
    HELP_TEXT.forEach((h) => lines.push({ type: "output", content: h }));
  } else if (cmd === "clear") {
    return [{ type: "system", content: "__CLEAR__" }];
  } else if (cmd === "") {
    // empty input
  } else if (cmd === "ls") {
    lines.push({ type: "output", content: "projects/  research/  about.txt  skills.json  contact.sh" });
  } else if (cmd === "pwd") {
    lines.push({ type: "output", content: "/home/zakeriya/portfolio" });
  } else if (cmd.startsWith("cd")) {
    lines.push({ type: "output", content: `Changed directory to ${cmd.slice(3) || "~"}` });
  } else if (cmd === "sudo rm -rf /") {
    lines.push({ type: "error", content: "Permission denied: nice try 😄" });
  } else {
    lines.push({ type: "error", content: `command not found: ${input.trim()}. Type 'help' for available commands.` });
  }

  return lines;
}

const INITIAL_LINES: Line[] = [
  { type: "system", content: "ARIA Terminal v2.0.26 — Sakarie Hussein Ali Portfolio" },
  { type: "system", content: '────────────────────────────────────────────' },
  { type: "output", content: 'Type `help` to see available commands.' },
  { type: "output", content: 'Try: ls projects · cat about · contact --send' },
  { type: "system", content: "" },
];

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>(INITIAL_LINES);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIndex, setHistIndex] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const submit = () => {
    if (!input.trim() && input !== "") {
      setLines((l) => [...l, { type: "input", content: `sakarie@portfolio:~$ ` }]);
      setInput("");
      return;
    }
    const result = processCommand(input);
    if (result[0]?.content === "__CLEAR__") {
      setLines(INITIAL_LINES);
    } else {
      setLines((l) => [...l, ...result]);
    }
    if (input.trim()) {
      setHistory((h) => [input.trim(), ...h].slice(0, 50));
    }
    setHistIndex(-1);
    setInput("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      submit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIndex = Math.min(histIndex + 1, history.length - 1);
      setHistIndex(newIndex);
      setInput(history[newIndex] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIndex = Math.max(histIndex - 1, -1);
      setHistIndex(newIndex);
      setInput(newIndex === -1 ? "" : history[newIndex] ?? "");
    }
  };

  const lineColor = (type: Line["type"]) => {
    switch (type) {
      case "input": return "text-[var(--cyan)]";
      case "system": return "text-[var(--text-muted)]";
      case "error": return "text-red-400";
      default: return "text-[var(--text-primary)]";
    }
  };

  return (
    <section id="terminal" className="relative pb-0">
      <div className="container mx-auto px-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="font-mono text-xs tracking-[0.4em] text-[var(--cyan)] mb-4 uppercase">
            — 06. Contact
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)]">
            Let's <span className="gradient-text">Talk in Code</span>
          </h2>
          <p className="mt-4 text-[var(--text-muted)] max-w-xl text-lg">
            A functional terminal. Type real commands. Start with{" "}
            <span className="font-mono neon text-sm">contact --send</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          className="glass rounded-2xl overflow-hidden"
          style={{ boxShadow: "0 0 40px rgba(0,245,255,0.08)" }}
        >
          {/* Title bar */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-[var(--glass-border)] bg-[rgba(0,8,20,0.5)]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <span className="ml-2 font-mono text-xs text-[var(--text-muted)]">
              aria-terminal — sakarie@portfolio
            </span>
          </div>

          {/* Output */}
          <div
            role="log"
            aria-label="Terminal output"
            aria-live="polite"
            aria-atomic="false"
            className="p-5 h-80 overflow-y-auto font-mono text-sm leading-relaxed cursor-text"
            onClick={() => inputRef.current?.focus()}
          >
            <AnimatePresence initial={false}>
              {lines.map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                  className={`${lineColor(line.type)} whitespace-pre-wrap break-all`}
                >
                  {line.content}
                </motion.p>
              ))}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>

          {/* Input row */}
          <div className="flex items-center gap-2 px-5 py-3 border-t border-[var(--glass-border)] bg-[rgba(0,8,20,0.3)]">
            <span className="font-mono text-sm text-[var(--cyan)] shrink-0">
              sakarie@portfolio:~$
            </span>
            <label htmlFor="terminal-input" className="sr-only">
              Terminal command input
            </label>
            <input
              id="terminal-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              className="flex-1 bg-transparent font-mono text-sm text-[var(--text-primary)] outline-none caret-[var(--cyan)]"
              spellCheck={false}
              autoComplete="off"
              autoFocus
              placeholder="type a command..."
              aria-label="Terminal command input. Type help for available commands."
            />
            <span aria-hidden="true" className="cursor-blink text-[var(--cyan)] font-mono">▋</span>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-[var(--glass-border)] py-10" aria-label="Site footer">
        <div className="container mx-auto px-8 max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <p className="font-mono text-xs text-[var(--text-muted)]">
            © 2026 <span className="text-[var(--text-primary)]">@Sakarie Hussein Ali</span>
          </p>

          {/* Lighthouse badge */}
          <div
            className="flex items-center gap-3 glass rounded-xl px-4 py-2"
            role="img"
            aria-label="Lighthouse Accessibility score: 100 out of 100"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden="true" focusable="false">
              <path
                d="M12 2L8.5 8.5H2l5.25 4.25L5 20l7-4.5L19 20l-2.25-7.25L22 8.5h-6.5L12 2z"
                fill="#00f5ff"
                stroke="#00f5ff"
                strokeWidth="0.5"
              />
            </svg>
            <div className="flex flex-col leading-none">
              <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Lighthouse</span>
              <span className="font-mono text-sm font-bold text-[var(--cyan)]">
                100 <span className="text-[10px] font-normal text-[var(--text-muted)]">/ 100 Accessibility</span>
              </span>
            </div>
          </div>

          {/* Social links */}
          <nav aria-label="Social links" className="flex gap-6">
            <a
              href="https://github.com/sack-ali"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--cyan)] transition-colors"
              aria-label="Sakarie's GitHub profile"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/sakarie-h-ali-477963186/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--cyan)] transition-colors"
              aria-label="Sakarie's LinkedIn profile"
            >
              LinkedIn
            </a>
            <a
              href="mailto:zackhusein894@gmail.com"
              className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--cyan)] transition-colors"
              aria-label="Email Sakarie Hussein Ali"
            >
              Email
            </a>
          </nav>
        </div>
      </footer>
    </section>
  );
}
