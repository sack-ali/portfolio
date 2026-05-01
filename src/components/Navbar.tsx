"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const links = [
  { label: "Statement", href: "#statement" },
  { label: "Projects", href: "#archaeology" },
  { label: "Stack", href: "#dna" },
  { label: "Research", href: "#depth" },
  { label: "Contact", href: "#terminal" },
];

export default function Navbar() {
  const [active, setActive] = useState("");
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 80], ["rgba(0,8,20,0)", "rgba(0,8,20,0.9)"]);
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 1]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { threshold: 0.4 }
    );
    links.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <motion.nav
      style={{ backgroundColor: bg }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
    >
      <motion.div
        style={{
          opacity: borderOpacity,
          background: "linear-gradient(90deg, transparent, rgba(0,245,255,0.3), transparent)",
        }}
        className="absolute bottom-0 left-0 right-0 h-px"
      />
      <a href="#statement" className="font-mono text-sm neon tracking-widest">
        SHA<span className="text-[var(--text-muted)]">.dev</span>
      </a>
      <ul className="flex gap-8">
        {links.map(({ label, href }) => (
          <li key={href}>
            <a
              href={href}
              className={`text-xs font-mono tracking-widest uppercase transition-all duration-300 ${
                active === href.slice(1)
                  ? "neon"
                  : "text-[var(--text-muted)] hover:text-[var(--cyan)]"
              }`}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </motion.nav>
  );
}
