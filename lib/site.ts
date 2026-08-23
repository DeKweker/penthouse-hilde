export const site = {
  name: "Casa Filou",
  location: "Velapi Golf · Los Alcázares · Murcia",
  email: "hilde.dequeecker@gmail.com",
  whatsapp: "32497170956",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://appartement-hilde.vercel.app",
  minNights: 4,
  maxGuests: 6,
  cleaningFee: 95,
  securityDeposit: 300,
};

export const seasons = [
  { name: "Zomer 2026", start: "2026-07-01", end: "2026-08-31", rate: 255 },
  { name: "Najaar 2026", start: "2026-09-01", end: "2026-10-31", rate: 205 },
  { name: "Winterzon", start: "2026-11-01", end: "2027-03-31", rate: 175 },
  { name: "Voorjaar 2027", start: "2027-04-01", end: "2027-06-30", rate: 195 },
] as const;

export type GalleryImage = { src: string; alt: string; label: string; chapter: string };

export const gallery: GalleryImage[] = [
  { src: "/images/gallery/terrace-main.webp", chapter: "Buitenleven", label: "Het hoekterras", alt: "Het ruime hoekterras van Casa Filou met zicht over het zwembad" },
  { src: "/images/gallery/terrace-lounge.webp", chapter: "Buitenleven", label: "Lounge aan de leefruimte", alt: "De beschutte loungehoek op het terras" },
  { src: "/images/gallery/terrace-editorial.webp", chapter: "Buitenleven", label: "Terras in de lengte", alt: "Het lange hoekterras met pergola" },
  { src: "/images/gallery/solarium.webp", chapter: "Het dak", label: "Privésolarium", alt: "Het privésolarium met lounge, eettafel en ligbedden" },
  { src: "/images/gallery/solarium-dining.webp", chapter: "Het dak", label: "Tafel onder de open hemel", alt: "De eettafel op het privésolarium" },
  { src: "/images/gallery/solarium-kitchen.webp", chapter: "Het dak", label: "Buitenkeuken", alt: "De buitenkeuken op het privésolarium" },
  { src: "/images/gallery/dining.webp", chapter: "Leven", label: "Eetruimte en keuken", alt: "Eetruimte met zes okergele stoelen naast de open keuken" },
  { src: "/images/gallery/living.webp", chapter: "Leven", label: "De woonkamer", alt: "Lichte woonkamer met glaspartijen naar het terras" },
  { src: "/images/gallery/master-suite.webp", chapter: "Slapen", label: "Mastersuite", alt: "Mastersuite met glazen verbinding naar de ensuite badkamer" },
  { src: "/images/gallery/master-ensuite.webp", chapter: "Slapen", label: "Ensuite", alt: "Privébadkamer van de mastersuite" },
  { src: "/images/gallery/bedroom-one.webp", chapter: "Slapen", label: "De groene kamer", alt: "Slaapkamer met tweepersoonsbed, groene tinten en ingebouwde kasten" },
  { src: "/images/gallery/bedroom-three.webp", chapter: "Slapen", label: "De lichte kamer", alt: "Slaapkamer met tweepersoonsbed en zachte neutrale tinten" },
  { src: "/images/gallery/bathroom.webp", chapter: "Slapen", label: "Badkamer", alt: "Gedeelde badkamer met inloopdouche" },
  { src: "/images/gallery/bathroom-two.webp", chapter: "Slapen", label: "Badkamerdetail", alt: "Tweede zicht op de gedeelde badkamer" },
  { src: "/images/gallery/golf-close.webp", chapter: "Omgeving", label: "La Serena Golf", alt: "La Serena Golf naast Casa Filou" },
  { src: "/images/gallery/golf-sunset.webp", chapter: "Omgeving", label: "Avond over de fairway", alt: "Avondlicht over de golfbaan en residentie" },
];

