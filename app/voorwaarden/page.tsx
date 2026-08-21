import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Voorwaarden", description: "Praktische verblijfsvoorwaarden voor Ático Hilsol." };

export default function TermsPage() {
  return (
    <main className="legal">
      <Link className="legal-back" href="/">Ático Hilsol</Link>
      <article>
        <p className="eyebrow">Voorwaarden</p>
        <h1>Praktische verblijfsvoorwaarden</h1>
        <p className="legal-lead">Een aanvraag is een vraag naar beschikbaarheid. Het verblijf is pas gereserveerd nadat Hilde de periode, prijs en afspraken persoonlijk heeft bevestigd.</p>
        <h2>Bevestiging</h2>
        <p>De getoonde tarieven zijn richtprijzen en de kalender is geen live beschikbaarheidskalender. Een periode is pas definitief vastgelegd na uitdrukkelijke bevestiging door de verhuurder.</p>
        <h2>Prijs en betaling</h2>
        <p>De definitieve prijs, betaalwijze en betaaltermijnen worden rechtstreeks met de verhuurder afgesproken. Er worden online geen betalingen verwerkt. Een terugbetaalbare waarborg kan deel uitmaken van de bevestigde afspraak.</p>
        <h2>Minimumverblijf</h2>
        <p>De huidige richtlijn is een minimumverblijf van {site.minNights} nachten en maximaal {site.maxGuests} gasten, tenzij schriftelijk anders overeengekomen.</p>
        <h2>Aankomst en vertrek</h2>
        <p>Check-in is voorzien vanaf 16:00 en check-out uiterlijk om 10:00. Een afwijkend tijdstip is mogelijk wanneer dit vooraf persoonlijk wordt bevestigd.</p>
        <h2>Annulatie en huisregels</h2>
        <p>De concrete annulatievoorwaarden, huisregels en eventuele bijkomende afspraken worden samen met de reserveringsbevestiging meegedeeld. De persoonlijk bevestigde afspraken hebben altijd voorrang.</p>
        <h2>Contact</h2>
        <p>Vragen kunnen rechtstreeks naar <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
        <p className="legal-date">Versie: 21 augustus 2026</p>
      </article>
    </main>
  );
}
