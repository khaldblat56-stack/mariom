import type { ReactNode } from "react";

export function MainContent({ children }: { children: ReactNode }) {
  return <main className="min-h-screen bg-white text-brand-dark font-sans selection:bg-brand-cyan/20">{children}</main>;
}
