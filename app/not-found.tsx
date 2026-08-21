import Link from "next/link";

export default function NotFound() {
  return <main className="not-found"><p className="eyebrow">404</p><h1>Deze kamer bestaat niet.</h1><p>De pagina die je zoekt is verhuisd of bestaat niet meer.</p><Link className="button button-dark" href="/">Terug naar Ático Hilsol</Link></main>;
}
