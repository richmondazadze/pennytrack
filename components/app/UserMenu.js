"use client";

import { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { LuLogOut, LuSettings, LuDownload } from "react-icons/lu";
import { authContext } from "@/lib/store/auth-context";
import { useDownloadReport } from "./hooks";

export function Avatar({ user, className = "h-11 w-11" }) {
  const initial = (user?.displayName || user?.email || "?").charAt(0).toUpperCase();
  return (
    <span className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-lime font-bold text-forest ${className}`}>
      {user?.photoURL ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={user.photoURL} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
      ) : (
        initial
      )}
    </span>
  );
}

export default function UserMenu() {
  const { user, logout } = useContext(authContext);
  const download = useDownloadReport();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const esc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="rounded-full transition hover:ring-4 hover:ring-line active:scale-95"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
      >
        <Avatar user={user} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 top-14 z-50 w-64 origin-top-right rounded-lg border border-line bg-surface p-2 shadow-overlay"
          >
            <div className="px-3 py-2.5">
              <div className="truncate font-semibold">{user?.displayName}</div>
              <div className="truncate text-sm text-muted">{user?.email}</div>
            </div>
            <div className="my-1 h-px bg-line" />
            <button onClick={() => { setOpen(false); download(); }} className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-semibold hover:bg-sunken" role="menuitem">
              <LuDownload className="text-muted" /> Download report
            </button>
            <Link href="/settings" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-semibold hover:bg-sunken" role="menuitem">
              <LuSettings className="text-muted" /> Settings
            </Link>
            <button onClick={logout} className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-semibold text-expense hover:bg-expense/10" role="menuitem">
              <LuLogOut /> Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
