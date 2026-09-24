import Link from 'next/link'

export default function AdminDashboard() {
  const cards = [
    {
      title: 'Manage Team',
      desc: 'Add, edit, or remove team members.',
      href: '/admin/team',
      color: 'border-blue-500/50 hover:border-blue-500',
    },
    {
      title: 'Manage Projects',
      desc: 'Update the engineering portfolio.',
      href: '/admin/projects',
      color: 'border-green-500/50 hover:border-green-500',
    },
    {
      title: 'Manage Events',
      desc: 'Schedule workshops and competitions.',
      href: '/admin/events',
      color: 'border-purple-500/50 hover:border-purple-500',
    },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold font-mono text-white mb-2">Dashboard</h1>
      <p className="text-[#A6AAAE] font-mono mb-10">Select a module to manage website content.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className={`block p-6 bg-[#1a1a1a] rounded-xl border transition-all ${card.color} group`}
          >
            <h2 className="text-xl font-bold font-mono text-white mb-2 group-hover:text-[#d83a32] transition-colors">
              {card.title}
            </h2>
            <p className="text-[#A6AAAE] text-sm">
              {card.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
