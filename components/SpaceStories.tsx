import Image from "next/image";
import { spaces } from "@/lib/site";

export function SpaceStories() {
  return <section className="space-stories" id="ruimtes" aria-label="Ontdek Casa Filou per ruimte">
    <header className="space-stories-head section">
      <p className="eyebrow">Drie manieren om hier te zijn</p>
      <h2>Niet zomaar ruimtes.<br /><em>Elk een eigen moment.</em></h2>
    </header>
    {spaces.map((space, index) => <article className={`space-chapter space-${space.slug}`} key={space.slug}>
      <a className="space-chapter-media" href={`/ruimtes/${space.slug}/`} aria-label={`Ontdek ${space.name}`}>
        <Image src={space.image} alt={space.name} fill sizes="100vw" />
        <span className="space-chapter-index">{space.number} / 03</span>
      </a>
      <div className="space-chapter-copy">
        <p>{space.kicker}</p>
        <h3>{space.name}</h3>
        <span>{space.lead}</span>
        <a href={`/ruimtes/${space.slug}/`}>Bekijk de ruimte <i>↗</i></a>
      </div>
      <span className="space-word" aria-hidden="true">{index === 0 ? "buiten" : index === 1 ? "boven" : "samen"}</span>
    </article>)}
  </section>;
}
