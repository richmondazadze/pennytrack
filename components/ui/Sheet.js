"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { IoClose } from "react-icons/io5";
import useMediaQuery from "@/lib/hooks/useMediaQuery";

// Responsive modal: a bottom sheet on phones (drag down to dismiss), a centred dialog on larger screens.
export default function Sheet({ open, onClose, title, subtitle, children, footer, size = "md" }) {
  const desktop = useMediaQuery("(min-width: 768px)");
  const dragControls = useDragControls();
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => panelRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  const width = size === "lg" ? "md:max-w-2xl" : "md:max-w-lg";

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center md:items-center md:p-6">
          <motion.div
            className="absolute inset-0 bg-n-950/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={typeof title === "string" ? title : undefined}
            tabIndex={-1}
            className={`relative flex max-h-[92svh] w-full flex-col overflow-hidden rounded-t-xl bg-surface shadow-modal outline-none md:max-h-[85vh] md:rounded-xl ${width}`}
            initial={desktop ? { opacity: 0, scale: 0.96, y: 12 } : { y: "100%" }}
            animate={desktop ? { opacity: 1, scale: 1, y: 0 } : { y: 0 }}
            exit={desktop ? { opacity: 0, scale: 0.97, y: 8 } : { y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 380, mass: 0.8 }}
            drag={desktop ? false : "y"}
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) onClose();
            }}
          >
            <div
              className="flex cursor-grab touch-none justify-center pb-1 pt-2.5 md:hidden"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <span className="h-1.5 w-10 rounded-full bg-n-200 dark:bg-n-700" />
            </div>
            {(title || subtitle) && (
              <div
                className="flex items-start justify-between gap-4 px-5 pb-2 pt-2 md:px-7 md:pt-6"
                onPointerDown={(e) => !desktop && dragControls.start(e)}
              >
                <div className="min-w-0">
                  {title && <h2 className="truncate text-h2">{title}</h2>}
                  {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
                </div>
                <button onClick={onClose} className="icon-btn -mr-2 -mt-1 shrink-0" aria-label="Close">
                  <IoClose className="text-xl" />
                </button>
              </div>
            )}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-5 pt-2 md:px-7 md:pb-7">
              {children}
            </div>
            {footer && (
              <div className="border-t border-line px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:px-7">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
