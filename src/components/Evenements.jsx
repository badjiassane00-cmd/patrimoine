import { events } from "../data/content";

export default function Evenements() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-3 flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-terracotta">
        <span className="h-px w-8 bg-terracotta" aria-hidden="true" />
        AGENDA CULTUREL
      </div>
      <h2 className="font-display text-3xl text-ink sm:text-4xl">
        Célébrations &amp; Événements à Venir
      </h2>

      <div className="mt-10 flex flex-col gap-4">
        {events.map((event) => (
          <article
            key={event.title}
            className="flex flex-col gap-4 rounded-md border border-ink/10 bg-white/50 p-6 sm:flex-row sm:items-center sm:justify-between"
          >
            {event.image && <img src={event.image} alt={`Photo associée à ${event.title}`} className="h-32 w-full rounded object-cover sm:h-24 sm:w-36" loading="lazy" />}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="shrink-0 sm:w-48">
                <p className="text-sm font-semibold text-terracotta">{event.date}</p>
                <p className="text-xs text-ink/50">{event.place}</p>
              </div>
              <div className="sm:border-l sm:border-ink/10 sm:pl-6">
                <h3 className="font-display text-lg text-ink">{event.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink/60">
                  {event.desc}
                </p>
              </div>
            </div>
            <button className="shrink-0 self-start rounded border border-ink/20 px-5 py-2.5 text-sm font-semibold text-ink hover:border-ink sm:self-center">
              S'informer
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
