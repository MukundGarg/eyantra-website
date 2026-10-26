import Iconify from "@/components/Iconify";
import Link from "next/link";
import styles from "./HomeCoreSection.module.css";

const principles = [
  {
    number: "01",
    icon: "lucide:lightbulb",
    title: "Learn by making",
    description:
      "Turn curiosity into practical skills by working through real engineering challenges.",
    label: "Curiosity → capability",
  },
  {
    number: "02",
    icon: "lucide:cpu",
    title: "Build with purpose",
    description:
      "Bring code, circuits, and mechanics together to make ideas work in the real world.",
    label: "Ideas → working systems",
  },
  {
    number: "03",
    icon: "lucide:combine",
    title: "Think across disciplines",
    description:
      "The best solutions emerge when software, electronics, and design meet.",
    label: "Different skills, one build",
  },
  {
    number: "04",
    icon: "lucide:users-round",
    title: "Make it together",
    description:
      "Share what you know, learn from each other, and make room for every new idea.",
    label: "Better, together",
  },
] as const;

function PrincipleCards({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div className={styles.cardSet} aria-hidden={duplicate || undefined} inert={duplicate}>
      {principles.map((principle) => (
        <article className={styles.card} key={principle.number}>
          <div className={styles.cardTop}>
            <span className={styles.number}>{principle.number}</span>
            <span className={styles.iconFrame}>
              <Iconify icon={principle.icon} className={styles.icon} />
            </span>
          </div>
          <h3>{principle.title}</h3>
          <p>{principle.description}</p>
          <span className={styles.cardLabel}>
            <span />
            {principle.label}
          </span>
        </article>
      ))}
    </div>
  );
}

export default function HomeCoreSection() {
  return (
    <section className={styles.section} aria-labelledby="home-core-title">
      <div className={styles.header}>
        <div className={styles.headingGroup}>
          <p className={styles.eyebrow}>More than machines</p>
          <h2 id="home-core-title">
            At our <span>core.</span>
          </h2>
        </div>
        <div className={styles.intro}>
          <p>
            e-Yantra is where engineering becomes something you can try, test,
            and build together. Start with a question. Leave knowing how to
            make more things possible.
          </p>
          <Link href="/projects" className={styles.exploreLink}>
            See what we build
            <Iconify icon="lucide:arrow-up-right" />
          </Link>
        </div>
      </div>

      <div
        className={styles.marquee}
        role="region"
        aria-label="What makes e-Yantra"
        tabIndex={0}
      >
        <div className={styles.track}>
          <PrincipleCards />
          <PrincipleCards duplicate />
        </div>
      </div>
      <p className={styles.marqueeHint}>A few things we believe in</p>
      <span className={styles.sectionIndex} aria-hidden="true">
        02 / THE FOUNDATION
      </span>
    </section>
  );
}
