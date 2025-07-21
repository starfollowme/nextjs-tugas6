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
      
      // Reset form
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

  return (
    // Latar belakang komponen diubah agar adaptif
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors duration-300">
      {/* Warna judul diubah agar adaptif */}
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">📝 Tambah Catatan Baru</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          {/* Warna label diubah agar adaptif */}
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Judul Catatan
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Masukkan judul catatan..."
            // Input field diubah agar adaptif
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Kategori
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Contoh: Pekerjaan, Personal, Belajar..."
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Prioritas
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">🟢 Rendah</option>
            <option value="medium">🟡 Sedang</option>
            <option value="high">🔴 Tinggi</option>
          </select>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Isi Catatan
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Tulis catatan Anda di sini..."
            rows={4}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
            required
          />
        </div>

        {/* Warna teks tombol dikembalikan ke putih agar kontras */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
        >
          ➕ Tambah Catatan
        </button>
      </form>
    </div>
  )
}