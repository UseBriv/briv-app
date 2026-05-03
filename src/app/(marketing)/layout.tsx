import type { ReactNode } from "react";
import { Reveal } from "@/components/Reveal";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Reveal />
    </>
  );
}
