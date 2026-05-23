import type { Metadata } from "next";
import { AppLayout } from "@/src/components/layout/app-layout";

export const metadata: Metadata = {
  title: "Composer",
  description: "Legacy full-screen request composer.",
  // Don't index the legacy escape hatch — the playground is the canonical
  // surface.
  robots: { index: false, follow: false },
};

export default function ExpandPage() {
  return <AppLayout />;
}
