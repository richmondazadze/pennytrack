"use client";

import { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  LuArrowRight,
  LuChevronDown,
  LuMenu,
  LuPieChart,
  LuReceipt,
  LuShapes,
  LuShieldCheck,
  LuSmartphone,
  LuX,
} from "react-icons/lu";
import Logo, { Symbol } from "@/components/brand/Logo";
import Reveal, { fadeUp, stagger } from "@/components/ui/Reveal";
import LegalSheet from "@/components/legal/LegalSheet";
import { authContext } from "@/lib/store/auth-context";
import { currencies } from "@/lib/store/currencies";
import { CATEGORY_PRESETS } from "@/lib/finance";
import { CategoryIcon } from "@/lib/category-icons";
import {
  AddExpenseMock,
  CategoryList,
  CurrencyMock,
  DashboardMock,
  PhoneMock,
  ReportMock,
  SvgDonut,
  ToastMock,
  TxList,
} from "./Mocks";

const NAV = [
  { href: "#features", label: "Features" },
  { href: "#how", label: "How it works" },
  { href: "#faq", label: "FAQ" },
];

/* ───────────────────────── Header ───────────────────────── */

function Header() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 12));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled || open ? "border-b border-n-100 bg-white/80 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1200px] items-center gap-8 px-4 md:px-8">
        <Link href="/" aria-label="PennyTrack home" className="text-n-900">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="rounded-full px-4 py-2 text-[15px] font-semibold text-n-600 transition hover:bg-n-50 hover:text-n-900">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto hidden items-center gap-2 md:flex">
          <Link href="/login" className="btn text-n-900 hover:bg-n-50">Sign in</Link>
          <Link href="/login" className="btn btn-forest">Get started</Link>
        </div>
        <button
          className="ml-auto flex h-11 w-11 items-center justify-center rounded-full text-n-900 hover:bg-n-50 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <LuX className="text-2xl" /> : <LuMenu className="text-2xl" />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "calc(100svh - 72px)", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden bg-white md:hidden"
          >
            <motion.div className="flex h-full flex-col px-4 pb-8 pt-4" variants={stagger} initial="hidden" animate="show">
              {NAV.map((n) => (
                <motion.a
                  key={n.href}
                  variants={fadeUp}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-n-100 py-5 text-2xl font-bold text-n-900"
                >
                  {n.label}
                </motion.a>
              ))}
              <motion.div variants={fadeUp} className="mt-auto grid gap-3">
                <Link href="/login" className="btn btn-lg btn-forest w-full">Get started</Link>
                <Link href="/login" className="btn btn-lg w-full border border-n-200 text-n-900">Sign in</Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ───────────────────────── Hero ───────────────────────── */

