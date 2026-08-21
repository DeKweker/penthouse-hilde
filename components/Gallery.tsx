"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { gallery } from "@/lib/site";

export function Gallery() {
  const [index, setIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (index === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIndex(null);
      if (event.key === "ArrowRight") setIndex((index + 1) % gallery.length);
      if (event.key === "ArrowLeft") setIndex((index - 1 + gallery.length) % gallery.length);
    };
    document.body.classList.add("lightbox-open");
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("lightbox-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [index]);

  const visible = showAll ? gallery : gallery.slice(0, 8);

  return (
    <>
      <div className={`gallery-grid${showAll ? " is-expanded" : ""}`}>
        {visible.map((photo, photoIndex) => (
          <button
            className={`gallery-tile tile-${photoIndex + 1}`}
            key={photo.src}
            type="button"
            onClick={() => setIndex(photoIndex)}
            aria-label={`${photo.label} vergroten`}
          >
            <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 760px) 50vw, (max-width: 1100px) 33vw, 25vw" />
            <span>{photo.label}</span>
          </button>
        ))}
      </div>
      {!showAll && (
        <div className="gallery-more">
          <button className="text-button" type="button" onClick={() => setShowAll(true)}>
            Bekijk alle {gallery.length} foto&apos;s
          </button>
        </div>
      )}
      {index !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Fotogalerij">
          <button className="lightbox-close" type="button" onClick={() => setIndex(null)} aria-label="Galerij sluiten">Sluiten</button>
          <button className="lightbox-nav lightbox-prev" type="button" onClick={() => setIndex((index - 1 + gallery.length) % gallery.length)} aria-label="Vorige foto">Vorige</button>
          <figure>
            <div className="lightbox-image">
              <Image src={gallery[index].src} alt={gallery[index].alt} fill sizes="96vw" priority />
            </div>
            <figcaption><span>{String(index + 1).padStart(2, "0")} / {gallery.length}</span>{gallery[index].label}</figcaption>
          </figure>
          <button className="lightbox-nav lightbox-next" type="button" onClick={() => setIndex((index + 1) % gallery.length)} aria-label="Volgende foto">Volgende</button>
        </div>
      )}
    </>
  );
}
