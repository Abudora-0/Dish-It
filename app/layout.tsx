import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { KonamiFlambe } from "@/components/konami-flambe";
import { siteUrl } from "@/lib/env";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dish It - an animated recipe kitchen",
    template: "%s - Dish It",
  },
  description:
    "A hand built recipe experience for food, shakes, and drinks. Explore by flavor and mood, cook along step by step, and build your own drinks.",
  applicationName: "Dish It",
  keywords: [
    "recipes",
    "cooking",
    "shakes",
    "drinks",
    "meal planner",
    "flavor",
  ],
  authors: [{ name: "Dish It" }],
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    title: "Dish It",
    description:
      "An animated recipe kitchen for food, shakes, and drinks. Explore by flavor and mood.",
    url: siteUrl,
    siteName: "Dish It",
  },
  twitter: { card: "summary_large_image", title: "Dish It" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6efe2" },
    { media: "(prefers-color-scheme: dark)", color: "#14100d" },
  ],
};

const themeScript = `(function(){try{var t=localStorage.getItem('dishit-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.dataset.theme=t;}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${inter.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="grain flex min-h-full flex-col">
        <ThemeProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-ember focus:px-4 focus:py-2 focus:text-[hsl(var(--accent-contrast))]"
          >
            Skip to content
          </a>
          <ScrollProgress />
          <CustomCursor />
          <KonamiFlambe />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
