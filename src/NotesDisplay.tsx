'use client'

import { useAppSelector, useAppDispatch } from '@/lib/store/hooks'
import {
  deleteNote,
  setFilter,
  setSearchQuery,
  clearAllNotes,
  updateNote,
} from '@/lib/store/slices/notesSlice'
import { useMemo, useState, useEffect, useRef } from 'react'

// Custom hook to auto-resize textarea
const useAutosizeTextArea = (
  textAreaRef: HTMLTextAreaElement | null,
  value: string
) => {
  useEffect(() => {
    if (textAreaRef) {
      textAreaRef.style.height = '0px'
      const scrollHeight = textAreaRef.scrollHeight
      textAreaRef.style.height = scrollHeight + 'px'
    }
  }, [textAreaRef, value])
}

export default function NotesDisplay() {
  const dispatch = useAppDispatch()
  const { notes, filter, searchQuery } = useAppSelector((state) => state.notes)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [currentEditData, setCurrentEditData] = useState({
    title: '',
    content: '',
    category: '',
    priority: 'low',
  })

  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  useAutosizeTextArea(textAreaRef.current, currentEditData.content)

  const filteredNotes = useMemo(() => {
    return notes
      .filter((note) => {
        const matchesSearch =
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.category.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter = filter === 'all' || note.priority === filter
        return matchesSearch && matchesFilter
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [notes, filter, searchQuery])

  const handleDelete = (id: string) => {
    if (deleteConfirmId === id) {
      dispatch(deleteNote(id))
      setDeleteConfirmId(null)
    } else {
      setDeleteConfirmId(id)
      setTimeout(() => setDeleteConfirmId(null), 3000)
    }
  }

  const handleEditStart = (note: typeof notes[0]) => {
    setEditingNoteId(note.id)
    setCurrentEditData({
      title: note.title,
      content: note.content,
      category: note.category,
      priority: note.priority,
    })
  }

  const handleEditCancel = () => {
    setEditingNoteId(null)
  }

  const handleEditSave = () => {
    if (!editingNoteId) return
    dispatch(updateNote({ id: editingNoteId, ...currentEditData }))
    setEditingNoteId(null)
  }

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setCurrentEditData((prev) => ({ ...prev, [name]: value }))
  }

  const handleClearAll = () => {
    if (notes.length > 0 && confirm('Yakin ingin menghapus SEMUA catatan?')) {
      dispatch(clearAllNotes())
    }
  }

  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case 'high':
        return { icon: '🔴', bg: 'bg-red-50 border-red-200', text: 'text-red-700' }
      case 'medium':
        return { icon: '🟡', bg: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-700' }
      case 'low':
        return { icon: '🟢', bg: 'bg-green-50 border-green-200', text: 'text-green-700' }
      default:
        return { icon: '⚪', bg: 'bg-gray-50 border-gray-200', text: 'text-gray-700' }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) {
      if (diffInHours < 1) return 'Baru saja'
      return `${diffInHours} jam yang lalu`
    } else if (diffInHours < 168) {
      const days = Math.floor(diffInHours / 24)
      return `${days} hari yang lalu`
    }

    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const getFilterCount = (filterType: string) => {
    if (filterType === 'all') return notes.length
    return notes.filter((note) => note.priority === filterType).length
  }
  
  const formInputStyles = "w-full bg-white/90 border-2 border-gray-200 rounded-lg p-2.5 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-gray-800"
  const formLabelStyles = "flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"

  return (
    <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-2xl shadow-xl border border-blue-100/50 p-8 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 p-3 rounded-xl text-white text-2xl shadow-lg">📋</div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Daftar Catatan
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {filteredNotes.length} dari {notes.length} catatan ditampilkan
            </p>
          </div>
        </div>
        {notes.length > 0 && (
          <button
            onClick={handleClearAll}
            className="group bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-red-200 flex items-center gap-2 text-sm font-medium transform hover:scale-105"
          >
            <span className="group-hover:animate-pulse">🗑️</span> Hapus Semua
          </button>
        )}
      </div>

      <div className="mb-8 space-y-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-gray-400 text-xl">🔍</span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            placeholder="Cari berdasarkan judul, isi, atau kategori..."
            className="w-full pl-12 pr-10 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => dispatch(setSearchQuery(''))}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
            <span>🏷️</span> Filter Berdasarkan Prioritas
          </h3>
          <div className="flex flex-wrap gap-3">
            {[
              { key: 'all', label: '🌟 Semua', color: 'blue' },
              { key: 'high', label: '🔴 Tinggi', color: 'red' },
              { key: 'medium', label: '🟡 Sedang', color: 'yellow' },
              { key: 'low', label: '🟢 Rendah', color: 'green' },
            ].map((priority) => {
              const count = getFilterCount(priority.key)
              const isActive = filter === priority.key
              return (
                <button
                  key={priority.key}
                  onClick={() => dispatch(setFilter(priority.key))}
                  className={`relative px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-sm ${
                    isActive
                      ? `bg-${priority.color}-500 text-white shadow-lg shadow-${priority.color}-200`
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {priority.label}
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        isActive ? 'bg-white/20' : 'bg-gray-100'
                      }`}
                    >
                      {count}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-8xl mb-6 animate-pulse">📝</div>
          <div className="max-w-md mx-auto">
            <h3 className="text-2xl font-semibold text-gray-600 mb-3">
              {notes.length === 0 ? 'Belum ada catatan' : 'Tidak ada hasil yang cocok'}
            </h3>
            <p className="text-gray-400 text-lg leading-relaxed">
              {notes.length === 0
                ? 'Mulai dengan menambahkan catatan pertama Anda dan buat hari Anda lebih terorganisir!'
                : 'Coba ubah filter atau kata kunci pencarian untuk menemukan catatan yang Anda cari'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredNotes.map((note) => {
            const priorityInfo = getPriorityInfo(note.priority)
            const isConfirmingDelete = deleteConfirmId === note.id
            const isEditing = editingNoteId === note.id

            return (
              <div
                key={note.id}
                className={`group relative border-2 ${
                  isEditing ? 'border-blue-400 bg-blue-50/80' : priorityInfo.bg + ' ' + priorityInfo.text
                } rounded-2xl p-6 transition-all duration-300 ${
                  editingNoteId && !isEditing ? 'opacity-50 blur-sm pointer-events-none' : ''
                } ${isEditing ? 'shadow-2xl' : 'hover:shadow-xl transform hover:-translate-y-1'}`}
              >
                {isEditing ? (
                   <div className="transition-opacity duration-300">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                      <div className="col-span-2">
                        <label className={formLabelStyles}>✏️ Judul</label>
                        <input type="text" name="title" value={currentEditData.title} onChange={handleEditChange} className={`${formInputStyles} text-lg font-bold`} />
                      </div>
                      <div>
                        <label className={formLabelStyles}>📁 Kategori</label>
                        <input type="text" name="category" placeholder="Kategori" value={currentEditData.category} onChange={handleEditChange} className={formInputStyles} />
                      </div>
                      <div>
                        <label className={formLabelStyles}>🚦 Prioritas</label>
                        <select name="priority" value={currentEditData.priority} onChange={handleEditChange} className={formInputStyles}>
                          <option value="low">Rendah</option>
                          <option value="medium">Sedang</option>
                          <option value="high">Tinggi</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className={formLabelStyles}>📄 Konten</label>
                        <textarea ref={textAreaRef} name="content" value={currentEditData.content} onChange={handleEditChange} className={`${formInputStyles} min-h-[80px] resize-none overflow-hidden`} rows={3} />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6 border-t border-gray-200 pt-4">
                      <button onClick={handleEditCancel} className="px-5 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold transition-colors">Batal</button>
                      <button onClick={handleEditSave} className="px-5 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-semibold transition-colors shadow-lg shadow-blue-500/30 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        Simpan
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl">{priorityInfo.icon}</span>
                          <h3 className="text-xl font-bold text-gray-800 truncate">{note.title}</h3>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <span className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-200 flex items-center gap-1">
                            📁 <span className="font-medium">{note.category}</span>
                          </span>
                          <span className="text-gray-500 flex items-center gap-1">
                            📅 {formatDate(note.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEditStart(note)} className="p-3 rounded-xl text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200 transform hover:scale-110" title="Ubah catatan">
                          <span className="text-xl">✏️</span>
                        </button>
                        <button
                          onClick={() => handleDelete(note.id)}
                          className={`p-3 rounded-xl transition-all duration-200 transform hover:scale-110 ${isConfirmingDelete ? 'bg-red-500 text-white shadow-lg shadow-red-200 animate-pulse' : 'text-red-400 hover:text-red-600 hover:bg-red-50'}`}
                          title={isConfirmingDelete ? 'Klik lagi untuk hapus' : 'Hapus catatan'}
                        >
                          <span className="text-xl">{isConfirmingDelete ? '⚠️' : '🗑️'}</span>
                        </button>
                      </div>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-gray-100">
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {note.content}
                      </p>
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}