"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { gallery } from "@/lib/site";

const chapters = ["Alles", "Buitenleven", "Het dak", "Leven", "Slapen", "Omgeving"];

export function Gallery() {
  const [active, setActive] = useState("Alles");
  const [selected, setSelected] = useState<number | null>(null);
  const visible = useMemo(() => active === "Alles" ? gallery : gallery.filter((item) => item.chapter === active), [active]);

  useEffect(() => {
    if (selected === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
      if (event.key === "ArrowRight") setSelected((selected + 1) % visible.length);
      if (event.key === "ArrowLeft") setSelected((selected - 1 + visible.length) % visible.length);
    };
    document.body.classList.add("lightbox-open");
    window.addEventListener("keydown", onKey);
    return () => { document.body.classList.remove("lightbox-open"); window.removeEventListener("keydown", onKey); };
  }, [selected, visible]);

  return <>
    <div className="gallery-tabs" role="tablist" aria-label="Filter foto's per ruimte">
      {chapters.map((chapter) => <button key={chapter} role="tab" aria-selected={active === chapter} onClick={() => { setActive(chapter); setSelected(null); }}>{chapter}</button>)}
    </div>
    <div className="gallery-editorial">
      {visible.map((photo, index) => <button className="gallery-shot" key={photo.src} onClick={() => setSelected(index)} aria-label={`${photo.label} vergroten`}>
        <span className="gallery-frame"><Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 760px) 100vw, 50vw" /></span>
        <span className="gallery-caption"><span>{photo.chapter}</span><strong>{photo.label}</strong></span>
      </button>)}
    </div>
    {selected !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Fotogalerij">
      <button className="lightbox-close" onClick={() => setSelected(null)}>Sluiten</button>
      <button className="lightbox-nav lightbox-prev" onClick={() => setSelected((selected - 1 + visible.length) % visible.length)}>Vorige</button>
      <figure><div className="lightbox-image"><Image src={visible[selected].src} alt={visible[selected].alt} fill sizes="96vw" priority /></div><figcaption><span>{String(selected + 1).padStart(2, "0")} / {visible.length}</span><strong>{visible[selected].label}</strong></figcaption></figure>
      <button className="lightbox-nav lightbox-next" onClick={() => setSelected((selected + 1) % visible.length)}>Volgende</button>
    </div>}
  </>;
}
