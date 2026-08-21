"use client";

import { FormEvent, useMemo, useState } from "react";
import { seasons, site } from "@/lib/site";

const DAY = 86_400_000;

function isoDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseLocal(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function displayDate(value: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("nl-BE", { day: "numeric", month: "long", year: "numeric" }).format(parseLocal(value));
}

function estimatePrice(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return null;
  const start = parseLocal(checkIn);
  const end = parseLocal(checkOut);
  if (end <= start) return null;

  let nightly = 0;
  let cursor = new Date(start);
  let missingRate = false;
  while (cursor < end) {
    const current = isoDate(cursor);
    const season = seasons.find((item) => current >= item.start && current <= item.end);
    if (!season) missingRate = true;
    else nightly += season.rate;
    cursor = new Date(cursor.getTime() + DAY);
  }
  if (missingRate) return null;
  return nightly + site.cleaningFee;
}

export function InquiryForm() {
  const today = useMemo(() => isoDate(new Date()), []);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const nights = checkIn && checkOut ? Math.round((parseLocal(checkOut).getTime() - parseLocal(checkIn).getTime()) / DAY) : 0;
  const price = estimatePrice(checkIn, checkOut);

  function validate() {
    if (!checkIn || !checkOut) return "Kies eerst een aankomst- en vertrekdatum.";
    if (nights < site.minNights) return `Het minimumverblijf is ${site.minNights} nachten.`;
    if (Number(guests) > site.maxGuests) return `De woning is voorzien voor maximaal ${site.maxGuests} gasten.`;
    return "";
  }

  function body() {
    return [
      "Hallo Hilde,",
      "",
      "Ik wil graag informeren naar Ático Hilsol.",
      `Aankomst: ${displayDate(checkIn)}`,
      `Vertrek: ${displayDate(checkOut)}`,
      `Aantal gasten: ${guests}`,
      name ? `Naam: ${name}` : "",
      price ? `Prijsindicatie website: € ${price.toLocaleString("nl-BE")}` : "",
      message ? `Opmerking: ${message}` : "",
      "",
      "Kan je laten weten of deze periode nog beschikbaar is?",
    ].filter(Boolean).join("\n");
  }

  function prepare(event: FormEvent) {
    event.preventDefault();
    const validation = validate();
    setError(validation);
  }

  function openWhatsApp() {
    const validation = validate();
    if (validation) return setError(validation);
    setError("");
    window.open(`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(body())}`, "_blank", "noopener,noreferrer");
  }

  function openEmail() {
    const validation = validate();
    if (validation) return setError(validation);
    setError("");
    const subject = `Aanvraag Ático Hilsol · ${checkIn} tot ${checkOut}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body())}`;
  }

  return (
    <form className="inquiry-form" onSubmit={prepare} noValidate>
      <div className="form-grid">
        <label>
          <span>Aankomst</span>
          <input type="date" min={today} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
        </label>
        <label>
          <span>Vertrek</span>
          <input type="date" min={checkIn || today} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required />
        </label>
        <label>
          <span>Gasten</span>
          <select value={guests} onChange={(e) => setGuests(e.target.value)}>
            {Array.from({ length: site.maxGuests }, (_, i) => i + 1).map((guest) => <option key={guest} value={guest}>{guest} {guest === 1 ? "gast" : "gasten"}</option>)}
          </select>
        </label>
        <label>
          <span>Naam <small>optioneel</small></span>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Je naam" />
        </label>
      </div>
      <label className="message-field">
        <span>Bericht <small>optioneel</small></span>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Bijvoorbeeld aankomstuur, vragen over fietsen of iets anders dat we vooraf mogen weten." />
      </label>
      <div className="estimate" aria-live="polite">
        <div><span>Verblijf</span><strong>{nights > 0 ? `${nights} nachten` : "Kies je data"}</strong></div>
        <div><span>Prijsindicatie</span><strong>{price ? `€ ${price.toLocaleString("nl-BE")}` : "Na datumkeuze"}</strong></div>
        <p>Inclusief € {site.cleaningFee} eindschoonmaak. Terugbetaalbare waarborg van € {site.securityDeposit} apart. Beschikbaarheid en definitieve prijs worden persoonlijk bevestigd.</p>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="inquiry-actions">
        <button className="button button-whatsapp" type="button" onClick={openWhatsApp}>Verder via WhatsApp</button>
        <button className="button button-mail" type="button" onClick={openEmail}>Verder via e-mail</button>
      </div>
      <p className="privacy-note">Deze site verstuurt of bewaart je gegevens niet. Je aanvraag wordt pas gedeeld wanneer jij WhatsApp of je eigen mail-app opent en zelf verzendt.</p>
    </form>
  );
}
