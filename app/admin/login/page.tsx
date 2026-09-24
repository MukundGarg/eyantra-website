'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useEffect } from 'react'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    if (searchParams.get('error') === 'unauthorized') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError('This account is not authorized as an administrator.')
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    // Verify admin allowlist
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: adminRecord } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', user.id)
        .single()

      if (!adminRecord) {
        await supabase.auth.signOut()
        setError('This account is not authorized as an administrator.')
        setLoading(false)
        return
      }
    }

    router.push('/admin')
    router.refresh()
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

export default function AdminLogin() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#101010] text-white">Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
