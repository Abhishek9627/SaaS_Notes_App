'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/context'
import NoteForm from './NoteForm'

interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  author: {
    email: string
  }
}

export default function NotesList() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const { user, token } = useAuth()

  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/notes', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setNotes(data)
      } else {
        setError('Failed to fetch notes')
      }
    } catch (error) {
      setError('Failed to fetch notes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchNotes()
    }
  }, [token])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) {
      return
    }

    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setNotes(notes.filter(note => note.id !== id))
      } else {
        setError('Failed to delete note')
      }
    } catch (error) {
      setError('Failed to delete note')
    }
  }

  const handleEdit = (note: Note) => {
    setEditingNote(note)
    setShowForm(true)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingNote(null)
    fetchNotes()
  }

  const handleUpgrade = async () => {
    try {
      const response = await fetch(`/api/tenants/${user?.tenantSlug}/upgrade`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        alert('Tenant upgraded to Pro successfully!')
        // Refresh the page to update the UI
        window.location.reload()
      } else {
        const data = await response.json()
        alert(`Failed to upgrade: ${data.error}`)
      }
    } catch (error) {
      alert('Failed to upgrade tenant')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading notes...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 animate-gradient-x">
  <div className="max-w-4xl mx-auto p-6 relative z-10"></div>"
      <div className="flex justify-between items-center mb-6 bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white">
          Notes - {user?.tenantSlug}
        </h1>
        <div className="flex gap-4 items-center mt-4 md:mt-0">
          <span className="text-sm text-gray-300">
            Welcome, {user?.email} ({user?.role})
          </span>
          <button
            onClick={() => { setShowForm(true); setEditingNote(null) }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Create Note
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('token')
              localStorage.removeItem('user')
              window.location.reload()
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 shadow-sm">
          {error}
        </div>
      )}

      {/* Upgrade banner temporarily disabled to avoid import issues */}

      {showForm && (
        <NoteForm
          token={token}
          onSuccess={handleFormSuccess}
          editingNote={editingNote}
        />
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {notes.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-lg font-medium">
            No notes yet. Create your first note!
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {note.title}
                  </h2>
                  <p className="text-gray-700 mb-4 whitespace-pre-wrap">
                    {note.content}
                  </p>
                  <div className="text-sm text-gray-500">
                    <p>Created by: {note.author.email}</p>
                    <p>Created: {new Date(note.createdAt).toLocaleString()}</p>
                    {note.updatedAt !== note.createdAt && (
                      <p>Updated: {new Date(note.updatedAt).toLocaleString()}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(note)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
