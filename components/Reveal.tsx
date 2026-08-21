"use client";

import { PropsWithChildren, useEffect, useRef, useState } from "react";

type Props = PropsWithChildren<{ className?: string }>;

export function Reveal({ children, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8%", threshold: 0.08 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${visible ? "is-visible" : ""} ${className}`.trim()}>
      {children}
    </div>
  );
}
