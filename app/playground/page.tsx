import type { Metadata } from "next";
import { Workspace } from "@/src/v1/components/workspace";

export const metadata: Metadata = {
  title: "Playground",
  description:
    "Live JustAPI playground. Send a request, drag the sheet to dismiss, stack history above the input.",
  alternates: { canonical: "/playground" },
  openGraph: {
    title: "JustAPI Playground",
    description:
      "Live JustAPI playground. Send a request, drag the sheet to dismiss, stack history above the input.",
    url: "/playground",
  },
};

export default function PlaygroundPage() {
  return <Workspace />;
}
