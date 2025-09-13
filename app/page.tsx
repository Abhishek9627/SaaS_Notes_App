'use client'

import { AuthProvider, useAuth } from '@/lib/context'
import LoginForm from '@/components/LoginForm'
import NotesList from '@/components/NotesList'

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return user ? <NotesList /> : <LoginForm />
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
