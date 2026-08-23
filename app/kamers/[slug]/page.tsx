import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { rooms } from "@/lib/site";

export function generateStaticParams() { return rooms.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const room = rooms.find((item) => item.slug === slug);
  return room ? { title: room.name, description: room.lead } : {};
}

export default async function RoomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const room = rooms.find((item) => item.slug === slug);
  if (!room) notFound();
  const current = rooms.findIndex((item) => item.slug === slug);
  const next = rooms[(current + 1) % rooms.length];

  return <main className="room-page">
    <a className="room-back" href="/#slapen"><span>←</span> Casa Filou</a>
    <section className="room-hero">
      <Image src={room.image} alt={room.name} fill priority sizes="100vw" />
      <div className="room-veil" />
      <div className="room-hero-copy"><p>{room.number} · {room.kicker}</p><h1>{room.name}</h1><span>Scroll om binnen te kijken</span></div>
    </section>

    <section className="room-intro section">
      <Reveal><p className="eyebrow">Een kamer op zichzelf</p><h2>{room.lead}</h2></Reveal>
      <Reveal className="room-description"><p>{room.text}</p><div className="room-facts">{room.facts.map((fact) => <span key={fact}>{fact}</span>)}</div></Reveal>
    </section>

    <section className="room-pair">
      {room.images.map((src, index) => <Reveal className={`room-photo room-photo-${index + 1}`} key={src}><Image src={src} alt={`${room.name}, ${index === 0 ? "slaapruimte" : "badkamer"}`} fill sizes="(max-width: 760px) 100vw, 62vw" /></Reveal>)}
      <p className="room-photo-note">{slug === "mastersuite" ? "Slaapkamer en ensuite vormen samen één privézone." : "De gedeelde badkamer ligt op dezelfde woonlaag."}</p>
    </section>

    <section className="room-next section-dark">
      <p className="eyebrow light">Volgende kamer</p>
      <a href={`/kamers/${next.slug}/`}><span>{next.number}</span><h2>{next.name}</h2><span className="room-arrow">→</span></a>
      <a className="button button-light" href="/#aanvragen">Informeer naar een verblijf</a>
    </section>
  </main>;
}
