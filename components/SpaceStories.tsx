import Image from "next/image";
import { spaces } from "@/lib/site";
import { Reveal } from "@/components/Reveal";

export function SpaceStories() {
  return <section className="space-stories" id="ruimtes" aria-label="Ontdek Casa Filou per ruimte">
    <header className="space-stories-head section">
      <p className="eyebrow">Drie manieren om hier te zijn</p>
      <h2>Niet zomaar ruimtes.<br /><em>Elk een eigen moment.</em></h2>
    </header>
    {spaces.map((space) => <article className={`space-chapter space-${space.slug}`} key={space.slug}>
      <Reveal variant="media" className="space-media-reveal">
        <a className="space-chapter-media" href={`/ruimtes/${space.slug}/`} aria-label={`Ontdek ${space.name}`}>
          <Image src={space.image} alt={space.name} fill sizes="(max-width: 760px) 100vw, 72vw" />
          <span className="space-chapter-index">{space.number} / 03</span>
        </a>
      </Reveal>
      <Reveal className="space-chapter-copy">
        <p>{space.kicker}</p>
        <h3>{space.name}</h3>
        <span>{space.lead}</span>
        <a href={`/ruimtes/${space.slug}/`}>Bekijk de ruimte <i>↗</i></a>
      </Reveal>
    </article>)}
  </section>;
}
