import Iconify from "@/components/Iconify";
export default function SectionHeading({ title, highlight, subtitle }: { title: string, highlight?: string, subtitle: string }) {
  return (
    <div className="reveal text-center mb-20">
      <h2 className="text-4xl md:text-5xl font-semibold text-white font-mono mb-4">
        {title} {highlight && <span className="text-[#d83a32]">{highlight}</span>}
      </h2>
      <p className="text-[#A6AAAE]">{subtitle}</p>
    </div>
  );
}
