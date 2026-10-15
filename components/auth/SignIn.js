"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LuArrowLeft, LuExternalLink } from "react-icons/lu";
import Logo from "@/components/brand/Logo";
import LegalSheet from "@/components/legal/LegalSheet";
import { PhoneMock, ToastMock } from "@/components/landing/Mocks";
import { fadeUp, stagger } from "@/components/ui/Reveal";
import { authContext } from "@/lib/store/auth-context";

function isInAppBrowser() {
  if (typeof window === "undefined") return false;
  const userAgent = window.navigator.userAgent || window.navigator.vendor || window.opera;
  return /Instagram|FBAV|FBAN|Twitter|Snapchat|LinkedIn|Discord/i.test(userAgent);
}

// Google sign-in is blocked inside most in-app browsers, so hand off to the real browser.
function openInDefaultBrowser() {
  const url = "https://pennytrack.tech";
  const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const android = /Android/.test(navigator.userAgent);

  if (iOS) {
    window.location.href = `googlechrome-x-callback://x-callback-url/open/?url=${encodeURIComponent(url)}`;
  } else if (android) {
    window.location = `intent://${url.replace(/^https?:\/\//, "")}#Intent;scheme=https;package=com.android.chrome;end`;
  } else {
    const newWindow = window.open(url, "_blank");
    if (newWindow) newWindow.opener = null;
    else window.location.href = url;
  }
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" width="22" height="22" aria-hidden>
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
  );
}

export default function SignIn() {
  const { user, googleLoginHandler } = useContext(authContext);
  const router = useRouter();
  const [isInApp, setIsInApp] = useState(false);
  const [busy, setBusy] = useState(false);
  const [legal, setLegal] = useState(null);

  useEffect(() => setIsInApp(isInAppBrowser()), []);

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  const handleLogin = async () => {
    if (isInApp) {
      openInDefaultBrowser();
      return;
    }
    setBusy(true);
    try {
      await googleLoginHandler();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-svh bg-n-25 text-n-900 lg:grid-cols-2">
      <div className="flex flex-col px-5 py-6 sm:px-10 md:py-8">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="PennyTrack home"><Logo /></Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-n-500 hover:text-n-900">
            <LuArrowLeft /> Home
          </Link>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center py-14"
        >
          {isInApp && (
            <motion.div variants={fadeUp} className="mb-8 rounded-lg border border-warn/30 bg-warn/10 p-4">
              <p className="text-sm font-semibold text-n-800">
                For the best experience, please open this page in your default browser.
              </p>
              <button className="btn btn-sm btn-forest mt-3" onClick={openInDefaultBrowser}>
                Open in browser <LuExternalLink />
              </button>
            </motion.div>
          )}
          <motion.div variants={fadeUp} className="eyebrow text-forest-600">Welcome</motion.div>
          <motion.h1 variants={fadeUp} className="mt-3 text-[36px] font-bold leading-[1.1] tracking-[-0.025em] md:text-[44px]">
            Track your expenses effortlessly
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-4 text-[17px] text-n-500">
            Sign in or create your free account. It takes one tap.
          </motion.p>

          <motion.button
            variants={fadeUp}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            disabled={busy}
            className="mt-10 flex h-14 w-full items-center justify-center gap-3 rounded-full border border-n-200 bg-white text-base font-semibold text-n-900 shadow-raised transition hover:border-n-300 hover:shadow-overlay disabled:opacity-60"
          >
            {busy ? (
              <motion.span
                className="h-5 w-5 rounded-full border-2 border-n-200 border-t-forest"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <GoogleIcon />
            )}
            Continue with Google
          </motion.button>

          <motion.p variants={fadeUp} className="mt-6 text-center text-sm text-n-500">
            By continuing, you agree to our{" "}
            <button className="font-semibold text-n-900 underline underline-offset-2" onClick={() => setLegal("terms")}>
              Terms of Service
            </button>{" "}
            and{" "}
            <button className="font-semibold text-n-900 underline underline-offset-2" onClick={() => setLegal("privacy")}>
              Privacy Policy
            </button>
            .
          </motion.p>
        </motion.div>

        <p className="text-center text-xs text-n-400">&copy; {new Date().getFullYear()} PennyTrack</p>
      </div>

      <div className="relative hidden overflow-hidden bg-forest lg:flex lg:items-center lg:justify-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_40%,rgba(200,242,80,.18),transparent_70%)]" />
        <motion.div
          initial={{ opacity: 0, y: 40, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: -2 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <PhoneMock className="border-n-950" />
        </motion.div>
        <motion.div
          className="absolute bottom-[22%] left-[12%]"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <ToastMock light className="animate-float" />
        </motion.div>
        <div className="absolute bottom-10 left-0 right-0 text-center text-sm font-semibold text-white/60">
          Every pesewa, accounted for.
        </div>
      </div>

      <LegalSheet doc={legal} onClose={() => setLegal(null)} />
    </div>
  );
}
