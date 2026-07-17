"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { Cpu, Terminal, Menu, X, ChevronDown, BookOpen, Wrench, Tv } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const learnLinks = [
  { name: "History of AI", href: "/history" },
  { name: "AI Foundations", href: "/foundations" },
  { name: "Coding Assistants", href: "/coding-assistants" },
];

const toolLinks = [
  { name: "AI Code Playground", href: "/ai-playground" },
  { name: "AI Playground", href: "/playground" },
  { name: "Code Tools", href: "/code-tools" },
  { name: "Prompt Lab", href: "/prompt-lab" },
  { name: "Find Your AI", href: "/find-ai" },
  { name: "AI Comparison", href: "/comparison" },
  { name: "Quiz", href: "/quiz" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const pathname = usePathname();
  const [projectorMode, setProjectorMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("projectorMode") === "true";
    setProjectorMode(saved);
    if (saved) {
      document.documentElement.classList.add("projector-mode");
    }
  }, []);

  const toggleProjectorMode = () => {
    const next = !projectorMode;
    setProjectorMode(next);
    localStorage.setItem("projectorMode", String(next));
    if (next) {
      document.documentElement.classList.add("projector-mode");
    } else {
      document.documentElement.classList.remove("projector-mode");
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-3 bg-background/80 backdrop-blur-md border-b border-white/5"
          : "py-5 bg-transparent"
      }`}
      onMouseLeave={() => setActiveDropdown(null)}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-linear-to-tr from-accent-secondary to-accent-primary p-px group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-background rounded-[7px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-accent-primary group-hover:text-white transition-colors duration-300" />
            </div>
          </div>
          <span className="font-display font-bold text-lg tracking-wider bg-clip-text text-transparent bg-linear-to-r from-white to-text-muted">
            SYNAPSE
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {/* Home */}
          <Link
            href="/"
            className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors duration-200 ${
              isActive("/") ? "text-white bg-white/8" : "text-text-muted hover:text-white hover:bg-white/5"
            }`}
          >
            Home
          </Link>

          {/* Learn Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("learn")}
          >
            <button
              className={`flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-lg transition-colors duration-200 ${
                learnLinks.some((l) => isActive(l.href))
                  ? "text-white bg-white/8"
                  : "text-text-muted hover:text-white hover:bg-white/5"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Learn
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === "learn" ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {activeDropdown === "learn" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-1 w-48 glass-panel rounded-xl overflow-hidden"
                >
                  {learnLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block px-4 py-2.5 text-sm transition-colors duration-200 ${
                        isActive(link.href)
                          ? "text-accent-primary bg-accent-primary/10"
                          : "text-text-muted hover:text-white hover:bg-white/8"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* AI Tools Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("tools")}
          >
            <button
              className={`flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-lg transition-colors duration-200 ${
                toolLinks.some((l) => isActive(l.href))
                  ? "text-white bg-white/8"
                  : "text-text-muted hover:text-white hover:bg-white/5"
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              AI Tools
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === "tools" ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {activeDropdown === "tools" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-1 w-48 glass-panel rounded-xl overflow-hidden"
                >
                  {toolLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block px-4 py-2.5 text-sm transition-colors duration-200 ${
                        isActive(link.href)
                          ? "text-accent-primary bg-accent-primary/10"
                          : "text-text-muted hover:text-white hover:bg-white/8"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Future / About */}
          <Link
            href="/future"
            className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors duration-200 ${
              isActive("/future") ? "text-white bg-white/8" : "text-text-muted hover:text-white hover:bg-white/5"
            }`}
          >
            Future
          </Link>

          <Link
            href="/about"
            className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors duration-200 ${
              isActive("/about") ? "text-white bg-white/8" : "text-text-muted hover:text-white hover:bg-white/5"
            }`}
          >
            About
          </Link>

          {/* Projector Mode Toggle */}
          <button
            onClick={toggleProjectorMode}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition-all duration-300 ${
              projectorMode 
                ? "bg-accent-primary/20 border-accent-primary/50 text-accent-primary shadow-[0_0_15px_rgba(110,231,255,0.25)]" 
                : "bg-white/5 border-white/10 text-text-muted hover:text-white"
            }`}
            title="Toggle Projector Mode (High Contrast & Large Text)"
          >
            <Tv className="w-3.5 h-3.5" />
            {projectorMode ? "Projector On" : "Projector Mode"}
          </button>

          {/* CTA */}
          <Link
            href="/ai-playground"
            className="ml-3 px-4 py-2 rounded-full text-xs font-semibold bg-accent-secondary hover:bg-accent-secondary/80 text-white transition-all duration-300 shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] flex items-center gap-1.5"
          >
            <Terminal className="w-3.5 h-3.5" />
            Try AI
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 text-white hover:text-accent-primary transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-background/95 border-b border-white/5 backdrop-blur-lg py-4 px-6 flex flex-col gap-1"
          >
            <Link href="/" className="py-2 text-sm text-text-muted hover:text-white transition-colors border-b border-white/5 pb-3 mb-1">
              Home
            </Link>
            <p className="text-xs text-accent-primary font-semibold uppercase tracking-wider py-1">Learn</p>
            {learnLinks.map((l) => (
              <Link key={l.href} href={l.href} className="py-2 pl-3 text-sm text-text-muted hover:text-white transition-colors">
                {l.name}
              </Link>
            ))}
            <p className="text-xs text-accent-primary font-semibold uppercase tracking-wider py-1 mt-2">AI Tools</p>
            {toolLinks.map((l) => (
              <Link key={l.href} href={l.href} className="py-2 pl-3 text-sm text-text-muted hover:text-white transition-colors">
                {l.name}
              </Link>
            ))}
            <Link href="/future" className="py-2 text-sm text-text-muted hover:text-white transition-colors border-t border-white/5 mt-1 pt-3">Future</Link>
            <Link href="/about" className="py-2 text-sm text-text-muted hover:text-white transition-colors">About</Link>
            <button
              onClick={toggleProjectorMode}
              className={`w-full py-2.5 rounded-full text-sm font-semibold border flex items-center justify-center gap-1.5 transition-all duration-300 mt-2 ${
                projectorMode 
                  ? "bg-accent-primary/20 border-accent-primary/50 text-accent-primary shadow-[0_0_15px_rgba(110,231,255,0.25)]" 
                  : "bg-white/5 border-white/10 text-text-muted hover:text-white"
              }`}
            >
              <Tv className="w-4 h-4" />
              {projectorMode ? "Projector Mode: On" : "Projector Mode: Off"}
            </button>
            <Link href="/ai-playground" className="mt-3 w-full text-center px-4 py-3 rounded-full text-sm font-semibold bg-accent-secondary text-white flex items-center justify-center gap-1.5">
              <Terminal className="w-4 h-4" />
              Try AI Code Playground
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reading Progress */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-linear-to-r from-accent-primary to-accent-secondary origin-left"
        style={{ scaleX }}
      />
    </header>
  );
}
