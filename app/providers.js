"use client";

import { MotionConfig } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthContextProvider from "@/lib/store/auth-context";
import FinanceContextProvider from "@/lib/store/finance-context";
import { CurrencyProvider } from "@/lib/store/CurrencyContext";
import { ThemeProvider } from "@/lib/store/theme-context";

export default function Providers({ children }) {
  return (
    <MotionConfig reducedMotion="user">
      <AuthContextProvider>
        <FinanceContextProvider>
          <CurrencyProvider>
            <ThemeProvider>
              {children}
              <ToastContainer position="bottom-center" autoClose={2600} hideProgressBar closeButton={false} />
            </ThemeProvider>
          </CurrencyProvider>
        </FinanceContextProvider>
      </AuthContextProvider>
    </MotionConfig>
  );
}
