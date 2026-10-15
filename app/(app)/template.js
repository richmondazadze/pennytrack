"use client";

import { motion } from "framer-motion";

// Re-mounts on every navigation inside the app, giving each page a soft entrance.
export default function AppTemplate({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
