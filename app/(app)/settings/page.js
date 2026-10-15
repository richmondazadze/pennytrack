"use client";

import { useContext, useState } from "react";
import { LuChevronRight, LuDownload, LuLogOut, LuMonitor, LuMoon, LuSun } from "react-icons/lu";
import PageHeader from "@/components/app/PageHeader";
import { Avatar } from "@/components/app/UserMenu";
import { useDownloadReport } from "@/components/app/hooks";
import Segmented from "@/components/ui/Segmented";
import Select from "@/components/ui/Select";
import LegalSheet from "@/components/legal/LegalSheet";
import { authContext } from "@/lib/store/auth-context";
import { useCurrency } from "@/lib/store/CurrencyContext";
import { useTheme } from "@/lib/store/theme-context";
import { currencies } from "@/lib/store/currencies";

function Row({ label, hint, children, onClick, stack }) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className={`flex w-full gap-4 px-5 py-4 text-left md:px-6 ${
        stack ? "flex-col sm:flex-row sm:items-center" : "items-center"
      } ${onClick ? "transition hover:bg-sunken" : ""}`}
    >
      <div className="min-w-0 flex-1">
        <div className="font-semibold">{label}</div>
        {hint && <div className="text-sm text-muted">{hint}</div>}
      </div>
      {children}
    </Tag>
  );
}

export default function SettingsPage() {
  const { user, logout } = useContext(authContext);
  const { currency, setCurrency } = useCurrency();
  const { theme, setTheme } = useTheme();
  const download = useDownloadReport();
  const [legal, setLegal] = useState(null);

  return (
    <>
      <PageHeader eyebrow="Your account" title="Settings" showQuickAdd={false} />

      <div className="mx-auto max-w-2xl space-y-5">
        <section className="card flex items-center gap-4 p-5 md:p-6">
          <Avatar user={user} className="h-16 w-16 text-xl" />
          <div className="min-w-0">
            <div className="truncate text-lg font-bold">{user?.displayName}</div>
            <div className="truncate text-sm text-muted">{user?.email}</div>
            <div className="mt-1.5 text-xs font-semibold text-muted">Signed in with Google</div>
          </div>
        </section>

        <section className="card divide-y divide-line overflow-hidden">
          <h2 className="eyebrow px-5 pb-3 pt-5 text-muted md:px-6">Preferences</h2>
          <Row stack label="Currency" hint="Amounts are shown in this currency">
            <Select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full sm:w-auto"
              aria-label="Currency"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} · {c.name}
                </option>
              ))}
            </Select>
          </Row>
          <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center md:px-6">
            <div className="flex-1">
              <div className="font-semibold">Appearance</div>
              <div className="text-sm text-muted">Light, dark, or follow your device</div>
            </div>
            <Segmented
              id="theme"
              value={theme}
              onChange={setTheme}
              options={[
                { value: "system", label: <span className="flex items-center gap-1.5"><LuMonitor /> Auto</span> },
                { value: "light", label: <span className="flex items-center gap-1.5"><LuSun /> Light</span> },
                { value: "dark", label: <span className="flex items-center gap-1.5"><LuMoon /> Dark</span> },
              ]}
            />
          </div>
        </section>

        <section className="card divide-y divide-line overflow-hidden">
          <h2 className="eyebrow px-5 pb-3 pt-5 text-muted md:px-6">Data</h2>
          <Row label="Download PDF report" hint="All income and expenses in one document" onClick={download}>
            <LuDownload className="text-muted" />
          </Row>
          <Row label="Terms of Service" onClick={() => setLegal("terms")}>
            <LuChevronRight className="text-muted" />
          </Row>
          <Row label="Privacy Policy" onClick={() => setLegal("privacy")}>
            <LuChevronRight className="text-muted" />
          </Row>
        </section>

        <button onClick={logout} className="btn btn-danger btn-lg w-full">
          <LuLogOut /> Sign out
        </button>
      </div>

      <LegalSheet doc={legal} onClose={() => setLegal(null)} />
    </>
  );
}
