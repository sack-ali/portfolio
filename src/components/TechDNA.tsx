"use client";

import { useRef, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const TechCloud3D = dynamic(() => import("./TechCloud3D"), { ssr: false });

export type TechItem = {
  name: string;
  category: string;
  color: string;
  x: number;
  y: number;
  z: number;
};

const techStack: TechItem[] = [
  // AI/ML
  { name: "PyTorch", category: "AI/ML", color: "#ee4c2c", x: 2, y: 1, z: 0 },
  { name: "LangChain", category: "AI/ML", color: "#00b4d8", x: -2, y: 0.5, z: 1 },
  { name: "FAISS", category: "AI/ML", color: "#00f5ff", x: 1.5, y: -1, z: -1 },
  { name: "OpenAI", category: "AI/ML", color: "#74aa9c", x: -1, y: 1.5, z: 0.5 },
  { name: "SHAP", category: "AI/ML", color: "#ff6b6b", x: 0.5, y: 2, z: -0.5 },
  // Frontend
  { name: "Next.js", category: "Frontend", color: "#e0f4ff", x: -2.5, y: -0.5, z: 0 },
  { name: "React", category: "Frontend", color: "#61dafb", x: 2.5, y: -0.5, z: 1 },
  { name: "Framer", category: "Frontend", color: "#0055ff", x: 0, y: -2, z: 0.5 },
  { name: "TypeScript", category: "Frontend", color: "#3178c6", x: -1.5, y: -1.5, z: -1 },
  { name: "Tailwind", category: "Frontend", color: "#38bdf8", x: 1, y: -2.5, z: 0 },
  // Backend
  { name: "FastAPI", category: "Backend", color: "#059669", x: -0.5, y: 0, z: 2 },
  { name: "Go", category: "Backend", color: "#00add8", x: 0.5, y: 1, z: -2 },
  { name: "Rust", category: "Backend", color: "#f74c00", x: -1.5, y: 0.5, z: -2 },
  { name: "Redis", category: "Backend", color: "#dc382d", x: 1.5, y: 0, z: 2 },
  // Data/DB
  { name: "Neo4j", category: "Data", color: "#018bff", x: 0, y: -1, z: -2 },
  { name: "PostgreSQL", category: "Data", color: "#336791", x: -2, y: -1.5, z: 1 },
  // Security
  { name: "AES-256", category: "Security", color: "#7b2fff", x: 2, y: 1.5, z: 1.5 },
  { name: "WebRTC", category: "Security", color: "#4285f4", x: -1, y: -0.5, z: 2.5 },
];

const categories = ["All", "AI/ML", "Frontend", "Backend", "Data", "Security"];
const categoryColors: Record<string, string> = {
  "AI/ML": "#00f5ff",
  Frontend: "#61dafb",
  Backend: "#059669",
  Data: "#018bff",
  Security: "#7b2fff",
};

export default function TechDNA() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

  const filtered = activeCategory === "All"
    ? techStack
    : techStack.filter((t) => t.category === activeCategory);

  return (
    <section id="dna" className="relative">
      <div className="container mx-auto px-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="font-mono text-xs tracking-[0.4em] text-[var(--cyan)] mb-4 uppercase">
            — 04. Technical DNA
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)]">
            The Stack That{" "}
            <span className="gradient-text">Thinks & Ships</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* 3D Cloud */}
          <div className="h-[420px] relative">
            <TechCloud3D
              items={filtered}
              onHover={setHoveredTech}
              hoveredTech={hoveredTech}
            />
            {/* Hover tooltip */}
            <AnimatePresence>
              {hoveredTech && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 glass rounded-lg px-4 py-2 pointer-events-none"
                >
                  <p className="font-mono text-sm text-[var(--cyan)]">{hoveredTech}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Category filter + list */}
          <div>
            <div className="flex gap-2 flex-wrap mb-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full font-mono text-xs tracking-wider transition-all ${
                    activeCategory === cat
                      ? "glass neon glow-pulse"
                      : "text-[var(--text-muted)] border border-[var(--glass-border)] hover:border-[var(--cyan)]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {filtered.map((tech, i) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="glass rounded-xl p-3 flex items-center gap-3 group cursor-default hover:border-[var(--cyan)] hover:border transition-all"
                  onMouseEnter={() => setHoveredTech(tech.name)}
                  onMouseLeave={() => setHoveredTech(null)}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: tech.color, boxShadow: `0 0 6px ${tech.color}80` }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {tech.name}
                    </p>
                    <p className="text-[10px] font-mono text-[var(--text-muted)]">
                      {tech.category}
                    </p>
                  </div>
                  <div
                    className="ml-auto w-1 h-6 rounded-full opacity-40 group-hover:opacity-100 transition-opacity"
                    style={{ background: categoryColors[tech.category] ?? "#00f5ff" }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