function Hero() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const rotateX = useTransform(scrollYProgress, [0, 0.5], reduce ? [0, 0] : [14, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], reduce ? [1, 1] : [0.92, 1]);
  const floatY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -80]);

  return (
    <section ref={ref} className="relative overflow-hidden pb-16 pt-10 md:pb-28 md:pt-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(200,242,80,.35),transparent_70%)]" />
      <div className="mx-auto max-w-[1200px] px-4 text-center md:px-8">
        <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col items-center">
          <motion.a
            variants={fadeUp}
            href="#features"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-n-100 bg-white py-1.5 pl-1.5 pr-4 text-[13px] font-semibold text-n-700 shadow-raised transition hover:border-n-200"
          >
            <span className="rounded-full bg-lime px-2.5 py-0.5 text-forest">New</span>
            A calmer, clearer PennyTrack
            <LuArrowRight />
          </motion.a>
          <motion.h1
            variants={fadeUp}
            className="max-w-4xl text-[44px] font-bold leading-[1.02] tracking-[-0.035em] text-n-900 sm:text-[64px] md:text-[80px]"
          >
            Every pesewa,
            <br />
            <span className="relative inline-block text-forest">
              accounted for
              <motion.svg
                viewBox="0 0 300 16"
                className="absolute -bottom-2 left-0 h-3 w-full md:-bottom-3 md:h-4"
                preserveAspectRatio="none"
                aria-hidden
              >
                <motion.path
                  d="M2 11 C 80 3, 220 3, 298 9"
                  fill="none"
                  stroke="#C8F250"
                  strokeWidth="6"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                />
              </motion.svg>
            </span>
            <span className="text-lime-600">.</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-7 max-w-xl text-[17px] leading-relaxed text-n-500 md:text-xl">
            Record income and expenses, see where your money goes, and download a clean report. All in one calm app.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-9 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <Link href="/login" className="btn btn-lg btn-forest group">
              Start tracking free
              <LuArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
            <a href="#how" className="btn btn-lg border border-n-200 bg-white text-n-900 hover:border-n-300">
              See how it works
            </a>
          </motion.div>
          <motion.p variants={fadeUp} className="mt-5 flex items-center gap-2 text-sm text-n-500">
            <LuShieldCheck className="text-forest-600" /> Free to use. Sign in with Google in one tap.
          </motion.p>
        </motion.div>

        <div className="relative mx-auto mt-14 max-w-[1080px] md:mt-20" style={{ perspective: 1600 }}>
          <motion.div
            style={{ rotateX, scale, transformOrigin: "50% 0%" }}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="hidden text-left sm:block"
          >
            <DashboardMock />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center text-left sm:hidden"
          >
            <PhoneMock />
          </motion.div>

          <motion.div style={{ y: floatY }} className="pointer-events-none absolute -left-6 top-[38%] hidden lg:block">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <ToastMock className="animate-float" />
            </motion.div>
          </motion.div>
          <motion.div style={{ y: floatY }} className="pointer-events-none absolute -right-8 top-[18%] hidden lg:block">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="animate-float rounded-[20px] border border-n-100 bg-white p-4 text-left shadow-overlay [animation-delay:1.5s]"
            >
              <div className="text-[11px] font-semibold text-n-500">This week</div>
              <div className="figure text-xl font-bold text-n-900">−₵342.00</div>
              <div className="mt-3 flex h-10 items-end gap-1.5">
                {[40, 64, 28, 100, 52, 36, 70].map((h, i) => (
                  <motion.span
                    key={i}
                    className="w-3 rounded-full bg-forest"
                    initial={{ height: 4 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 1.5 + i * 0.05, duration: 0.5 }}
                    style={{ opacity: i === 3 ? 1 : 0.25 }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Marquee ───────────────────────── */

function CurrencyMarquee() {
  const items = [...currencies, ...currencies];
  return (
    <section className="border-y border-n-100 bg-white py-6" aria-label="Supported currencies">
      <p className="mb-4 text-center text-sm font-semibold text-n-500">Show your money in the currency you think in</p>
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="flex w-max animate-marquee gap-3 hover:[animation-play-state:paused]">
          {items.map((c, i) => (
            <span key={i} className="inline-flex items-center gap-2 rounded-full bg-n-50 px-4 py-2 text-sm font-semibold text-n-700">
              <span className="amount font-bold text-forest">{c.code}</span>
              {c.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Intro + pillars ───────────────────────── */

const PILLARS = [
  {
    key: "track",
    label: "Track",
    icon: LuReceipt,
    title: "Log it in seconds",
    body: "Type an amount, tap a category, done. Income and expenses land in one list, newest first.",
    visual: <AddExpenseMock />,
  },
  {
    key: "categorize",
    label: "Categorize",
    icon: LuShapes,
    title: "Colour means category",
    body: "Each category owns one colour across the list, the chart and the report, so you can read your spending at a glance.",
    visual: (
      <div className="w-full max-w-[400px] rounded-[28px] bg-white p-6 shadow-[0_30px_80px_-24px_rgba(14,59,46,.35)]">
        <div className="mb-2 text-[15px] font-bold text-n-900">Spending by category</div>
        <CategoryList count={5} />
      </div>
    ),
  },
  {
    key: "report",
    label: "Report",
    icon: LuPieChart,
    title: "See the whole month",
    body: "A doughnut of where money went, a cash-flow chart by month, and a PDF report you can keep or share.",
    visual: <ReportMock />,
  },
  {
    key: "anywhere",
    label: "Anywhere",
    icon: LuSmartphone,
    title: "Thumb first, desk ready",
    body: "Designed for your phone with a bottom tab bar and a big + button, then expanded into a full dashboard on desktop.",
    visual: <PhoneMock />,
  },
];

const PILLAR_MS = 6000;

function Pillars() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (paused || reduce || !inView) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % PILLARS.length), PILLAR_MS);
    return () => clearTimeout(t);
  }, [active, paused, reduce, inView]);

  const p = PILLARS[active];

  return (
    <section id="features" ref={sectionRef} className="scroll-mt-20 py-20 md:py-32">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="eyebrow text-forest-600">What is PennyTrack?</div>
          <h2 className="mt-4 text-[34px] font-bold leading-[1.08] tracking-[-0.03em] text-n-900 md:text-[56px]">
            Your home base for money clarity
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-n-500">
            Everything you need to understand your spending, without spreadsheets or stress.
          </p>
        </Reveal>

        <div
          className="mt-12 grid gap-2 rounded-full bg-n-50 p-1.5 sm:mx-auto sm:max-w-2xl sm:grid-cols-4 max-sm:grid-cols-2 max-sm:rounded-[24px]"
          role="tablist"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {PILLARS.map((pl, i) => {
            const Icon = pl.icon;
            const on = i === active;
            return (
              <button
                key={pl.key}
                role="tab"
                aria-selected={on}
                onClick={() => setActive(i)}
                className={`relative flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full text-[15px] font-semibold transition-colors ${
                  on ? "text-white" : "text-n-600 hover:text-n-900"
                }`}
              >
                {on && (
                  <motion.span
                    layoutId="pillar-pill"
                    className="absolute inset-0 rounded-full bg-forest"
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  />
                )}
                {on && !reduce && !paused && inView && (
                  <motion.span
                    key={`progress-${active}`}
                    className="absolute bottom-0 left-0 h-[3px] bg-lime"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: PILLAR_MS / 1000, ease: "linear" }}
                  />
                )}
                <Icon className={`relative ${on ? "text-lime" : ""}`} />
                <span className="relative">{pl.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-10 overflow-hidden rounded-xl bg-n-50 md:mt-12">
          <div className="grid min-h-[560px] items-center gap-10 p-6 sm:p-10 md:grid-cols-2 md:p-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={p.key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-lime text-forest">
                  <p.icon className="text-2xl" />
                </span>
                <h3 className="mt-6 text-[30px] font-bold leading-tight tracking-[-0.02em] text-n-900 md:text-[40px]">{p.title}</h3>
                <p className="mt-4 max-w-md text-lg leading-relaxed text-n-500">{p.body}</p>
                <Link href="/login" className="btn btn-forest mt-8 group">
                  Try it free <LuArrowRight className="transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.div
                key={p.key}
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: -10 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex justify-center"
              >
                {p.visual}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Feature rows ───────────────────────── */

function FeatureRow({ eyebrow, title, body, bullets, visual, flip, tint = "bg-n-50" }) {
  return (
    <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
      <Reveal className={flip ? "md:order-2" : ""}>
        <div className="eyebrow text-forest-600">{eyebrow}</div>
        <h3 className="mt-4 text-[30px] font-bold leading-[1.1] tracking-[-0.025em] text-n-900 md:text-[44px]">{title}</h3>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-n-500">{body}</p>
        {bullets && (
          <ul className="mt-6 space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-[15px] font-medium text-n-700">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime">
                  <span className="h-1.5 w-1.5 rounded-full bg-forest" />
                </span>
                {b}
              </li>
            ))}
          </ul>
        )}
      </Reveal>
      <Reveal delay={0.1} className={`flex min-h-[380px] items-center justify-center overflow-hidden rounded-xl p-6 sm:p-10 ${tint} ${flip ? "md:order-1" : ""}`}>
        {visual}
      </Reveal>
    </div>
  );
}

function Features() {
  return (
    <section className="py-8 md:py-16">
      <div className="mx-auto max-w-[1200px] space-y-24 px-4 md:space-y-36 md:px-8">
        <FeatureRow
          eyebrow="Transactions"
          title="Every transaction in one list"
          body="Income and expenses side by side, grouped by day, with a running net for each one. Search by note or category in an instant."
          bullets={["Filter by income or expenses", "Add an optional note to any expense", "Remove a mistake with one tap"]}
          visual={
            <div className="w-full max-w-[420px] rounded-[28px] bg-white p-5 shadow-[0_30px_80px_-24px_rgba(14,59,46,.35)]">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[15px] font-bold text-n-900">Recent activity</span>
                <span className="text-[12px] font-semibold text-forest-600">See all</span>
              </div>
              <TxList />
            </div>
          }
        />
        <FeatureRow
          flip
          tint="bg-forest"
          eyebrow="Reports"
          title="Visualize the flow of money"
          body="Switch between week, month and year to see which categories take the biggest share. Then download a tidy PDF of everything."
          bullets={["Doughnut chart by category", "Six-month cash-flow chart", "One-tap PDF report"]}
          visual={
            <div className="flex w-full max-w-[420px] flex-col items-center rounded-[28px] bg-white p-6">
              <SvgDonut size={200} />
              <div className="mt-5 grid w-full grid-cols-3 gap-2 text-center">
                {[["Income", "₵12,500", "text-income"], ["Spent", "₵4,254", "text-n-900"], ["Net", "₵8,246", "text-forest"]].map(([l, v, c]) => (
                  <div key={l} className="rounded-[14px] bg-n-50 py-2.5">
                    <div className="text-[11px] font-semibold text-n-500">{l}</div>
                    <div className={`amount text-[14px] font-bold ${c}`}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          }
        />
        <FeatureRow
          eyebrow="Currencies"
          title="Your money, your currency"
          body="Ghana cedi by default, with ten more to choose from. Pick one and every amount in the app and your report follows."
          bullets={["11 currencies, including GHS, USD, EUR and GBP", "Remembered on your device", "Tabular figures so columns line up"]}
          visual={<CurrencyMock />}
        />
      </div>
    </section>
  );
}

/* ───────────────────────── Principles ───────────────────────── */

const PRINCIPLES = [
  { title: "Calm, not clinical", body: "Money is stressful. Soft surfaces, generous spacing and one confident accent keep the screen quiet." },
  { title: "Every pesewa counts", body: "Numbers are the hero. Big, tabular, always in your currency, never truncated." },
  { title: "Colour means category", body: "Each category owns one colour across the list, the chart and the report." },
  { title: "Private by default", body: "Your data is tied to your Google account and never sold or shared with third parties." },
];

function Principles() {
  return (
    <section className="relative mt-24 overflow-hidden bg-forest py-20 text-white md:mt-36 md:py-32">
      <Symbol className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] text-white/[.04] md:h-[640px] md:w-[640px]" />
      <div className="relative mx-auto max-w-[1200px] px-4 md:px-8">
        <Reveal className="max-w-2xl">
          <div className="eyebrow text-lime">Built around you</div>
          <h2 className="mt-4 text-[34px] font-bold leading-[1.08] tracking-[-0.03em] md:text-[56px]">
            Designed to make money feel lighter
          </h2>
        </Reveal>
        <motion.div
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          {PRINCIPLES.map((p, i) => (
            <motion.div
              key={p.title}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="rounded-lg border border-white/10 bg-white/[.04] p-6 transition-colors hover:bg-white/[.07]"
            >
              <span className="amount text-sm font-bold text-lime">0{i + 1}</span>
              <h3 className="mt-6 text-xl font-bold">{p.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-white/70">{p.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ───────────────────────── How it works ───────────────────────── */

const STEPS = [
  { title: "Sign in with Google", body: "No forms or passwords. One tap and you are in." },
  { title: "Add income and expenses", body: "Group spending into colour-coded categories as you go." },
  { title: "See where it goes", body: "Your balance, charts and PDF report update as you add." },
];

function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 py-20 md:py-32">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="eyebrow text-forest-600">How it works</div>
          <h2 className="mt-4 text-[34px] font-bold leading-[1.08] tracking-[-0.03em] text-n-900 md:text-[56px]">
            Set up in under a minute
          </h2>
        </Reveal>
        <div className="relative mt-14 grid gap-6 md:grid-cols-3">
          <motion.div
            className="absolute left-[16%] right-[16%] top-7 hidden h-[2px] origin-left bg-lime md:block"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.12} className="relative text-center">
              <span className="amount relative mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-forest text-lg font-bold text-lime ring-8 ring-n-25">
                {i + 1}
              </span>
              <h3 className="mt-6 text-xl font-bold text-n-900">{s.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-[15px] text-n-500">{s.body}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-16 flex flex-wrap justify-center gap-2.5">
          {CATEGORY_PRESETS.map((c) => (
            <span key={c.title} className="chip text-n-900" style={{ backgroundColor: `${c.color}22` }}>
              <span style={{ color: c.color }}><CategoryIcon iconKey={c.icon} /></span>
              {c.title}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── FAQ ───────────────────────── */

const FAQS = [
  { q: "Is PennyTrack free?", a: "Yes. PennyTrack is free to use. Sign in with your Google account and start tracking straight away." },
  { q: "Does PennyTrack connect to my bank or mobile money?", a: "No. You add income and expenses yourself, which keeps you in control and means PennyTrack never needs your bank or MoMo login." },
  { q: "Where is my data stored?", a: "Your income and expenses are stored in Google Firebase and tied to your Google account, so they follow you to any device you sign in on. We don't sell or share your data." },
  { q: "Which currencies are supported?", a: "Ghana cedi is the default, plus USD, EUR, GBP, JPY, AUD, CAD, CHF, CNY, SEK and NZD. Switching currency changes how amounts are shown; it doesn't convert them." },
  { q: "Can I export my data?", a: "Yes. Download a PDF report with every income entry, every expense by category, a breakdown and your balance." },
  { q: "Does it work on my phone?", a: "PennyTrack is designed phone-first and works in any modern browser. On desktop it expands into a full dashboard." },
];

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 md:grid-cols-[1fr_1.4fr] md:gap-16 md:px-8">
        <Reveal>
          <div className="eyebrow text-forest-600">FAQ</div>
          <h2 className="mt-4 text-[34px] font-bold leading-[1.08] tracking-[-0.03em] text-n-900 md:text-[48px]">
            Questions, answered
          </h2>
          <p className="mt-4 text-lg text-n-500">Everything you need to know before you start.</p>
        </Reveal>
        <div className="divide-y divide-n-100 border-y border-n-100">
          {FAQS.map((f, i) => {
            const on = open === i;
            return (
              <div key={f.q}>
                <button
                  onClick={() => setOpen(on ? -1 : i)}
                  aria-expanded={on}
                  className="flex w-full items-center gap-4 py-5 text-left text-lg font-semibold text-n-900"
                >
                  <span className="flex-1">{f.q}</span>
                  <motion.span
                    animate={{ rotate: on ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${on ? "bg-forest text-lime" : "bg-n-50 text-n-600"}`}
                  >
                    <LuChevronDown />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-xl pb-6 text-[16px] leading-relaxed text-n-500">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Closing CTA + footer ───────────────────────── */

function ClosingCta() {
  return (
    <section className="px-4 pb-10 md:px-8">
      <Reveal className="relative mx-auto max-w-[1200px] overflow-hidden rounded-xl bg-forest px-6 py-16 text-center text-white md:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_70%_at_50%_100%,rgba(200,242,80,.22),transparent_70%)]" />
        <motion.div
          className="pointer-events-none absolute -left-10 bottom-0 text-lime/10"
          animate={{ rotate: [0, 6, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        >
          <Symbol className="h-64 w-64" />
        </motion.div>
        <div className="relative">
          <h2 className="mx-auto max-w-3xl text-[34px] font-bold leading-[1.08] tracking-[-0.03em] md:text-[56px]">
            Track, understand, and feel good about your money.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-lg text-white/70">Join PennyTrack and see where every cedi goes, starting today.</p>
          <Link href="/login" className="btn btn-lg btn-lime group mt-9">
            Get started today <LuArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

function Footer({ onLegal }) {
  return (
    <footer className="border-t border-n-100 bg-white">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-8">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-n-500">
            PennyTrack helps people in Ghana and beyond see where every cedi goes.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-bold text-n-900">Product</h4>
          <ul className="mt-4 space-y-3 text-sm text-n-500">
            <li><a href="#features" className="hover:text-n-900">Features</a></li>
            <li><a href="#how" className="hover:text-n-900">How it works</a></li>
            <li><a href="#faq" className="hover:text-n-900">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold text-n-900">Account</h4>
          <ul className="mt-4 space-y-3 text-sm text-n-500">
            <li><Link href="/login" className="hover:text-n-900">Sign in</Link></li>
            <li><Link href="/login" className="hover:text-n-900">Get started</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold text-n-900">Legal</h4>
          <ul className="mt-4 space-y-3 text-sm text-n-500">
            <li><button onClick={() => onLegal("terms")} className="hover:text-n-900">Terms of Service</button></li>
            <li><button onClick={() => onLegal("privacy")} className="hover:text-n-900">Privacy Policy</button></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-n-100">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-4 py-6 text-sm text-n-500 sm:flex-row sm:items-center sm:justify-between md:px-8">
          <p>&copy; {new Date().getFullYear()} PennyTrack. All rights reserved.</p>
          <p>
            Developed by{" "}
            <a
              href="https://www.linkedin.com/in/richmond-azadze"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-forest-600 hover:underline"
            >
              Richmond Azadze
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ───────────────────────── Page ───────────────────────── */

export default function Landing() {
  const { user } = useContext(authContext);
  const router = useRouter();
  const [legal, setLegal] = useState(null);

  // Signed-in visitors go straight to their dashboard, as before.
  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  return (
    <div className="bg-n-25 text-n-900">
      <Header />
      <main>
        <Hero />
        <CurrencyMarquee />
        <Pillars />
        <Features />
        <Principles />
        <HowItWorks />
        <Faq />
        <ClosingCta />
      </main>
      <Footer onLegal={setLegal} />
      <LegalSheet doc={legal} onClose={() => setLegal(null)} />
    </div>
  );
}
