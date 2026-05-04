import type { ReactNode } from "react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

export function MarketingPageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Nav />
      <main style={{ minHeight: "52vh", padding: "56px 0 96px" }}>
        <div className="container-brand">
          <div style={{ maxWidth: 720, margin: "0 auto" }}>{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
