import Link from "next/link";
import { Cpu } from "lucide-react";

const learnLinks = [
  { name: "History of AI", href: "/history" },
  { name: "AI Foundations", href: "/foundations" },
  { name: "Coding Assistants", href: "/coding-assistants" },
  { name: "The Future", href: "/future" },
];

const toolLinks = [
  { name: "AI Playground", href: "/playground" },
  { name: "Code Tools", href: "/code-tools" },
  { name: "Prompt Lab", href: "/prompt-lab" },
  { name: "AI Comparison", href: "/comparison" },
  { name: "Quiz", href: "/quiz" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background py-12 md:py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
        {/* Brand */}
        <div className="space-y-4 col-span-1 md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-accent-secondary to-accent-primary p-px">
              <div className="w-full h-full bg-background rounded-[7px] flex items-center justify-center">
                <Cpu className="w-4 h-4 text-accent-primary" />
              </div>
            </div>
            <span className="font-display font-bold text-base tracking-wider bg-clip-text text-transparent bg-linear-to-r from-white to-text-muted">
              SYNAPSE
            </span>
          </div>
          <p className="text-text-muted text-xs md:text-sm leading-relaxed max-w-sm">
            An interactive educational AI portal exploring the history, science, and future of artificial intelligence and coding assistants.
          </p>
        </div>

        {/* Learn */}
        <div>
          <h4 className="font-display font-semibold text-xs text-white uppercase tracking-wider mb-4">
            Learn
          </h4>
          <ul className="space-y-2 text-xs text-text-muted">
            {learnLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white transition-colors">
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* AI Tools */}
        <div>
          <h4 className="font-display font-semibold text-xs text-white uppercase tracking-wider mb-4">
            AI Tools
          </h4>
          <ul className="space-y-2 text-xs text-text-muted">
            {toolLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white transition-colors">
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 text-center md:text-left flex flex-col md:flex-row justify-between text-xs text-text-muted">
        <p>&copy; {new Date().getFullYear()} Synapse. Created for educational purposes.</p>
        <p className="mt-2 md:mt-0">
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
          {" · "}
          <Link href="/future" className="hover:text-white transition-colors">Future</Link>
          {" · "}
          <Link href="/quiz" className="hover:text-white transition-colors">Quiz</Link>
        </p>
      </div>

      {/* Ambient glow */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-80 h-40 bg-accent-secondary/5 rounded-full blur-3xl pointer-events-none" />
    </footer>
  );
}
