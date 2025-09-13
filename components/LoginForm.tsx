'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/context'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const success = await login(email, password)
    if (!success) {
      setError('Invalid credentials')
    }
    setLoading(false)
  }

  return (
    
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-sky-600 to-blue-300 py-12 px-4 sm:px-6 lg:px-8">
       {/* Animated Gradient Overlay */}
       <div className="absolute inset-0">
        <div className="absolute w-[98%] h-[98%] bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 animate-gradient-slow opacity-30 -rotate-12"></div>
      </div>
      
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-xl text-gray-600">
            Multi-Tenant Notes SaaS
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 rounded-lg 
             bg-white/10 backdrop-blur-md 
             border border-white/30 
             placeholder-gray-200 text-white
             focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400
             transition-all duration-300
             hover:bg-white/20 hover:scale-105"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-4 py-3 rounded-lg 
             bg-white/10 backdrop-blur-md 
             border border-white/30 
             placeholder-gray-200 text-white
             focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400
             transition-all duration-300
             hover:bg-white/20 hover:scale-105"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-2 rounded-md text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="relative w-full py-3 px-4 rounded-xl text-white 
             font-bold tracking-wide 
             bg-gradient-to-r from-sky-500 to-blue-600 
             hover:from-blue-600 hover:to-sky-500 
             shadow-lg shadow-blue-500/50
             transform transition duration-300 ease-in-out 
             hover:scale-105 active:scale-95
             overflow-hidden group"
            >
              <span className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-white/40 transition-all duration-500"></span>
              {/* Button text */}
  <span className="relative z-10">
    {loading ? 'Signing in...' : 'Sign in'}
  </span>
              
            </button>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-bold text-gray-300 mb-2">Test Accounts:</h3>
            <div className="text-xl text-gray-300 space-y-1 font-bold">
              <div><strong>Acme:</strong> admin@acme.test / user@acme.test</div>
              <div><strong>Globex:</strong> admin@globex.test / user@globex.test</div>
              <div><em>Password for all accounts: password</em></div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
