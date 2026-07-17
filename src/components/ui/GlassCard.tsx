"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
  animate?: boolean;
}

export default function GlassCard({
  children,
  className = "",
  hover = true,
  delay = 0,
  animate = true,
}: GlassCardProps) {
  const base =
    "glass-panel rounded-2xl p-6" +
    (hover ? " glass-panel-hover cursor-default" : "") +
    ` ${className}`;

  if (!animate) {
    return <div className={base}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={base}
    >
      {children}
    </motion.div>
  );
}
