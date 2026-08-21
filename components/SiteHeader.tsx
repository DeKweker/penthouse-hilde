"use client";

import { useEffect, useState } from "react";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}${open ? " menu-is-open" : ""}`}>
      <a className="wordmark" href="#top" aria-label="Ático Hilsol, naar boven" onClick={close}>
        <span>Ático Hilsol</span>
        <small>Los Alcázares</small>
      </a>
      <nav className="desktop-nav" aria-label="Hoofdnavigatie">
        <a href="#penthouse">Penthouse</a>
        <a href="#galerij">Foto&apos;s</a>
        <a href="#ligging">Ligging</a>
        <a href="#prijzen">Prijzen</a>
      </nav>
      <a className="header-cta" href="#aanvragen">Verblijf aanvragen</a>
      <button
        className="menu-button"
        type="button"
        aria-label={open ? "Menu sluiten" : "Menu openen"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
      </button>
      <div className="mobile-menu" hidden={!open}>
        <nav aria-label="Mobiele navigatie">
          <a href="#penthouse" onClick={close}>Het penthouse</a>
          <a href="#galerij" onClick={close}>Fotogalerij</a>
          <a href="#ligging" onClick={close}>Ligging & omgeving</a>
          <a href="#prijzen" onClick={close}>Prijzen</a>
          <a href="#aanvragen" onClick={close}>Verblijf aanvragen</a>
        </nav>
        <p>Velapi Golf<br />Los Alcázares · Murcia</p>
      </div>
    </header>
  );
}