export const rooms = [
  { slug: "mastersuite", number: "01", name: "Mastersuite", kicker: "Eigen rust", image: "/images/gallery/master-suite.webp", images: ["/images/gallery/master-suite.webp", "/images/gallery/master-ensuite.webp"], lead: "Een rustige kamer met een directe, glazen verbinding naar de eigen badkamer.", text: "De mastersuite ligt als een eigen plek binnen het penthouse. Het brede bed, de houten lattenwand en het zachte kleurenpalet houden de ruimte kalm. Achter het matte glas ligt de ensuite met inloopdouche.", facts: ["Tweepersoonsbed", "Eigen badkamer", "Ingebouwde kast", "Airconditioning"] },
  { slug: "groene-kamer", number: "02", name: "De groene kamer", kicker: "Zacht en geborgen", image: "/images/gallery/bedroom-one.webp", images: ["/images/gallery/bedroom-one.webp", "/images/gallery/bathroom.webp"], lead: "Saliegroen, warm hout en een kamer die zich terugtrekt van de levendigheid buiten.", text: "Deze volwaardige tweepersoonskamer heeft een eigen sfeer en veel bergruimte. De tweede badkamer ligt vlakbij en wordt gedeeld met de lichte kamer.", facts: ["Tweepersoonsbed", "Ingebouwde kast", "Badkamer vlakbij", "Airconditioning"] },
  { slug: "lichte-kamer", number: "03", name: "De lichte kamer", kicker: "Eenvoud met ruimte", image: "/images/gallery/bedroom-three.webp", images: ["/images/gallery/bedroom-three.webp", "/images/gallery/bathroom-two.webp"], lead: "Een helder slaapvertrek in zand, wit en hout, gemaakt voor lange, stille nachten.", text: "Ook de derde slaapkamer is ingericht als echte tweepersoonskamer. Geen bijbed of compromis, wel dezelfde aandacht voor comfort, opbergruimte en een rustige nachtrust.", facts: ["Tweepersoonsbed", "Kledingkast", "Gedeelde badkamer", "Airconditioning"] },
] as const;

export const spaces = [
  {
    slug: "hoekterras", number: "01", name: "Het hoekterras", kicker: "Aan de leefruimte",
    image: "/images/gallery/terrace-main.webp",
    images: ["/images/gallery/terrace-main.webp", "/images/gallery/terrace-lounge.webp", "/images/gallery/terrace-editorial.webp"],
    lead: "De plek waar ontbijt ongemerkt overgaat in een lange middag buiten.",
    text: "Het terras loopt om de hoek van de leefruimte en voelt daardoor niet als een balkon, maar als een volwaardige buitenkamer. Er is plaats om samen te eten, in de schaduw te zitten en uit te kijken over het zwembad en de residentie.",
    facts: ["Direct aan de woonkamer", "Eettafel en lounge", "Schaduw onder de pergola", "Zicht over het zwembad"],
  },
  {
    slug: "privesolarium", number: "02", name: "Het privésolarium", kicker: "Een verdieping hoger",
    image: "/images/gallery/solarium.webp",
    images: ["/images/gallery/solarium.webp", "/images/gallery/solarium-dining.webp", "/images/gallery/solarium-kitchen.webp"],
    lead: "Een tweede buitenverdieping, helemaal privé en open naar de lucht.",
    text: "Boven Casa Filou ligt een plek met een ander ritme. Hier kook je buiten, schuif je aan rond de tafel en blijf je nog even zitten wanneer het licht zachter wordt. Lounge, ligbedden en buitenkeuken maken van het dak een bestemming op zichzelf.",
    facts: ["Volledig privé", "Buitenkeuken", "Eettafel en lounge", "Ligruimte"],
  },
  {
    slug: "leefruimte", number: "03", name: "De leefruimte", kicker: "Binnen en buiten verbonden",
    image: "/images/gallery/dining.webp",
    images: ["/images/gallery/dining.webp", "/images/gallery/living.webp", "/images/gallery/terrace-main.webp"],
    lead: "Licht, open en gemaakt om met zes samen te zijn zonder op elkaar te zitten.",
    text: "De keuken, eettafel en zithoek vormen één rustige ruimte. Grote glaspartijen trekken het daglicht naar binnen en zetten de deur naar het terras letterlijk en figuurlijk open. De okergele stoelen zijn het warme accent in een verder zachte basis van wit, hout en steen.",
    facts: ["Open keuken", "Eettafel voor zes", "Directe terrasverbinding", "Airconditioning"],
  },
] as const;
