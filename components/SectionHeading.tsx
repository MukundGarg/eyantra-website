
export default function SectionHeading({ title, highlight, subtitle }: { title: string, highlight?: string, subtitle: string }) {
  return (
    <div className="reveal text-center mb-20">
      <h2 className="text-4xl md:text-5xl font-semibold text-[var(--text-primary)] font-mono mb-4">
        {title} {highlight && <span className="text-[var(--accent-red)]">{highlight}</span>}
      </h2>
      <p className="text-[var(--text-secondary)]">{subtitle}</p>
    </div>
  );
}
