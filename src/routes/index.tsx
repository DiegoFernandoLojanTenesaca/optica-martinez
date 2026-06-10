import { lazy, Suspense, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import {
  Eye,
  Star,
  Phone,
  MapPin,
  Clock,
  Instagram,
  Menu,
  X,
  MessageCircle,
  ArrowUpRight,
  ArrowRight,
  Aperture,
  ScanEye,
  CircleDot,
  Layers,
  Sparkle,
  ShieldCheck,
} from "lucide-react";

const Glasses3D = lazy(() => import("@/components/Glasses3D"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Óptica Martínez · Óptica de precisión en Loja, Ecuador" },
      {
        name: "description",
        content:
          "Óptica de precisión en Loja. Examen visual sin costo, armazones de autor y lunas de alta tecnología. 5.0★ en Google. Lic. Luis Martínez, Mgtr.",
      },
      { property: "og:title", content: "Óptica Martínez · Loja, Ecuador" },
      {
        property: "og:description",
        content:
          "Examen visual sin costo, armazones de autor y lunas de alta tecnología en el centro de Loja.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Landing,
});

const WHATSAPP_URL =
  "https://wa.me/593967794351?text=" +
  encodeURIComponent("Hola, quiero agendar mi examen visual gratis");

const EASE = [0.16, 1, 0.3, 1] as const;

const navItems = [
  { label: "Servicios", href: "#servicios", n: "01" },
  { label: "Colección", href: "#coleccion", n: "02" },
  { label: "Nosotros", href: "#nosotros", n: "03" },
  { label: "Reseñas", href: "#resenas", n: "04" },
  { label: "Visítanos", href: "#visitanos", n: "05" },
];

function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

/* -------------------------------------------------------- HEADER */
function Header() {
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-hairline bg-background/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-6 px-6 py-5 lg:px-10">
        <a href="#top" className="flex items-center gap-3">
          <motion.img
            src="/logo.jpg"
            alt="Óptica Martínez — Optometría"
            initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
            whileHover={{ rotate: 6, scale: 1.06 }}
            className="h-11 w-11 rounded-full"
          />
          <span
            className="hidden font-display text-xl tracking-tight ink sm:block"
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
          >
            <span className="italic">Óptica</span>&nbsp;Martínez
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="group flex items-baseline gap-1.5 text-sm font-medium text-ink/80 transition-colors hover:text-primary"
            >
              <span className="text-[10px] text-primary/70">{n.n}</span>
              <span className="ul-link">{n.label}</span>
            </a>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-3">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-background transition-all hover:bg-primary md:inline-flex"
          >
            Agendar examen
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-hairline md:hidden"
            aria-label="Menú"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-hairline bg-background/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col px-6 py-4">
            {navItems.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-3 border-b border-hairline py-4 text-base ink"
              >
                <span className="text-[10px] text-primary">{n.n}</span>
                {n.label}
              </a>
            ))}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-4 rounded-full bg-[var(--color-ink)] px-5 py-3 text-center text-xs font-medium uppercase tracking-[0.14em] text-background"
            >
              Agendar examen
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

/* -------------------------------------------------------- HERO */
const heroLine: Variants = {
  hidden: { y: "110%" },
  show: (i: number = 0) => ({
    y: 0,
    transition: { duration: 0.95, ease: EASE, delay: 0.15 + i * 0.08 },
  }),
};

function Hero() {
  const { scrollY } = useScroll();
  const y3d = useTransform(scrollY, [0, 600], [0, 90]);
  const opacityScroll = useTransform(scrollY, [0, 200], [1, 0]);

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-background pt-28 lg:pt-32"
    >
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        {/* Top meta row */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex items-baseline justify-between border-b border-hairline pb-5"
        >
          <span className="kicker">Óptica Martínez · Loja, Ecuador</span>
          <span className="hidden font-display text-xs tracking-wider text-muted-foreground sm:block">
            Est. — Plaza TOA
          </span>
        </motion.div>

        <div className="relative grid grid-cols-12 gap-6 pt-10 lg:gap-10 lg:pt-16">
          {/* Headline — left, spans most of grid */}
          <div className="col-span-12 lg:col-span-6 lg:pr-4">
            <h1
              className="font-display tracking-[-0.04em] ink"
              style={{
                fontSize: "clamp(3.25rem, 9vw, 7rem)",
                lineHeight: 0.95,
                fontWeight: 400,
              }}
            >
              <span className="block overflow-hidden">
                <motion.span custom={0} variants={heroLine} initial="hidden" animate="show" className="block">
                  Ver bien,
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span custom={1} variants={heroLine} initial="hidden" animate="show" className="block">
                  para <span className="display-italic text-primary">vivir</span>
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span custom={2} variants={heroLine} initial="hidden" animate="show" className="block">
                  <span className="display-italic">mejor.</span>
                </motion.span>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.7 }}
              className="mt-10 max-w-md text-pretty text-base leading-relaxed text-muted-foreground"
            >
              Óptica de precisión en el centro de Loja. Diagnóstico clínico
              riguroso, armazones seleccionados con criterio y lunas de alta
              tecnología — al cuidado del Lic. Luis Martínez, Mgtr.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.85 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-3 rounded-full bg-[var(--color-ink)] px-7 py-4 text-xs font-medium uppercase tracking-[0.16em] text-background transition-all hover:bg-primary hover:shadow-[0_20px_40px_-20px_hsl(243_60%_47%/0.55)]"
              >
                Reservar examen sin costo
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.5}
                />
              </a>
              <a
                href="#coleccion"
                className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] ink ul-link"
              >
                Explorar la colección
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </a>
            </motion.div>

            {/* Trust row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: EASE, delay: 1.1 }}
              className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-hairline pt-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-primary text-primary"
                      strokeWidth={1}
                    />
                  ))}
                </div>
                <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  5.0 · Google Reviews
                </span>
              </div>
              <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Reseñas verificadas
              </div>
              <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Examen garantizado
              </div>
            </motion.div>
          </div>

          {/* 3D — right, bleeds */}
          <motion.div
            style={{ y: y3d }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.5 }}
            className="relative col-span-12 h-[420px] sm:h-[520px] lg:col-span-6 lg:h-[560px]"
          >
            <div className="absolute inset-0 animate-float">
              <Suspense
                fallback={
                  <div className="grid h-full w-full place-items-center text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Cargando…
                  </div>
                }
              >
                <Glasses3D />
              </Suspense>
            </div>
            {/* corner annotations */}
            <div className="pointer-events-none absolute left-0 top-6 hidden flex-col gap-1 lg:flex">
              <span className="kicker">N°</span>
              <span className="font-display text-sm ink">/ 001</span>
            </div>
            <div className="pointer-events-none absolute bottom-8 right-2 hidden text-right lg:block">
              <span className="kicker">Modelo</span>
              <div className="font-display text-sm ink">Aviator · MAX&Co</div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          style={{ opacity: opacityScroll }}
          className="mt-10 flex items-center justify-between border-t border-hairline py-5"
        >
          <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Desplazar
          </span>
          <div className="h-px w-24 origin-left animate-pulse bg-[var(--color-ink)] opacity-30" />
          <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            01 — 05
          </span>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------- SECTION HEADER */
