"use client";

import { useEffect } from "react";

export function Reveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const targets = document.querySelectorAll<HTMLElement>(".reveal");
    if (!targets.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return null;
}
