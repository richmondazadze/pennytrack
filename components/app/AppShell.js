"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LuPlus, LuArrowUpRight, LuArrowDownLeft, LuLogOut } from "react-icons/lu";
import Logo, { AppIcon } from "@/components/brand/Logo";
import { authContext } from "@/lib/store/auth-context";
import { useApplyTheme } from "@/lib/store/theme-context";
import { QuickActionsProvider, useQuickActions } from "./QuickActions";
import { SIDEBAR_ITEMS, TAB_ITEMS } from "./nav-items";
import { useDownloadReport } from "./hooks";
import { Avatar } from "./UserMenu";

export function Splash() {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-canvas">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: [1, 1.06, 1] }}
        transition={{ opacity: { duration: 0.3 }, scale: { duration: 1.4, repeat: Infinity, ease: "easeInOut" } }}
      >
        <AppIcon className="h-16 w-16" />
      </motion.div>
    </div>
  );
}

function isActive(pathname, href) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Sidebar() {
  const pathname = usePathname();
  const download = useDownloadReport();
  const { user, logout } = useContext(authContext);
  const month = new Date().toLocaleDateString("en-GB", { month: "long" });

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[84px] flex-col border-r border-line bg-surface px-3 py-6 md:flex xl:w-[248px] xl:px-5">
      <Link href="/dashboard" className="mb-8 flex justify-center px-1 xl:justify-start" aria-label="PennyTrack dashboard">
        <span className="xl:hidden"><AppIcon className="h-10 w-10" /></span>
        <Logo className="hidden xl:inline-flex" />
      </Link>

      <nav className="flex flex-col gap-1">
        {SIDEBAR_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={`relative flex h-12 items-center justify-center gap-3 rounded-md px-3.5 text-[15px] font-semibold transition-colors xl:justify-start ${
                active ? "text-white dark:text-forest" : "text-muted hover:bg-sunken hover:text-fg"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-md bg-forest dark:bg-lime"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
              <Icon className={`relative text-xl ${active ? "text-lime dark:text-forest" : ""}`} />
              <span className="relative hidden xl:inline">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="hidden rounded-lg bg-lime p-4 text-forest xl:block">
          <div className="font-bold">Monthly report</div>
          <p className="mt-0.5 text-sm text-forest/80">Your {month} PDF is ready.</p>
          <button onClick={download} className="btn btn-sm btn-forest mt-3">
            Download
          </button>
        </div>
        <div className="flex items-center justify-center gap-3 xl:justify-start xl:px-1">
          <Link href="/settings" title="Settings"><Avatar user={user} className="h-10 w-10" /></Link>
          <div className="hidden min-w-0 flex-1 xl:block">
            <div className="truncate text-sm font-semibold">{user?.displayName}</div>
            <div className="truncate text-xs text-muted">{user?.email}</div>
          </div>
          <button onClick={logout} className="icon-btn hidden xl:inline-flex" aria-label="Sign out" title="Sign out">
            <LuLogOut />
          </button>
        </div>
      </div>
    </aside>
  );
}

function MobileTabs() {
  const pathname = usePathname();
  const { addExpense, addIncome } = useQuickActions();
  const [menu, setMenu] = useState(false);

  useEffect(() => setMenu(false), [pathname]);

  return (
    <>
      <AnimatePresence>
        {menu && (
          <motion.div
            className="fixed inset-0 z-40 bg-n-950/30 backdrop-blur-[2px] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenu(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {menu && (
          <motion.div
            className="fixed inset-x-0 bottom-[calc(96px+env(safe-area-inset-bottom))] z-50 flex justify-center gap-3 px-4 md:hidden"
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
          >
            {[
              { label: "Add expense", icon: LuArrowUpRight, action: () => addExpense(), cls: "bg-forest text-white" },
              { label: "Add income", icon: LuArrowDownLeft, action: addIncome, cls: "bg-lime text-forest" },
            ].map(({ label, icon: Icon, action, cls }) => (
              <motion.button
                key={label}
                variants={{ hidden: { opacity: 0, y: 16, scale: 0.9 }, show: { opacity: 1, y: 0, scale: 1 } }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                onClick={() => {
                  setMenu(false);
                  action();
                }}
                className={`flex h-14 items-center gap-2 rounded-full px-5 font-semibold shadow-overlay ${cls}`}
              >
                <Icon className="text-lg" /> {label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
        <div className="mx-auto grid h-[68px] max-w-md grid-cols-5 items-center">
          {TAB_ITEMS.map((item) => {
            if (!item) {
              return (
                <div key="fab" className="flex justify-center">
                  <motion.button
                    onClick={() => setMenu((m) => !m)}
                    whileTap={{ scale: 0.9 }}
                    animate={{ rotate: menu ? 45 : 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                    className="-mt-9 flex h-14 w-14 items-center justify-center rounded-full bg-lime text-forest shadow-fab"
                    aria-label={menu ? "Close quick add" : "Quick add"}
                    aria-expanded={menu}
                  >
                    <LuPlus className="text-2xl" strokeWidth={2.5} />
                  </motion.button>
                </div>
              );
            }
            const { href, label, icon: Icon } = item;
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={`relative flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors ${
                  active ? "text-forest dark:text-lime" : "text-n-400"
                }`}
              >
                <Icon className="text-[22px]" />
                {label}
                {active && (
                  <motion.span
                    layoutId="tab-active"
                    className="absolute -top-2.5 h-1 w-6 rounded-full bg-forest dark:bg-lime"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

export default function AppShell({ children }) {
  const { user, loading } = useContext(authContext);
  const router = useRouter();
  useApplyTheme();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) return <Splash />;

  return (
    <QuickActionsProvider>
      <Sidebar />
      <div className="min-h-screen pb-28 md:pb-10 md:pl-[84px] xl:pl-[248px]">
        <div className="mx-auto w-full max-w-[1200px] px-4 pt-5 md:px-8 md:pt-8">{children}</div>
      </div>
      <MobileTabs />
    </QuickActionsProvider>
  );
}
