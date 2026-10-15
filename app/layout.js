import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";

import Providers from "./providers";
import { themeScript } from "@/lib/store/theme-context";

export const metadata = {
  metadataBase: new URL("https://pennytrack.tech"),
  title: {
    default: "PennyTrack: see where every cedi goes",
    template: "%s · PennyTrack",
  },
  description:
    "Track income and expenses in one calm place. Colour-coded categories, clear charts and one-tap PDF reports, in your currency.",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "PennyTrack",
    description: "Every pesewa, accounted for. Track income and expenses in one calm place.",
    url: "https://pennytrack.tech",
    siteName: "PennyTrack",
    images: [{ url: "/icon-512.png", width: 512, height: 512 }],
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0E3B2E",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