function SectionHeader({
  n,
  kicker,
  title,
  intro,
}: {
  n: string;
  kicker: string;
  title: React.ReactNode;
  intro?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: EASE }}
      className="grid grid-cols-12 items-end gap-6 border-b border-hairline pb-8 lg:gap-10"
    >
      <div className="col-span-12 flex items-baseline gap-4 lg:col-span-5">
        <span
          className="font-display text-5xl text-ink/30 lg:text-6xl"
          style={{ fontWeight: 300 }}
        >
          {n}
        </span>
        <span className="kicker">— {kicker}</span>
      </div>
      <div className="col-span-12 lg:col-span-7">
        <h2
          className="font-display tracking-[-0.03em] ink"
          style={{
            fontSize: "clamp(2.25rem, 5vw, 4.25rem)",
            lineHeight: 1,
            fontWeight: 400,
          }}
        >
          {title}
        </h2>
        {intro && (
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
            {intro}
          </p>
        )}
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------- SERVICES */
const services = [
  {
    icon: ScanEye,
    title: "Examen visual sin costo",
    desc: "Evaluación clínica completa con equipamiento de última generación. Diagnóstico riguroso y plan personalizado.",
  },
  {
    icon: Layers,
    title: "Lunas oftálmicas",
    desc: "Lunas monofocales, progresivas y ocupacionales con tratamientos antirreflejo, fotocromáticos y filtro luz azul.",
  },
  {
    icon: Aperture,
    title: "Armazones de autor",
    desc: "Selección curada con marcas referentes como MAX&Co. Asesoría individual según morfología y estilo.",
  },
  {
    icon: CircleDot,
    title: "Lentes de contacto",
    desc: "Adaptación profesional de lentes blandos, tóricos y especializados. Seguimiento clínico continuo.",
  },
  {
    icon: Sparkle,
    title: "Cuidado y accesorios",
    desc: "Estuches, soluciones de limpieza y accesorios premium para prolongar la vida útil de su equipo visual.",
  },
  {
    icon: ShieldCheck,
    title: "Garantía y postventa",
    desc: "Lunas y armazones garantizados. Ajustes, mantenimiento y acompañamiento durante todo el uso.",
  },
];

