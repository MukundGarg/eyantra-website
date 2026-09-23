import Iconify from "@/components/Iconify";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0B0D10] border-t border-[#292D32] pt-20 pb-10 relative overflow-hidden">
      <div className="reveal max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-24 relative z-10">
        <div className="stagger-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <Iconify icon="lucide:cpu" className="w-5 h-5 text-[#d83a32]" />
            <span className="text-2xl font-bold font-mono tracking-tight text-white">e-Yantra MSIT</span>
          </div>
          <p className="text-[#A6AAAE] max-w-xs leading-relaxed">
            A robotics and embedded systems laboratory fostering innovation, experimentation, and technical excellence among MSIT students.
          </p>
        </div>

        <div className="stagger-2">
          <h4 className="text-xs font-bold font-mono text-[#d83a32] uppercase tracking-widest mb-6">Links</h4>
          <ul className="space-y-4 text-[#A6AAAE] text-sm">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link href="/team" className="hover:text-white transition-colors">Team</Link></li>
            <li><Link href="/projects" className="hover:text-white transition-colors">Projects</Link></li>
            <li><Link href="/events" className="hover:text-white transition-colors">Events</Link></li>
          </ul>
        </div>

        <div className="stagger-3">
          <h4 className="text-xs font-bold font-mono text-[#d83a32] uppercase tracking-widest mb-6">Contact</h4>
          <ul className="space-y-4 text-[#A6AAAE] text-sm">
            <li><a href="mailto:contact@eyantramsit.com" className="hover:text-white transition-colors">contact@eyantramsit.com</a></li>
            <li>MSIT, C-4 Janakpuri</li>
            <li>New Delhi, India</li>
          </ul>
        </div>
      </div>

      {/* Huge Footer Text */}
      <div className="reveal flex justify-center items-center py-10 opacity-5 pointer-events-none">
        <h1 className="text-[15vw] leading-none font-bold font-mono tracking-tighter text-stroke select-none">
          E-YANTRA
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-[#292D32] pt-8 flex flex-col md:flex-row items-center justify-between text-[#A6AAAE] text-[10px] uppercase font-mono tracking-widest">
        <p>&copy; 2026 e-Yantra MSIT. Built by engineers.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link href="https://instagram.com" className="hover:text-white transition-colors">Instagram</Link>
          <Link href="https://linkedin.com" className="hover:text-white transition-colors">LinkedIn</Link>
          <Link href="https://github.com" className="hover:text-white transition-colors">GitHub</Link>
          <Link href="https://youtube.com" className="hover:text-white transition-colors">YouTube</Link>
        </div>
      </div>
    </footer>
  );
}
