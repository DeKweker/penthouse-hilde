export const site = {
  name: "Ático Hilsol",
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

export type GalleryImage = {
  src: string;
  alt: string;
  label: string;
  orientation?: "landscape" | "portrait";
};

export const gallery: GalleryImage[] = [
  { src: "/images/gallery/terrace-main.webp", label: "Hoekterras", alt: "Ruim hoekterras van Ático Hilsol met zicht op de residentie en het zwembad" },
  { src: "/images/gallery/living.webp", label: "Living", alt: "Lichte woonkamer met zithoek en grote glaspartijen naar het terras" },
  { src: "/images/gallery/dining.webp", label: "Eetruimte", alt: "Eettafel voor zes naast de open keuken en glazen trap" },
  { src: "/images/gallery/terrace-lounge.webp", label: "Terraslounge", alt: "Loungehoek op het terras met open zicht over Velapi Golf" },
  { src: "/images/gallery/master-suite.webp", label: "Mastersuite", alt: "Hoofdslaapkamer van het penthouse" },
  { src: "/images/gallery/bedroom-one.webp", label: "Slaapkamer 2", alt: "Tweede slaapkamer met tweepersoonsbed en rustige afwerking" },
  { src: "/images/gallery/bedroom-two.webp", label: "Slaapkamer 3", alt: "Derde slaapkamer in Ático Hilsol" },
  { src: "/images/gallery/bedroom-three.webp", label: "Slaapkamer", alt: "Slaapkamer met lichte neutrale inrichting" },
  { src: "/images/gallery/master-ensuite.webp", label: "Ensuite", alt: "Privébadkamer verbonden met de mastersuite" },
  { src: "/images/gallery/bathroom.webp", label: "Badkamer", alt: "Volwaardige badkamer met douche, wastafel en toilet", orientation: "portrait" },
  { src: "/images/gallery/bathroom-two.webp", label: "Badkamer 2", alt: "Tweede badkamer van het penthouse", orientation: "portrait" },
  { src: "/images/gallery/solarium.webp", label: "Privésolarium", alt: "Groot privésolarium boven het penthouse met lounge, tafel en ligbedden" },
  { src: "/images/gallery/solarium-dining.webp", label: "Buiten eten", alt: "Eettafel op het privésolarium" },
  { src: "/images/gallery/solarium-kitchen.webp", label: "Buitenkeuken", alt: "Buitenkeuken op het privésolarium" },
  { src: "/images/gallery/terrace-editorial.webp", label: "Hoekterras", alt: "Lang hoekterras met pergola en open zicht over de residentie", orientation: "portrait" },
  { src: "/images/gallery/golf-close.webp", label: "La Serena Golf", alt: "Dicht zicht op de golfbaan van La Serena Golf" },
  { src: "/images/gallery/golf-sunset.webp", label: "Avondzicht", alt: "Avondlicht over de golfbaan en residentie" },
];
