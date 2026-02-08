"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
        gsap.fromTo(containerRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
        )
    }
  }, []);

  return <div ref={containerRef}>{children}</div>;
}
