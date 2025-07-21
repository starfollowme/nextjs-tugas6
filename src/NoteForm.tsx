'use client'

import { useState } from 'react'
import { useAppDispatch } from '@/lib/store/hooks'
import { addNote } from '@/lib/store/slices/notesSlice'

export default function NoteForm() {
  const dispatch = useAppDispatch()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.title.trim() && formData.content.trim()) {
      dispatch(addNote({
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category.trim() || 'General',
        priority: formData.priority
      }))
      
      setFormData({
        title: '',
        content: '',
        category: '',
        priority: 'medium'
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400'
      case 'medium': return 'text-yellow-600 dark:text-yellow-400'
      case 'low': return 'text-green-600 dark:text-green-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-8 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Tambah Catatan Baru
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <span className="text-blue-500">📋</span>
            Judul Catatan
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Masukkan judul catatan yang menarik..."
            className="w-full px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="category" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <span className="text-purple-500">🏷️</span>
              Kategori
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Pekerjaan, Personal, Belajar..."
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="priority" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <span className="text-orange-500">⚡</span>
              Prioritas
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 ${getPriorityColor(formData.priority)}`}
            >
              <option value="low" className="text-green-600">🟢 Rendah</option>
              <option value="medium" className="text-yellow-600">🟡 Sedang</option>
              <option value="high" className="text-red-600">🔴 Tinggi</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <span className="text-green-500">📝</span>
            Isi Catatan
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Tulis catatan Anda dengan detail di sini..."
            rows={5}
            className="w-full px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 resize-vertical min-h-[120px]"
            required
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="group w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <span className="transition-transform duration-200 group-hover:scale-110">➕</span>
            Tambah Catatan
            <svg className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  )
}