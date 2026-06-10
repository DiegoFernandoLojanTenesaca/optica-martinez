import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const LINES: { text: string; size: string }[] = [
  { text: "E", size: "clamp(3rem, 9vw, 6rem)" },
  { text: "F P", size: "clamp(2.4rem, 7vw, 4.6rem)" },
  { text: "T O Z", size: "clamp(1.9rem, 5.5vw, 3.5rem)" },
  { text: "L P E D", size: "clamp(1.5rem, 4.2vw, 2.6rem)" },
  { text: "P E C F D", size: "clamp(1.15rem, 3.2vw, 2rem)" },
  { text: "E D F C Z P", size: "clamp(0.95rem, 2.6vw, 1.6rem)" },
];

export default function EyeChart() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "center 0.55"],
  });
  const filter = useTransform(
    scrollYProgress,
    [0, 1],
    ["blur(14px)", "blur(0px)"],
  );
  const opacity = useTransform(scrollYProgress, [0, 1], [0.35, 1]);

  return (
    <section
      ref={ref}
      className="border-y border-hairline bg-background py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[820px] px-6 text-center">
        <span className="kicker">Así de claro quieres ver</span>
        <motion.div
          style={{ filter, opacity }}
          className="mt-12 flex flex-col items-center gap-4 font-display ink"
        >
          {LINES.map((l, i) => (
            <span
              key={i}
              style={{
                fontSize: l.size,
                lineHeight: 1,
                letterSpacing: "0.22em",
                fontWeight: 500,
              }}
            >
              {l.text}
            </span>
          ))}
        </motion.div>
        <p className="mx-auto mt-14 max-w-md text-base leading-relaxed text-muted-foreground">
          Si lo de arriba se te hizo borroso al inicio, quizás es hora de una
          revisada. El examen es gratis, agéndalo y nota la diferencia.
        </p>
      </div>
    </section>
  );
}
