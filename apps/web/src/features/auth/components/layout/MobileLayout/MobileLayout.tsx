import type { ReactNode } from "react";

import "./MobileLayout.css";

type MobileLayoutProps = {
  children: ReactNode;
  className?: string;
};

export default function MobileLayout({
  children,
  className = "",
}: MobileLayoutProps) {
  return (
    <main className="mobile-layout">
      <section className={`mobile-layout__screen ${className}`}>
        {children}
      </section>
    </main>
  );
}