function Services() {
  return (
    <section id="servicios" className="bg-background py-24 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <SectionHeader
          n="01"
          kicker="Servicios"
          title={
            <>
              Cuidado visual <span className="display-italic">de precisión.</span>
            </>
          }
          intro="Una práctica clínica centrada en el paciente: diagnóstico minucioso, soluciones técnicas adecuadas y un seguimiento que respalda cada decisión."
        />

        <div className="mt-16 grid grid-cols-12 gap-x-6 gap-y-12 lg:gap-x-10">
          {services.map((s, i) => (
            <motion.article
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: EASE, delay: (i % 3) * 0.08 }}
              className="group relative col-span-12 border-t border-hairline pt-6 sm:col-span-6 lg:col-span-4"
            >
              {/* Drawn accent line */}
              <span className="absolute left-0 top-0 h-px w-0 bg-[var(--color-ink)] transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
              <div className="flex items-baseline justify-between">
                <s.icon className="h-5 w-5 text-primary" strokeWidth={1.25} />
                <span className="font-display text-xs text-muted-foreground">
                  /{String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-8 font-display text-2xl tracking-tight ink" style={{ fontWeight: 400 }}>
                {s.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {s.desc}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------- COLLECTION */
const collection = [
  { name: "Aviator Heritage", brand: "MAX&Co", tone: "from-[#14143E] to-[#322EC0]", h: "h-[520px]" },
  { name: "Round Atelier", brand: "MAX&Co", tone: "from-[#EEF0FB] to-[#cbceef]", h: "h-[380px]" },
  { name: "Cat Eye Editorial", brand: "MAX&Co", tone: "from-[#322EC0] to-[#24228A]", h: "h-[440px]" },
  { name: "Square Architect", brand: "MAX&Co", tone: "from-[#1a1a30] to-[#14143E]", h: "h-[500px]" },
  { name: "Wire Minimalist", brand: "MAX&Co", tone: "from-[#cbceef] to-[#EEF0FB]", h: "h-[360px]" },
  { name: "Acetate Maison", brand: "MAX&Co", tone: "from-[#24228A] to-[#14143E]", h: "h-[480px]" },
];

function GlassesSilhouette({ light = false }: { light?: boolean }) {
  const stroke = light ? "#FBFBFE" : "#14143E";
  return (
    <svg viewBox="0 0 220 90" className="w-3/5" fill="none">
      <circle cx="60" cy="45" r="32" stroke={stroke} strokeWidth="1.5" />
      <circle cx="160" cy="45" r="32" stroke={stroke} strokeWidth="1.5" />
      <path d="M92 42 Q110 32 128 42" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M28 38 L6 32" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M192 38 L214 32" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CollectionCard({ item, i }: { item: typeof collection[0]; i: number }) {
  const [t, setT] = useState({ x: 0, y: 0 });
  const light = i % 2 === 0;
  return (
    <motion.figure
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: EASE, delay: (i % 3) * 0.07 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        setT({ x: py * -6, y: px * 8 });
      }}
      onMouseLeave={() => setT({ x: 0, y: 0 })}
      style={{ transform: `perspective(1200px) rotateX(${t.x}deg) rotateY(${t.y}deg)` }}
      className="group [transform-style:preserve-3d] transition-transform duration-300 ease-out"
    >
      <div
        className={`relative overflow-hidden bg-gradient-to-br ${item.tone} ${item.h}`}
      >
        {/* Duotone teal wash */}
        <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
        <div className="absolute inset-0 grid place-items-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]">
          <GlassesSilhouette light={light ? false : true} />
        </div>
        <div className="absolute left-4 top-4 font-display text-xs text-background/70 mix-blend-difference">
          /{String(i + 1).padStart(2, "0")}
        </div>
      </div>
      <figcaption className="mt-5 flex items-baseline justify-between border-t border-hairline pt-4">
        <div>
          <p className="kicker">{item.brand}</p>
          <h3 className="mt-1 font-display text-xl ink" style={{ fontWeight: 400 }}>
            {item.name}
          </h3>
        </div>
        <ArrowUpRight
          className="h-4 w-4 ink transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          strokeWidth={1.5}
        />
      </figcaption>
    </motion.figure>
  );
}

function Collection() {
  return (
    <section id="coleccion" className="relative overflow-hidden bg-sand py-24 lg:py-36 grain">
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <SectionHeader
          n="02"
          kicker="Colección"
          title={
            <>
              Armazones <span className="display-italic">seleccionados</span> con criterio.
            </>
          }
          intro="Una curaduría que reúne marcas referentes como MAX&Co. Piezas con identidad, calidad de manufactura y un ajuste pensado para cada rostro."
        />

        {/* Editorial masonry */}
        <div className="mt-16 grid grid-cols-12 gap-x-6 gap-y-12 lg:gap-x-10">
          <div className="col-span-12 sm:col-span-6 lg:col-span-5 lg:mt-12">
            <CollectionCard item={collection[0]} i={0} />
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-4">
            <CollectionCard item={collection[1]} i={1} />
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3 lg:mt-20">
            <CollectionCard item={collection[2]} i={2} />
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-4">
            <CollectionCard item={collection[3]} i={3} />
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3 lg:mt-12">
            <CollectionCard item={collection[4]} i={4} />
          </div>
          <div className="col-span-12 sm:col-span-12 lg:col-span-5">
            <CollectionCard item={collection[5]} i={5} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------- ABOUT */
function About() {
  return (
    <section id="nosotros" className="bg-background py-24 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <SectionHeader
          n="03"
          kicker="Nosotros"
          title={
            <>
              Práctica clínica con <span className="display-italic">criterio humano.</span>
            </>
          }
        />

        <div className="mt-16 grid grid-cols-12 gap-6 lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="col-span-12 lg:col-span-7"
          >
            <p
              className="font-display text-2xl leading-snug ink lg:text-3xl"
              style={{ fontWeight: 400 }}
            >
              Brindamos una experiencia de salud visual rigurosa y cercana:
              <span className="display-italic"> exámenes garantizados</span>,
              lunas de alta tecnología a precios responsables y una asesoría
              honesta para elegir la pieza adecuada — sin atajos, sin
              fórmulas genéricas.
            </p>

            <div className="mt-12 grid gap-x-10 gap-y-6 sm:grid-cols-2">
              {[
                "Optómetras certificados con formación de posgrado",
                "Equipamiento clínico moderno y calibrado",
                "Asesoría honesta y sin presiones comerciales",
                "Garantía respaldada en lunas y armazones",
              ].map((p) => (
                <div key={p} className="flex items-start gap-3 border-t border-hairline pt-4">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="text-sm leading-relaxed ink">{p}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
            className="col-span-12 flex flex-col gap-px bg-hairline lg:col-span-5"
          >
            {[
              { name: "Lic. Luis Martínez, Mgtr.", role: "Optómetra · Fundador", n: "01" },
              { name: "Ana Gabriela Anguisaca", role: "Atención y asesoría visual", n: "02" },
            ].map((m) => (
              <div
                key={m.name}
                className="flex items-start justify-between gap-6 bg-background p-8"
              >
                <div>
                  <span className="kicker">Equipo / {m.n}</span>
                  <p
                    className="mt-3 font-display text-2xl ink"
                    style={{ fontWeight: 400 }}
                  >
                    {m.name}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{m.role}</p>
                </div>
                <Eye className="h-5 w-5 text-primary" strokeWidth={1.25} />
              </div>
            ))}
            <div className="flex items-end justify-between bg-[var(--color-ink)] p-8 text-background">
              <div>
                <span
                  className="font-display text-xs uppercase tracking-[0.18em] text-background/60"
                >
                  Confianza
                </span>
                <p
                  className="mt-3 font-display text-5xl"
                  style={{ fontWeight: 300 }}
                >
                  5.0★
                </p>
                <p className="mt-2 text-sm text-background/70">
                  calificación promedio en Google Reviews
                </p>
              </div>
              <span className="font-display text-xs text-background/40">/ 03</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------- REVIEWS */
const reviews = [
  {
    name: "Fernando Lojan",
    text: "Muy buena atención desde el primer momento. Fueron amables, pacientes y resolvieron todas mis dudas durante el examen visual. Me asesoraron muy bien en la elección de mis lentes.",
  },
  {
    name: "Maily Chamba",
    text: "Excelente servicio. El examen de vista fue muy completo y se nota que trabajan con tecnología de calidad. El personal es muy profesional.",
  },
  {
    name: "Carlos Severino",
    text: "La mejor óptica de Loja. Excelente servicio y atención.",
  },
  {
    name: "María Fernanda Correa",
    text: "La atención es increíble, te asesoran en todo y aclaran todas las dudas. Recomendadísimo.",
  },
];

function Reviews() {
  return (
    <section id="resenas" className="bg-sand py-24 lg:py-36 relative overflow-hidden grain">
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <SectionHeader
          n="04"
          kicker="Reseñas"
          title={
            <>
              Pacientes que <span className="display-italic">recomiendan.</span>
            </>
          }
          intro="5.0 estrellas en Google Reviews. Testimonios reales de quienes confían en nuestro trabajo."
        />

        <div className="mt-16 grid grid-cols-12 gap-x-6 gap-y-16 lg:gap-x-10">
          {reviews.map((r, i) => (
            <motion.figure
              key={r.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: EASE, delay: (i % 2) * 0.1 }}
              className={`col-span-12 md:col-span-6 ${i % 2 === 1 ? "lg:mt-20" : ""}`}
            >
              <span
                className="block font-display text-[8rem] leading-none text-primary/40 lg:text-[10rem]"
                style={{ fontWeight: 300, marginBottom: "-1rem" }}
                aria-hidden
              >
                “
              </span>
              <blockquote
                className="font-display text-xl leading-snug ink lg:text-2xl"
                style={{ fontWeight: 400 }}
              >
                {r.text}
              </blockquote>
              <figcaption className="mt-8 flex items-center justify-between border-t border-hairline pt-5">
                <div>
                  <p className="kicker">— {r.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Google Reviews
                  </p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className="h-3 w-3 fill-primary text-primary"
                      strokeWidth={1}
                    />
                  ))}
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------- LOCATION + CTA */
function Visit() {
  return (
    <section id="visitanos" className="bg-background py-24 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <SectionHeader
          n="05"
          kicker="Visítanos"
          title={
            <>
              En el corazón <span className="display-italic">de Loja.</span>
            </>
          }
        />

        <div className="mt-16 grid grid-cols-12 gap-6 lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="col-span-12 lg:col-span-5"
          >
            <div className="flex flex-col gap-px bg-hairline">
              {[
                {
                  icon: MapPin,
                  k: "Dirección",
                  t: "Plaza TOA",
                  d: "Simón Bolívar entre Lourdes y Catacocha, Loja",
                },
                {
                  icon: Clock,
                  k: "Horario",
                  t: "Desde 9:30 a. m.",
                  d: "Confírmanos tu visita por WhatsApp",
                },
                {
                  icon: Phone,
                  k: "Contacto",
                  t: "+593 96 779 4351",
                  d: "Tel. 099 133 7101",
                },
              ].map((c) => (
                <div key={c.k} className="bg-background p-7">
                  <span className="kicker">{c.k}</span>
                  <div className="mt-3 flex items-start gap-4">
                    <c.icon className="mt-1 h-4 w-4 shrink-0 text-primary" strokeWidth={1.25} />
                    <div>
                      <p className="font-display text-xl ink" style={{ fontWeight: 400 }}>
                        {c.t}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">{c.d}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA block */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
              className="mt-10 border-t border-hairline pt-8"
            >
              <p
                className="font-display text-3xl leading-tight ink"
                style={{ fontWeight: 400 }}
              >
                Reserve su examen visual <span className="display-italic">sin costo</span>.
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Escríbanos por WhatsApp y coordinamos su cita en minutos.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-3 rounded-full bg-[var(--color-ink)] px-6 py-3.5 text-xs font-medium uppercase tracking-[0.16em] text-background transition-all hover:bg-primary"
                >
                  <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
                  WhatsApp
                  <ArrowUpRight
                    className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={1.5}
                  />
                </a>
                <a
                  href="tel:+593991337101"
                  className="inline-flex items-center gap-2 rounded-full border border-hairline px-6 py-3.5 text-xs font-medium uppercase tracking-[0.16em] ink transition-colors hover:border-[var(--color-ink)]"
                >
                  <Phone className="h-4 w-4" strokeWidth={1.5} />
                  099 133 7101
                </a>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="col-span-12 overflow-hidden border border-hairline lg:col-span-7"
          >
            <iframe
              title="Mapa Óptica Martínez Loja"
              src="https://www.google.com/maps?q=Simon+Bolivar+entre+Lourdes+y+Catacocha,+Loja,+Ecuador&output=embed"
              className="h-[420px] w-full grayscale-[0.4] contrast-[1.05] lg:h-[640px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------- FOOTER */
function Footer() {
  return (
    <footer className="bg-[var(--color-ink)] py-20 text-background">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid grid-cols-12 gap-6 border-b border-background/15 pb-16 lg:gap-10">
          <div className="col-span-12 lg:col-span-6">
            <img
              src="/logo.jpg"
              alt="Óptica Martínez"
              className="mb-7 h-16 w-16 rounded-full ring-1 ring-background/20"
            />
            <p
              className="font-display tracking-[-0.03em]"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                lineHeight: 0.95,
                fontWeight: 400,
              }}
            >
              Ver bien,
              <br />
              para <span className="display-italic">vivir mejor.</span>
            </p>
          </div>
          <div className="col-span-6 lg:col-span-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-background/50">
              Ubicación
            </p>
            <p className="mt-4 text-sm leading-relaxed text-background/85">
              Plaza TOA
              <br />
              Simón Bolívar
              <br />
              entre Lourdes y Catacocha
              <br />
              Loja, Ecuador
            </p>
          </div>
          <div className="col-span-6 lg:col-span-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-background/50">
              Contacto
            </p>
            <p className="mt-4 text-sm leading-relaxed text-background/85">
              WhatsApp
              <br />
              +593 96 779 4351
              <br />
              <br />
              Tel. 099 133 7101
            </p>
          </div>
          <div className="col-span-12 lg:col-span-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-background/50">
              Síguenos
            </p>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              <a
                href="https://www.instagram.com/martinezoptometry/"
                target="_blank"
                rel="noreferrer"
                className="ul-link inline-flex items-center gap-2 text-background/85 hover:text-background"
              >
                <Instagram className="h-3.5 w-3.5" strokeWidth={1.5} />
                Instagram
              </a>
              <a
                href="https://www.tiktok.com/@optica.martinez.o"
                target="_blank"
                rel="noreferrer"
                className="ul-link inline-flex items-center gap-2 text-background/85 hover:text-background"
              >
                <Sparkle className="h-3.5 w-3.5" strokeWidth={1.5} />
                TikTok
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-[10px] uppercase tracking-[0.2em] text-background/40">
          <span>© 2026 Óptica Martínez</span>
          <span>Loja · Ecuador</span>
          <span>Hecho con cuidado.</span>
        </div>
      </div>
    </footer>
  );
}

function FloatingWhatsApp() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      className="group fixed bottom-6 right-6 z-40 inline-flex items-center gap-3 rounded-full bg-[var(--color-ink)] px-5 py-3 text-xs font-medium uppercase tracking-[0.14em] text-background shadow-[0_20px_40px_-20px_hsl(240_52%_16%/0.5)] transition-all hover:bg-primary"
      aria-label="WhatsApp"
    >
      <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
      <span className="hidden sm:inline">Agendar por WhatsApp</span>
    </a>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Services />
        <Collection />
        <About />
        <Reviews />
        <Visit />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
