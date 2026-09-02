import type { Metadata } from "next";
import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";
import { isSanityConfigured } from "@/lib/env";
import { StudioSetupNotice } from "./setup-notice";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Dish It Studio",
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  if (!isSanityConfigured) {
    return <StudioSetupNotice />;
  }
  return <NextStudio config={config} />;
}
