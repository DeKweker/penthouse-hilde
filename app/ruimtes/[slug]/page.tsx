import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { spaces } from "@/lib/site";

export function generateStaticParams() { return spaces.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const space = spaces.find((item) => item.slug === slug);
  return space ? { title: space.name, description: space.lead } : {};
}

export default async function SpacePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const space = spaces.find((item) => item.slug === slug);
  if (!space) notFound();
  const current = spaces.findIndex((item) => item.slug === slug);
  const next = spaces[(current + 1) % spaces.length];

  return <main className="room-page space-page">
    <a className="room-back" href="/#ruimtes"><span>←</span> Casa Filou</a>
    <section className="room-hero">
      <Image src={space.image} alt={space.name} fill priority sizes="100vw" />
      <div className="room-veil" />
      <div className="room-hero-copy"><p>{space.number} · {space.kicker}</p><h1>{space.name}</h1><span>Scroll om verder te kijken</span></div>
    </section>
    <section className="room-intro section">
      <Reveal><p className="eyebrow">Ruimte voor het moment</p><h2>{space.lead}</h2></Reveal>
      <Reveal className="room-description"><p>{space.text}</p><div className="room-facts">{space.facts.map((fact) => <span key={fact}>{fact}</span>)}</div></Reveal>
    </section>
    <section className="space-gallery">
      {space.images.map((src, index) => <figure className={`space-gallery-item space-gallery-${index + 1}`} key={src}>
        <Image src={src} alt={`${space.name}, beeld ${index + 1}`} fill sizes="(max-width: 760px) 100vw, 70vw" />
        <figcaption>{String(index + 1).padStart(2, "0")} · {space.name}</figcaption>
      </figure>)}
    </section>
    <section className="room-next section-dark"><p className="eyebrow light">Verder door Casa Filou</p><a href={`/ruimtes/${next.slug}/`}><span>{next.number}</span><h2>{next.name}</h2><span className="room-arrow">→</span></a><a className="button button-light" href="/#aanvragen">Informeer naar een verblijf</a></section>
  </main>;
}
