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
  { src: "/images/gallery/terrace-main.webp", label: "Hoekterras", alt: "Ruim hoekterras van Ático Hilsol met zicht over Velapi Golf en het zwembad" },
  { src: "/images/gallery/dining.webp", label: "Eetruimte & keuken", alt: "Eetruimte met zes okergele stoelen naast de open keuken" },
  { src: "/images/gallery/living.webp", label: "Woonkamer", alt: "Lichte woonkamer met grote glaspartijen naar het terras" },
  { src: "/images/gallery/terrace-lounge.webp", label: "Lounge op het terras", alt: "Loungehoek op het hoekterras met open zicht over de residentie" },
  { src: "/images/gallery/solarium.webp", label: "Privésolarium", alt: "Privésolarium boven het penthouse met lounge, eettafel en ligbedden" },
  { src: "/images/gallery/solarium-dining.webp", label: "Tafel op het dak", alt: "Eettafel op het privésolarium" },
  { src: "/images/gallery/solarium-kitchen.webp", label: "Buitenkeuken", alt: "Buitenkeuken op het privésolarium" },
  { src: "/images/gallery/master-suite.webp", label: "Hoofdslaapkamer", alt: "Hoofdslaapkamer met glazen verbinding naar de ensuite badkamer" },
  { src: "/images/gallery/master-ensuite.webp", label: "Ensuite badkamer", alt: "Privébadkamer bij de hoofdslaapkamer" },
  { src: "/images/gallery/bedroom-one.webp", label: "Tweede slaapkamer", alt: "Tweede slaapkamer met tweepersoonsbed en ingebouwde kasten" },
  { src: "/images/gallery/bedroom-two.webp", label: "Derde slaapkamer", alt: "Derde slaapkamer van Ático Hilsol" },
  { src: "/images/gallery/bedroom-three.webp", label: "Slaapkamerdetail", alt: "Extra zicht op een van de slaapkamers" },
  { src: "/images/gallery/bathroom.webp", label: "Badkamer", alt: "Badkamer met douche, wastafel en toilet", orientation: "portrait" },
  { src: "/images/gallery/bathroom-two.webp", label: "Tweede badkamer", alt: "Tweede badkamer van het penthouse", orientation: "portrait" },
  { src: "/images/gallery/terrace-editorial.webp", label: "Terras in de lengte", alt: "Lang hoekterras met pergola en open zicht over de residentie", orientation: "portrait" },
  { src: "/images/gallery/golf-close.webp", label: "La Serena Golf", alt: "Zicht op de golfbaan van La Serena Golf" },
  { src: "/images/gallery/golf-sunset.webp", label: "Avond over de fairway", alt: "Avondlicht over de golfbaan en residentie" },
];
