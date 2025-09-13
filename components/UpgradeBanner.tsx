'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/context'

interface UpgradeBannerProps {
  onUpgrade: () => void
}

export default function UpgradeBanner({ onUpgrade }: UpgradeBannerProps) {
  const [noteCount, setNoteCount] = useState(0)
  const [tenantPlan, setTenantPlan] = useState<'FREE' | 'PRO'>('FREE')
  const [loading, setLoading] = useState(true)
  const { user, token } = useAuth()

  useEffect(() => {
    if (token) {
      fetchTenantInfo()
    }
  }, [token])

  const fetchTenantInfo = async () => {
    try {
      const response = await fetch('/api/notes', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const notes = await response.json()
        setNoteCount(notes.length)
        
        // Check if we're at the limit to determine if we're on FREE plan
        if (notes.length >= 3) {
          // Try to create a note to check if we're limited
          const testResponse = await fetch('/api/notes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ title: 'Test', content: 'Test' }),
          })

          if (testResponse.status === 403) {
            setTenantPlan('FREE')
          } else {
            setTenantPlan('PRO')
          }
        } else {
          setTenantPlan('FREE')
        }
      }
    } catch (error) {
      console.error('Failed to fetch tenant info:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return null
  }

  if (tenantPlan === 'PRO') {
    return (
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
        <div className="flex items-center justify-between">
          <span>🎉 You're on the Pro plan! Unlimited notes available.</span>
        </div>
      </div>
    )
  }

  if (noteCount >= 3) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
        <div className="flex items-center justify-between">
          <span>
            ⚠️ You've reached the limit of 3 notes on the Free plan. 
            {user?.role === 'ADMIN' ? ' Upgrade to Pro for unlimited notes!' : ' Contact your admin to upgrade to Pro.'}
          </span>
          {user?.role === 'ADMIN' && (
            <button
              onClick={onUpgrade}
              className="ml-4 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded text-sm font-medium"
            >
              Upgrade to Pro
            </button>
          )}
        </div>
      </div>
    )
  }

  if (noteCount >= 2) {
    return (
      <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
        <div className="flex items-center justify-between">
          <span>
            📝 You have {noteCount}/3 notes. 
            {user?.role === 'ADMIN' ? ' Upgrade to Pro for unlimited notes!' : ' Contact your admin to upgrade to Pro.'}
          </span>
          {user?.role === 'ADMIN' && (
            <button
              onClick={onUpgrade}
              className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
            >
              Upgrade to Pro
            </button>
          )}
        </div>
      </div>
    )
  }

  return null
}
