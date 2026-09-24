'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  
  // Do not show the layout for the login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Team', path: '/admin/team' },
    { name: 'Projects', path: '/admin/projects' },
    { name: 'Events', path: '/admin/events' },
  ]

  return (
    <div className="relative z-10 min-h-screen bg-[#101010] text-white font-sans flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#1a1a1a] border-r border-[#292D32] p-6 flex flex-col">
        <div className="mb-8">
          <h2 className="text-xl font-bold font-mono text-[#d83a32]">e-Yantra CMS</h2>
          <p className="text-xs text-[#A6AAAE] mt-1">Admin Portal</p>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`block px-4 py-2 rounded font-mono text-sm transition-colors ${
                pathname === item.path
                  ? 'bg-[#292D32] text-white'
                  : 'text-[#A6AAAE] hover:bg-[#292D32]/50 hover:text-white'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        
        <div className="mt-8 pt-4 border-t border-[#292D32]">
          <Link href="/" className="block px-4 py-2 mb-2 text-[#A6AAAE] hover:text-white font-mono text-sm transition-colors">
            &larr; Back to Site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-500/10 rounded font-mono text-sm transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
