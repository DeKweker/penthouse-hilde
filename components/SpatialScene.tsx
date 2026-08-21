"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";

export function SpatialScene() {
  const ref = useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const raw = (vh - rect.top) / (vh + rect.height);
      setScroll(Math.max(0, Math.min(1, raw)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    setTilt({ x, y });
  }

  const style = {
    "--back-x": `${scroll * -18}px`,
    "--back-y": `${scroll * -28}px`,
    "--mid-x": `${scroll * 22}px`,
    "--mid-y": `${scroll * -10}px`,
    "--front-y": `${(0.5 - scroll) * 54}px`,
    "--tilt-x": `${tilt.x * 3.5}deg`,
    "--tilt-y": `${tilt.y * -3.5}deg`,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      className="spatial-scene"
      style={style}
      onPointerMove={onPointerMove}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      aria-label="Ruimtelijke fotocompositie van het penthouse"
    >
      <div className="spatial-stage" aria-hidden="true">
        <div className="spatial-card spatial-card-back">
          <Image src="/images/gallery/terrace-main.webp" alt="" fill sizes="(max-width: 900px) 72vw, 32vw" />
        </div>
        <div className="spatial-card spatial-card-mid">
          <Image src="/images/gallery/dining.webp" alt="" fill sizes="(max-width: 900px) 72vw, 32vw" />
        </div>
        <div className="spatial-card spatial-card-front">
          <Image src="/images/gallery/solarium.webp" alt="" fill sizes="(max-width: 900px) 78vw, 37vw" />
        </div>
      </div>
      <div className="spatial-index" aria-hidden="true">
        <span>woonlaag</span>
        <i />
        <span>dakniveau</span>
      </div>
    </div>
  );
}
