import Image from "next/image";
import { InquiryForm } from "@/components/InquiryForm";
import { Reveal } from "@/components/Reveal";
import { SiteHeader } from "@/components/SiteHeader";
import { SpaceStories } from "@/components/SpaceStories";
import { rooms, seasons, site } from "@/lib/site";

const amenities = [
  "Privésolarium",
  "Buitenkeuken",
  "Airconditioning",
  "Wifi",
  "Gemeenschappelijk zwembad",
  "Ondergrondse parking",
  "Lift",
  "Fietsverhuur op aanvraag",
];

const faq = [
  ["Hoe vraag ik een verblijf aan?", "Kies je aankomst- en vertrekdatum en het aantal gasten. Je kan daarna rechtstreeks een vooraf ingevuld bericht naar Hilde openen via WhatsApp of e-mail. Zij bevestigt persoonlijk of de periode vrij is."],
  ["Is de prijsindicatie definitief?", "De berekening volgt de huidige seizoenstarieven en telt de eindschoonmaak mee. De definitieve prijs wordt samen met de beschikbaarheid persoonlijk bevestigd."],
  ["Wat zijn de aankomst- en vertrektijden?", "Check-in is voorzien vanaf 16:00 en check-out uiterlijk om 10:00. Een ander tijdstip kan vooraf worden besproken."],
  ["Hoort het solarium volledig bij het penthouse?", "Ja. Het solarium ligt boven de woning en is volledig privé. Het vormt een tweede buitenruimte naast het hoekterras aan de woonverdieping."],
  ["Hebben we een auto nodig?", "Nee. Boodschappen, strand en de boulevard zijn goed per fiets bereikbaar; fietsverhuur kan vooraf worden geregeld. Wie de kust verder wil verkennen, heeft wel het extra gemak van een auto en kan gebruikmaken van de ondergrondse parkeerplaats."],
  ["Kan ik fietsen huren?", "Fietsverhuur kan op aanvraag en volgens beschikbaarheid met de verhuurders worden besproken."],
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("nl-BE", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${value}T12:00:00`));
}

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "VacationRental",
    name: site.name,
    description: "Casa Filou is een penthouse met drie slaapkamers, twee badkamers, hoekterras, privésolarium en zwembad in Velapi Golf, Los Alcázares.",
    url: site.siteUrl,
    image: [`${site.siteUrl}/images/og-cover.webp`],
    numberOfBedrooms: 3,
    numberOfBathroomsTotal: 2,
    occupancy: { "@type": "QuantitativeValue", maxValue: 6 },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Los Alcázares",
      addressRegion: "Región de Murcia",
      postalCode: "30710",
      addressCountry: "ES",
    },
    amenityFeature: amenities.map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
  };

  return (
    <>
      <a className="skip-link" href="#main">Ga naar de inhoud</a>
      <SiteHeader />
      <main id="main">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <picture className="hero-picture parallax-image">
            <source media="(max-width: 720px)" srcSet="/images/hero-mobile.webp" type="image/webp" />
            <img src="/images/hero-desktop.webp" alt="Hoekterras van Casa Filou met zicht over Velapi Golf en het zwembad" fetchPriority="high" />
          </picture>
          <div className="hero-shade" aria-hidden="true" />
          <div className="hero-content">
            <p className="eyebrow light">Casa Filou · Los Alcázares</p>
            <h1 id="hero-title">Hier duurt de dag<br /><em>net wat langer.</em></h1>
            <p>Een licht penthouse voor zes, tussen de fairway en de Mar Menor. Met twee buitenruimtes en alle vrijheid om de auto te laten staan.</p>
            <div className="hero-actions">
              <a className="button button-light" href="#aanvragen">Informeer naar je verblijf</a>
              <a className="underlink light" href="#ruimtes">Ontdek Casa Filou</a>
            </div>
          </div>
          <div className="hero-signature" aria-hidden="true">CF</div>
        </section>

        <section className="intro section" id="penthouse">
          <Reveal className="intro-label">
            <p className="eyebrow">Welkom bij Casa Filou</p>
            <p className="side-note">3 slaapkamers · 2 badkamers<br />2 private buitenruimtes</p>
          </Reveal>
          <Reveal className="intro-copy">
            <h2>Van de eerste koffie buiten tot een laatste glas <em>boven op het dak.</em></h2>
            <div className="two-copy">
              <p>De woonverdieping opent breed naar het hoekterras. Keuken, eettafel en zithoek vormen één lichte leefruimte; buiten loopt het zicht verder over de residentie, het zwembad en het groen.</p>
              <p>Een verdieping hoger wacht het privésolarium: lounge, eettafel, ligruimte en buitenkeuken, helemaal voor jullie. Drie volwaardige slaapkamers bieden plaats aan maximaal zes gasten.</p>
            </div>
          </Reveal>
        </section>

        <SpaceStories />

        <section className="sleep section-dark" id="slapen">
          <div className="section sleep-head">
            <Reveal>
              <p className="eyebrow light">Na de zon</p>
              <h2>Drie slaapkamers.<br /><em>Alle rust die daarbij hoort.</em></h2>
            </Reveal>
            <Reveal className="sleep-note"><p>De hoofdslaapkamer heeft een eigen ensuite. Twee extra slaapkamers delen de tweede badkamer en houden dezelfde rustige, lichte afwerking aan.</p></Reveal>
          </div>
          <div className="sleep-track" aria-label="Slaapkamers">
            {rooms.map((room, index) => <a href={`/kamers/${room.slug}/`} className={`sleep-card${index === 1 ? " sleep-card-offset" : ""}`} key={room.slug}>
              <div className="sleep-image parallax-image"><Image src={room.image} alt={room.name} fill sizes="(max-width: 720px) 82vw, 42vw" /></div>
              <div><span>{room.number}</span><h3>{room.name}</h3><p>{room.kicker} · Ontdek de kamer</p></div>
            </a>)}
          </div>
        </section>

        <section className="landscape" id="ligging" aria-labelledby="location-title">
          <div className="landscape-media parallax-image">
            <Image src="/images/gallery/golf-sunset.webp" alt="Avondlicht over La Serena Golf" fill sizes="100vw" />
            <div className="landscape-shade" />
          </div>
          <div className="section landscape-content">
            <Reveal className="landscape-title">
              <p className="eyebrow light">Velapi Golf</p>
              <h2 id="location-title">Groen aan je voeten.<br /><em>De Mar Menor vlakbij.</em></h2>
            </Reveal>
            <div className="place-cloud">
              <Reveal className="place place-golf"><span>op het domein</span><strong>La Serena Golf</strong><small>18 holes · clubhuis · restaurant</small></Reveal>
              <Reveal className="place place-water"><span>vlot per fiets</span><strong>Mar Menor</strong><small>strand · boulevard · beschut water</small></Reveal>
              <Reveal className="place place-city"><span>ca. 25 min</span><strong>Cartagena</strong><small>haven · oude stad · Romeins theater</small></Reveal>
              <Reveal className="place place-coast"><span>ca. 30–40 min</span><strong>Cabo de Palos & La Manga</strong><small>Middellandse Zee · snorkelen · duiken</small></Reveal>
            </div>
            <a className="underlink light" href="https://www.google.com/maps/dir/?api=1&destination=37.728066%2C-0.868076" target="_blank" rel="noreferrer">Route naar Velapi Golf</a>
          </div>
        </section>

        <section className="golf-story section">
          <Reveal className="golf-portrait">
            <div className="golf-photo parallax-image"><Image src="/images/gallery/golf-close.webp" alt="La Serena Golf naast Velapi Golf" fill sizes="(max-width: 900px) 100vw, 48vw" /></div>
          </Reveal>
          <Reveal className="golf-copy-light">
            <p className="eyebrow">La Serena Golf</p>
            <h2>Een ronde spelen<br /><em>zonder eerst ergens heen te rijden.</em></h2>
            <p>La Serena Golf ligt direct aan de residentie. De vlakke par-72 baan van Manuel Piñero is rijk aan waterpartijen en speelt opvallend technisch ondanks het open landschap.</p>
            <a className="button button-dark" href="https://www.serenagolf.com/en/golf-course-information" target="_blank" rel="noreferrer">Ontdek La Serena Golf</a>
          </Reveal>
        </section>

        <section className="pricing section" id="prijzen" aria-labelledby="pricing-title">
          <Reveal className="pricing-head">
            <p className="eyebrow">Richtprijzen</p>
            <div><h2 id="pricing-title">Kies het seizoen<br /><em>dat bij je past.</em></h2><p>Minimumverblijf van vier nachten. Hilde bevestigt de vrije periode en de definitieve prijs persoonlijk.</p></div>
          </Reveal>
          <div className="season-line">
            {seasons.map((season) => (
              <article key={season.name}>
                <span className="season-dot" aria-hidden="true" />
                <p>{season.name}</p>
                <strong>€ {season.rate}<small>/nacht</small></strong>
                <time>{formatDate(season.start)} – {formatDate(season.end)}</time>
              </article>
            ))}
          </div>
          <div className="pricing-foot"><span>Eindschoonmaak € {site.cleaningFee}</span><span>Waarborg € {site.securityDeposit} · terugbetaalbaar</span></div>
        </section>

        <section className="inquiry section-ochre" id="aanvragen" aria-labelledby="inquiry-title">
          <div className="section inquiry-layout">
            <Reveal className="inquiry-copy">
              <p className="eyebrow">Een periode in gedachten?</p>
              <h2 id="inquiry-title">Vertel wanneer je<br /><em>wil komen.</em></h2>
              <p>Vul je data en het aantal gasten in. Je krijgt meteen een richtprijs en kan je vraag rechtstreeks naar Hilde sturen. Zij laat persoonlijk weten wat mogelijk is.</p>
              <div className="owner-note"><span>Rechtstreeks contact</span><strong>Hilde</strong><small>voor beschikbaarheid en praktische afspraken</small></div>
            </Reveal>
            <Reveal className="form-wrap"><InquiryForm /></Reveal>
          </div>
        </section>

        <section className="faq section" id="praktisch">
          <Reveal className="faq-title"><p className="eyebrow">Voor je vertrekt</p><h2>Praktisch,<br /><em>zonder verrassingen.</em></h2><p>De belangrijkste afspraken op één plek. Voor iets specifieks kan je Hilde altijd rechtstreeks vragen.</p></Reveal>
          <div className="faq-list">
            {faq.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}
          </div>
        </section>

        <section className="closing">
          <Image src="/images/gallery/terrace-lounge.webp" alt="Terraslounge van Casa Filou" fill sizes="100vw" />
          <div className="closing-shade" />
          <Reveal className="closing-copy"><p className="eyebrow light">Casa Filou · Los Alcázares</p><h2>Misschien wordt dit<br /><em>jouw plek in de zon.</em></h2><a className="button button-light" href="#aanvragen">Informeer naar je verblijf</a></Reveal>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-main">
          <div className="footer-brand"><strong>Casa Filou</strong><span>Penthouse aan La Serena Golf</span></div>
          <div className="footer-location"><small>Vind ons</small><p>Velapi Golf<br />30710 Los Alcázares<br />Región de Murcia · Spanje</p><a href="https://www.google.com/maps/dir/?api=1&destination=37.728066%2C-0.868076" target="_blank" rel="noreferrer">Open route ↗</a></div>
          <div className="footer-contact"><small>Rechtstreeks bij Hilde</small><a href={`mailto:${site.email}`}>{site.email}</a><a href="#aanvragen">Vraag je verblijf aan</a></div>
          <nav aria-label="Voetnavigatie"><small>Casa Filou</small><a href="#penthouse">Het penthouse</a><a href="#ruimtes">De ruimtes</a><a href="#slapen">De kamers</a><a href="#ligging">De omgeving</a><a href="#prijzen">Prijzen</a></nav>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Casa Filou</span>
          <div><a href="/privacy/">Privacy</a><a href="/voorwaarden/">Voorwaarden</a></div>
          <a className="footer-studio" href="https://deeqstudio.com" target="_blank" rel="noreferrer"><span>Website door</span><strong>DeeQ Studio ↗</strong></a>
          <a href="#top">Naar boven ↑</a>
        </div>
      </footer>

      <a className="mobile-inquiry" href="#aanvragen"><span>Verblijf</span><b>Informeer naar data</b></a>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </>
  );
}
