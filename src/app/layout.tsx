import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pushback — fight your medical bill",
  description:
    "Upload a medical bill or insurance denial. Get it decoded in plain English, with anomalies flagged and an appeal letter drafted for you. Free for the first bill.",
  openGraph: {
    title: "Pushback — fight your medical bill",
    description:
      "Decode bills and denials in plain English. Free appeal letter drafts. Built because the system shouldn't bully patients.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-paper text-ink antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
