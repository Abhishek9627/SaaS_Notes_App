'use client'

import { useState } from 'react'

interface Note {
  id: string
  title: string
  content: string
}

interface NoteFormProps {
  token: string | null
  onSuccess: () => void
  editingNote?: Note | null
}

export default function NoteForm({ token, onSuccess, editingNote }: NoteFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Get form data directly from the form elements
    const formData = new FormData(e.target as HTMLFormElement)
    const title = formData.get('title') as string
    const content = formData.get('content') as string

    console.log('Form submitted:', { title, content })

    try {
      const url = editingNote ? `/api/notes/${editingNote.id}` : '/api/notes'
      const method = editingNote ? 'PUT' : 'POST'


      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      })


      if (response.ok) {
        onSuccess()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to save note')
      }
    } catch (error) {
      setError('Failed to save note')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            {editingNote ? 'Edit Note' : 'Create New Note'}
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-blue-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                defaultValue={editingNote?.title || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md 
             focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-700"
                placeholder="Enter note title..."
                required
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                defaultValue={editingNote?.content || ''}
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-md 
             focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-700"
                placeholder="Enter note content..."
                required
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Saving...' : (editingNote ? 'Update Note' : 'Create Note')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
