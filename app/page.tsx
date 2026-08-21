import Image from "next/image";
import { Gallery } from "@/components/Gallery";
import { InquiryForm } from "@/components/InquiryForm";
import { Reveal } from "@/components/Reveal";
import { SiteHeader } from "@/components/SiteHeader";
import { seasons, site } from "@/lib/site";

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

const places = [
  { kind: "Golf", name: "La Serena Golf", detail: "18 holes · clubhuis · restaurant", time: "Aan het domein" },
  { kind: "Water", name: "Mar Menor", detail: "Strand · boulevard · beschut water", time: "Ca. 1,5 km" },
  { kind: "Dagelijks", name: "Supermarkten", detail: "Carrefour Express en meerdere alternatieven", time: "Ca. 5 min fietsen" },
  { kind: "Stad", name: "Cartagena", detail: "Haven · oude stad · Romeins theater", time: "Ca. 25 min auto" },
  { kind: "Kust", name: "Cabo de Palos & La Manga", detail: "Middellandse Zee · snorkelen · duiken", time: "Ca. 30–40 min auto" },
];

const faq = [
  ["Hoe vraag ik een verblijf aan?", "Kies je data en aantal gasten onderaan de pagina. Daarna open je met één klik een vooraf ingevuld WhatsApp-bericht of e-mail. Je verzendt die zelf. De eigenaar bevestigt daarna persoonlijk of de periode vrij is."],
  ["Is de getoonde prijs definitief?", "Nee. De calculator geeft een duidelijke indicatie op basis van de huidige seizoenstarieven en eindschoonmaak. Beschikbaarheid, definitieve prijs en eventuele bijzondere afspraken worden altijd persoonlijk bevestigd."],
  ["Wat zijn de aankomst- en vertrektijden?", "De huidige verblijfsinformatie gaat uit van check-in vanaf 16:00 en check-out uiterlijk om 10:00. Een afwijkend tijdstip kan vooraf worden gevraagd."],
  ["Hoort het solarium volledig bij het penthouse?", "Ja. Het privésolarium ligt boven de woning en vormt een tweede buitenruimte naast het hoekterras aan de woonverdieping. Er is een loungehoek, eettafel, ligruimte en buitenkeuken."],
  ["Is een auto nodig?", "Een auto is aanbevolen voor stranden, restaurants en uitstappen. Voor dagelijkse boodschappen is de ligging ook per fiets praktisch. Bij de woning hoort een ondergrondse parkeerplaats."],
  ["Kan ik fietsen huren?", "Fietsverhuur kan op aanvraag en volgens beschikbaarheid met de verhuurders worden besproken. Prijs, type fiets, waarborg en gebruiksvoorwaarden worden apart bevestigd."],
];

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "VacationRental",
    name: site.name,
    description: "Privé penthouse met drie slaapkamers, twee badkamers, hoekterras, privésolarium en gemeenschappelijk zwembad in Velapi Golf, Los Alcázares.",
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
          <picture className="hero-picture">
            <source media="(max-width: 720px)" srcSet="/images/hero-mobile.webp" type="image/webp" />
            <img src="/images/hero-desktop.webp" alt="Hoekterras van Ático Hilsol met zicht over Velapi Golf en het zwembad" fetchPriority="high" />
          </picture>
          <div className="hero-shade" aria-hidden="true" />
          <div className="hero-content">
            <p className="eyebrow light">Privé penthouse · Velapi Golf</p>
            <h1 id="hero-title">Boven de fairway.<br /><em>Dicht bij het water.</em></h1>
            <p>Een licht verblijf voor maximaal zes gasten in Los Alcázares, met een royaal hoekterras, een volledig privésolarium bovenop en de Mar Menor vlakbij.</p>
            <div className="hero-actions">
              <a className="button button-light" href="#aanvragen">Vraag je verblijf aan</a>
              <a className="underlink light" href="#galerij">Bekijk de woning</a>
            </div>
          </div>
          <div className="hero-facts" aria-label="Kerngegevens">
            <span><b>6</b> gasten</span>
            <span><b>3</b> slaapkamers</span>
            <span><b>2</b> badkamers</span>
            <span><b>2</b> buitenruimtes</span>
          </div>
        </section>

        <section className="intro section" id="penthouse">
          <Reveal className="intro-label">
            <p className="eyebrow">Ático Hilsol</p>
            <p className="side-note">Velapi Golf<br />Los Alcázares · Murcia</p>
          </Reveal>
          <Reveal className="intro-copy">
            <h2>Een eigen plek waar binnen en buiten <em>zonder haast in elkaar overlopen.</em></h2>
            <div className="two-copy">
              <p>De woning ligt in residentie Velapi Golf, direct bij La Serena Golf. Aan de leefruimte ligt het ruime hoekterras. Een verdieping hoger krijg je daar nog een tweede buitenruimte bovenop: het volledige privésolarium.</p>
              <p>Het interieur is helder en rustig, met drie slaapkamers, twee badkamers en een open leefruimte voor zes. Niet ingericht als hotelkamer, wel als een plek waar je ook na een week nog graag thuiskomt.</p>
            </div>
          </Reveal>
        </section>

        <div className="amenity-ribbon" aria-label="Voorzieningen in één oogopslag">
          <div>{[...amenities, ...amenities].map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}</div>
        </div>

        <section className="story section-dark">
          <div className="section story-head">
            <Reveal>
              <p className="eyebrow light">De woning</p>
              <h2>Ruimte om samen te zijn.<br /><em>En genoeg ruimte om niets te moeten.</em></h2>
            </Reveal>
          </div>
          <div className="story-grid">
            <div className="story-media story-media-large">
              <Image src="/images/gallery/living.webp" alt="Lichte woonkamer van Ático Hilsol" fill sizes="(max-width: 900px) 100vw, 62vw" />
            </div>
            <Reveal className="story-copy">
              <p className="chapter">01 · Woonverdieping</p>
              <h3>Licht van terras tot keuken.</h3>
              <p>Grote glaspartijen trekken de buitenruimte mee naar binnen. De woonkamer, eethoek en open keuken vormen één rustige leefzone met directe toegang tot het hoekterras.</p>
              <dl className="details"><div><dt>Comfort</dt><dd>Klimaatregeling & wifi</dd></div><div><dt>Aan tafel</dt><dd>Plaats voor zes</dd></div><div><dt>Buiten</dt><dd>Direct naar het hoekterras</dd></div></dl>
            </Reveal>
          </div>
          <div className="story-grid story-grid-reverse">
            <Reveal className="story-copy">
              <p className="chapter">02 · Privésolarium</p>
              <h3>Een volledige verdieping onder de Spaanse hemel.</h3>
              <p>Boven de woning ligt een tweede, private buitenruimte. Hier staan de lounge, eettafel en ligbedden verder van de leefruimte, met een eigen buitenkeuken voor lange avonden boven de residentie.</p>
              <dl className="details"><div><dt>Gebruik</dt><dd>Volledig privé</dd></div><div><dt>Buitenkeuken</dt><dd>Op het solarium</dd></div><div><dt>Ruimte</dt><dd>Lounge, tafel & ligzone</dd></div></dl>
            </Reveal>
            <div className="story-media">
              <Image src="/images/gallery/solarium.webp" alt="Privésolarium met lounge, tafel en ligbedden" fill sizes="(max-width: 900px) 100vw, 58vw" />
            </div>
          </div>
          <div className="bedroom-strip">
            <article><div className="strip-image"><Image src="/images/gallery/master-suite.webp" alt="Mastersuite" fill sizes="33vw" /></div><span>Mastersuite</span></article>
            <article><div className="strip-image"><Image src="/images/gallery/bedroom-one.webp" alt="Tweede slaapkamer" fill sizes="33vw" /></div><span>Slaapkamer 2</span></article>
            <article><div className="strip-image"><Image src="/images/gallery/bedroom-two.webp" alt="Derde slaapkamer" fill sizes="33vw" /></div><span>Slaapkamer 3</span></article>
          </div>
        </section>

        <section className="gallery-section section" id="galerij" aria-labelledby="gallery-title">
          <Reveal className="gallery-heading">
            <p className="eyebrow">De woning in beeld</p>
            <div><h2 id="gallery-title">Niet drie sfeerfoto&apos;s.<br /><em>Je mag de plek echt zien.</em></h2><p>Van slaapkamers en badkamers tot beide terrassen, keuken, zwembad en golfzicht. Klik op een beeld voor de volledige fotoreeks.</p></div>
          </Reveal>
          <Gallery />
        </section>

        <section className="comfort section">
          <Reveal className="comfort-title">
            <p className="eyebrow light">Voorzieningen</p>
            <h2>Alles wat een verblijf <em>moeiteloos maakt.</em></h2>
          </Reveal>
          <div className="comfort-grid">
            <Reveal><article><span>01</span><h3>Thuis aankomen</h3><p>Uitgeruste keuken, woonkamer, wifi, klimaatregeling en voldoende opbergruimte voor een langer verblijf.</p></article></Reveal>
            <Reveal><article><span>02</span><h3>Buiten leven</h3><p>Een hoekterras aan de living én een volledig privésolarium met buitenkeuken, plus het gemeenschappelijke zwembad.</p></article></Reveal>
            <Reveal><article><span>03</span><h3>Vlot onderweg</h3><p>Eigen ondergrondse parkeerplaats. Een auto is aanbevolen; fietsverhuur is op aanvraag en volgens beschikbaarheid mogelijk.</p></article></Reveal>
            <Reveal><article><span>04</span><h3>Rechtstreeks contact</h3><p>Geen onpersoonlijk platform tussen jou en de eigenaar. Je aanvraag gaat rechtstreeks via WhatsApp of e-mail.</p></article></Reveal>
          </div>
        </section>

        <section className="location" id="ligging" aria-labelledby="location-title">
          <div className="section location-intro">
            <Reveal>
              <p className="eyebrow">De omgeving</p>
              <h2 id="location-title">Golf voor de deur.<br /><em>Twee soorten kust binnen bereik.</em></h2>
            </Reveal>
            <Reveal className="location-copy">
              <p>Los Alcázares ligt aan de Mar Menor, een beschutte zoutwaterlagune met rustig water. Aan de andere kant van La Manga begint de open Middellandse Zee.</p>
              <a className="underlink" href="https://www.google.com/maps/dir/?api=1&destination=37.728066%2C-0.868076" target="_blank" rel="noreferrer">Route naar Velapi Golf</a>
            </Reveal>
          </div>
          <div className="location-layout section">
            <div className="location-visual">
              <Image src="/images/gallery/golf-sunset.webp" alt="Avondzicht over La Serena Golf vanuit de residentie" fill sizes="(max-width: 900px) 100vw, 58vw" />
              <div className="location-card"><span>Verblijfsomgeving</span><strong>Velapi Golf</strong><small>30710 Los Alcázares · Región de Murcia</small><p>Exacte aankomstinformatie volgt na bevestiging van het verblijf.</p></div>
            </div>
            <div className="nearby-list">
              {places.map((place) => <article key={place.name}><span>{place.kind}</span><div><h3>{place.name}</h3><p>{place.detail}</p></div><b>{place.time}</b></article>)}
              <small>Afstanden en reistijden zijn indicatief en variëren met route, verkeer en seizoen.</small>
            </div>
          </div>
        </section>

        <section className="golf-panel">
          <Image src="/images/gallery/golf-sunset.webp" alt="Panorama over La Serena Golf" fill sizes="100vw" />
          <div className="golf-shade" />
          <Reveal className="golf-copy">
            <p className="eyebrow light">La Serena Golf</p>
            <h2>Achttien holes.<br /><em>Bijna in de achtertuin.</em></h2>
            <p>De vlakke par-72 baan van Manuel Piñero ligt direct aan de residentie. Water speelt mee op zestien van de achttien holes.</p>
            <a className="button button-light" href="https://www.serenagolf.com/en/golf-course-information" target="_blank" rel="noreferrer">Bekijk La Serena Golf</a>
          </Reveal>
        </section>

        <section className="pricing section" id="prijzen" aria-labelledby="pricing-title">
          <Reveal className="pricing-head">
            <p className="eyebrow">Prijsindicatie</p>
            <div><h2 id="pricing-title">Duidelijke richtprijzen.<br /><em>Persoonlijk bevestigd.</em></h2><p>Minimumverblijf van vier nachten. De definitieve prijs wordt samen met de beschikbaarheid bevestigd.</p></div>
          </Reveal>
          <div className="price-grid">
            {seasons.map((season) => <article key={season.name}><span>{season.name}</span><strong>€ {season.rate}<small>/ nacht</small></strong><p>{new Intl.DateTimeFormat("nl-BE", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${season.start}T12:00:00`))} – {new Intl.DateTimeFormat("nl-BE", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${season.end}T12:00:00`))}</p></article>)}
          </div>
          <p className="pricing-note">Eindschoonmaak € {site.cleaningFee} per verblijf. Terugbetaalbare waarborg € {site.securityDeposit}. Prijzen zijn indicatief tot de eigenaar de aanvraag bevestigt.</p>
        </section>

        <section className="inquiry section" id="aanvragen" aria-labelledby="inquiry-title">
          <Reveal className="inquiry-copy">
            <p className="eyebrow light">Verblijf aanvragen</p>
            <h2 id="inquiry-title">Kies je data.<br /><em>Hilde antwoordt zelf.</em></h2>
            <p>Geen account, geen checkout en geen automatische betaling. Stel je verblijf samen en stuur je aanvraag rechtstreeks door via WhatsApp of e-mail.</p>
            <ol><li><b>01</b><span>Kies je data en gasten</span></li><li><b>02</b><span>Bekijk de prijsindicatie</span></li><li><b>03</b><span>Stuur zelf via WhatsApp of mail</span></li></ol>
          </Reveal>
          <Reveal className="form-wrap"><InquiryForm /></Reveal>
        </section>

        <section className="faq section" id="praktisch">
          <Reveal className="faq-title"><p className="eyebrow">Goed om te weten</p><h2>Duidelijkheid is ook <em>een vorm van luxe.</em></h2></Reveal>
          <div className="faq-list">
            {faq.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}
          </div>
        </section>

        <section className="closing">
          <Image src="/images/gallery/terrace-lounge.webp" alt="Terraslounge van Ático Hilsol" fill sizes="100vw" />
          <div className="closing-shade" />
          <Reveal className="closing-copy"><p className="eyebrow light">Los Alcázares wacht</p><h2>De dag mag hier<br /><em>wat langer duren.</em></h2><a className="button button-light" href="#aanvragen">Vraag je verblijf aan</a></Reveal>
        </section>
      </main>

      <footer className="footer section">
        <div className="footer-brand"><strong>Ático Hilsol</strong><span>Private penthouse residence</span></div>
        <div className="footer-location"><p>Velapi Golf<br />30710 Los Alcázares<br />Región de Murcia · Spanje</p><a href={`mailto:${site.email}`}>{site.email}</a></div>
        <nav aria-label="Voetnavigatie"><a href="#penthouse">Penthouse</a><a href="#galerij">Foto&apos;s</a><a href="#ligging">Omgeving</a><a href="#prijzen">Prijzen</a><a href="/privacy/">Privacy</a><a href="/voorwaarden/">Voorwaarden</a></nav>
        <div className="footer-bottom"><span>© 2026 Ático Hilsol</span><a href="https://deeq-studio.vercel.app" target="_blank" rel="noreferrer">Website door DeeQ Studio</a><a href="#top">Naar boven</a></div>
      </footer>

      <a className="mobile-inquiry" href="#aanvragen"><span>Beschikbaarheid</span><b>Aanvragen</b></a>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </>
  );
}
