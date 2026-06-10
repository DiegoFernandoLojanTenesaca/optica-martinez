// NOTA: marcas de ejemplo. Confirmar con la óptica cuáles venden realmente
// y reemplazar esta lista (idealmente por logos en /public).
const BRANDS = ["MAX&Co", "Ray-Ban", "Vogue", "Carrera", "Police", "Tommy Hilfiger", "Oakley"];

export default function BrandStrip() {
  const row = [...BRANDS, ...BRANDS];
  return (
    <section className="overflow-hidden border-y border-hairline bg-sand py-10">
      <div className="mx-auto mb-7 max-w-[1400px] px-6 lg:px-10">
        <span className="kicker">Trabajamos con marcas que conoces</span>
      </div>
      <div className="relative flex overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {row.map((b, i) => (
            <span
              key={i}
              className="mx-8 font-display text-2xl ink/70 lg:mx-12 lg:text-3xl"
              style={{ fontWeight: 400, opacity: 0.55 }}
            >
              {b}
            </span>
          ))}
        </div>
        <div className="flex animate-marquee whitespace-nowrap" aria-hidden>
          {row.map((b, i) => (
            <span
              key={`b-${i}`}
              className="mx-8 font-display text-2xl lg:mx-12 lg:text-3xl"
              style={{ fontWeight: 400, opacity: 0.55 }}
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
