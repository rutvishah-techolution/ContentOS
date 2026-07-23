import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { listPersonas } from "@/lib/brain";

export const metadata: Metadata = {
  title: "ContentOS",
  description:
    "Autonomous research → storyline → drafting pipeline for B2B campaign content.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const personas = await listPersonas();

  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="flex min-h-screen">
          <Sidebar personaCount={personas.length} />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
