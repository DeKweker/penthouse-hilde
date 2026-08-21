import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy", description: "Privacyverklaring van Ático Hilsol." };

export default function PrivacyPage() {
  return <main className="legal"><Link className="legal-back" href="/">Ático Hilsol</Link><article><p className="eyebrow">Privacy</p><h1>Privacyverklaring</h1><p className="legal-lead">Deze website is bewust eenvoudig opgezet en slaat geen boekings- of contactgegevens op.</p><h2>Welke gegevens verwerkt de website?</h2><p>De website zelf gebruikt geen account, database, trackingcookies of server-side contactformulier. Gegevens die je invult in de aanvraagmodule blijven in je browser totdat je zelf kiest om WhatsApp of je e-mailprogramma te openen.</p><h2>WhatsApp en e-mail</h2><p>Wanneer je op een contactknop klikt, wordt een vooraf ingevuld bericht geopend bij de door jou gekozen externe dienst. Je bepaalt zelf of je dat bericht verzendt. Vanaf dat moment verwerkt WhatsApp of je e-mailprovider de gegevens volgens zijn eigen voorwaarden.</p><h2>Technische hosting</h2><p>De website wordt gehost via Vercel. Zoals bij vrijwel elke webserver kunnen technische verzoekgegevens, zoals IP-adres en browserinformatie, tijdelijk worden verwerkt voor beveiliging en levering van de website.</p><h2>Contact</h2><p>Voor vragen over privacy kan je contact opnemen via <a href={`mailto:${site.email}`}>{site.email}</a>.</p><p className="legal-date">Versie: 21 augustus 2026</p></article></main>;
}
