'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center bg-[#101010] p-6">
      <div className="w-full max-w-md bg-[#1a1a1a] p-8 rounded-xl border border-[#292D32]">
        <h1 className="text-2xl font-bold font-mono text-white mb-6 text-center">
          Admin Login
        </h1>
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm font-mono">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[#A6AAAE] text-sm font-mono mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#101010] border border-[#292D32] rounded p-2 text-white font-mono focus:outline-none focus:border-white/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[#A6AAAE] text-sm font-mono mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#101010] border border-[#292D32] rounded p-2 text-white font-mono focus:outline-none focus:border-white/50 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#d83a32] hover:bg-[#b02c25] text-white font-bold font-mono py-2 px-4 rounded transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
