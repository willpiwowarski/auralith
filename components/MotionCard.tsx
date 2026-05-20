"use client";

import { motion } from "framer-motion";

type MotionCardProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export default function MotionCard({
  children,
  className = "",
  delay = 0,
}: MotionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay }}
      whileHover={{ y: -4, scale: 1.01, transition: { duration: 0.06 } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}