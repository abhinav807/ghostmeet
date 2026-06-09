"use client";

import { Navbar } from "@/components/shared/navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">{children}</main>
    </div>
  );
}
