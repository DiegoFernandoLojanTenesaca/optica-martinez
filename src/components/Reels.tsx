import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const REELS = [
  {
    src: "/videos/reel1.mp4",
    poster: "/videos/reel1.jpg",
    title: "Línea Harley-Davidson",
  },
  {
    src: "/videos/reel2.mp4",
    poster: "/videos/reel2.jpg",
    title: "Armazones de acetato",
  },
  {
    src: "/videos/reel3.mp4",
    poster: "/videos/reel3.jpg",
    title: "Monturas metálicas",
  },
  {
    src: "/videos/reel4.mp4",
    poster: "/videos/reel4.jpg",
    title: "Lentes Transitions",
  },
];

function Reel({ reel, i }: { reel: (typeof REELS)[number]; i: number }) {
  const ref = useRef<HTMLVideoElement>(null);

  // Reproduce solo cuando está a la vista (ahorra datos y CPU)
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <motion.figure
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: EASE, delay: (i % 4) * 0.08 }}
      className="group relative overflow-hidden border border-hairline bg-sand"
    >
      <video
        ref={ref}
        src={reel.src}
        poster={reel.poster}
        muted
        loop
        playsInline
        preload="none"
        className="aspect-[9/16] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
      />
      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <span
          className="font-display text-sm text-white"
          style={{ fontWeight: 400 }}
        >
          {reel.title}
        </span>
      </figcaption>
    </motion.figure>
  );
}

export default function Reels() {
  return (
    <section id="reels" className="bg-background py-24 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="flex flex-col gap-6 border-b border-hairline pb-8 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <span className="kicker">En acción</span>
            <h2
              className="mt-3 font-display tracking-[-0.03em] ink"
              style={{
                fontSize: "clamp(2.25rem, 5vw, 4.25rem)",
                lineHeight: 1,
                fontWeight: 400,
              }}
            >
              Míranos <span className="display-italic">en video.</span>
            </h2>
          </div>
          <a
            href="https://www.tiktok.com/@optica.martinez.o"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 self-start rounded-full border border-hairline px-6 py-3 text-xs font-medium uppercase tracking-[0.16em] ink transition-colors hover:border-[var(--color-ink)] sm:self-auto"
          >
            Síguenos en TikTok
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={1.5}
            />
          </a>
        </motion.div>

        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {REELS.map((r, i) => (
            <Reel key={r.src} reel={r} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
