import type { Metadata } from "next";
import { Reveal } from "@/components/ui/reveal";
import { getTechniques } from "@/lib/content";

export const metadata: Metadata = {
  title: "Techniques",
  description:
    "Short kitchen skill guides. These are the same notes linked from recipe steps.",
};

export default async function TechniquesPage() {
  const techniques = await getTechniques();
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <header>
        <p className="font-mono text-xs uppercase tracking-widest text-fg-faint">
          Kitchen skills
        </p>
        <h1 className="mt-1 font-display text-4xl sm:text-5xl">Techniques</h1>
        <p className="mt-3 text-fg-soft">
          The moves that show up again and again. Recipe steps link straight to
          these.
        </p>
      </header>

      <div className="mt-10 space-y-4">
        {techniques.map((technique, index) => (
          <Reveal key={technique.slug} delay={index * 0.04}>
            <article
              id={technique.slug}
              className="card-paper scroll-mt-24 p-6"
            >
              <h2 className="font-display text-2xl">{technique.name}</h2>
              <p className="mt-1 text-sm font-medium text-ember">
                {technique.summary}
              </p>
              <p className="mt-3 text-fg-soft">{technique.detail}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
