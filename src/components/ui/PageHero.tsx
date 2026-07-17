"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface PageHeroProps {
  badge?: string;
  title: string;
  highlight?: string;
  subtitle: string;
  icon?: LucideIcon;
}

export default function PageHero({
  badge,
  title,
  highlight,
  subtitle,
  icon: Icon,
}: PageHeroProps) {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
      {/* Background gradients matching existing design */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-linear-to-b from-accent-secondary/10 via-background/0 to-background pointer-events-none" />
      <div className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-accent-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-5%] w-[300px] h-[300px] rounded-full bg-accent-secondary/5 blur-[80px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-size-[4rem_4rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 text-center space-y-6 relative z-10">
        {badge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10"
          >
            {Icon && <Icon className="w-4 h-4 text-accent-primary" />}
            <span className="text-xs font-semibold tracking-wider text-text-muted uppercase">
              {badge}
            </span>
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display font-bold text-4xl sm:text-5xl md:text-7xl tracking-tight leading-[1.05] max-w-4xl mx-auto bg-clip-text text-transparent bg-linear-to-b from-white via-white to-text-muted/50"
        >
          {title}{" "}
          {highlight && (
            <span className="bg-clip-text text-transparent bg-linear-to-r from-accent-primary via-accent-secondary to-accent-primary bg-size-[200%] animate-pulse-slow">
              {highlight}
            </span>
          )}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-text-muted text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          {subtitle}
        </motion.p>
      </div>
    </section>
  );
}
