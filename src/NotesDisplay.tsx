'use client'

import { useAppSelector, useAppDispatch } from '@/lib/store/hooks'
import { deleteNote, setFilter, setSearchQuery, clearAllNotes } from '@/lib/store/slices/notesSlice'
import { useMemo } from 'react'

export default function NotesDisplay() {
  const dispatch = useAppDispatch()
  const { notes, filter, searchQuery } = useAppSelector((state) => state.notes)

  // Filter dan search logic (tidak ada perubahan)
  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            note.category.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesFilter = filter === 'all' || note.priority === filter
      
      return matchesSearch && matchesFilter
    })
  }, [notes, filter, searchQuery])

  // Handlers (tidak ada perubahan)
  const handleDelete = (id: string) => {
    if (confirm('Yakin ingin menghapus catatan ini?')) {
      dispatch(deleteNote(id))
    }
  }

  const handleClearAll = () => {
    if (notes.length > 0 && confirm('Yakin ingin menghapus SEMUA catatan?')) {
      dispatch(clearAllNotes())
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴'
      case 'medium': return '🟡'
      case 'low': return '🟢'
      default: return '⚪'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  // Render JSX dengan kelas Bootstrap 5
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="h4 mb-0 fw-bold">
            📋 Daftar Catatan ({filteredNotes.length})
          </h2>
          {notes.length > 0 && (
            <button onClick={handleClearAll} className="btn btn-sm btn-danger d-flex align-items-center gap-2">
              <i className="bi bi-trash"></i> Hapus Semua
            </button>
          )}
        </div>

        {/* Kontrol Filter dan Pencarian */}
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label htmlFor="search" className="form-label small fw-medium">🔍 Cari Catatan</label>
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              placeholder="Cari berdasarkan judul, isi, atau kategori..."
              className="form-control"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label small fw-medium">🏷️ Filter Berdasarkan Prioritas</label>
            <div className="btn-group w-100" role="group">
              {['all', 'high', 'medium', 'low'].map((priority) => (
                <button
                  key={priority}
                  onClick={() => dispatch(setFilter(priority))}
                  className={`btn ${filter === priority ? 'btn-primary' : 'btn-outline-secondary'}`}
                >
                  {priority === 'all' ? '🌟 Semua' : 
                   priority === 'high' ? '🔴 Tinggi' :
                   priority === 'medium' ? '🟡 Sedang' : '🟢 Rendah'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Daftar Catatan */}
        {filteredNotes.length === 0 ? (
          <div className="text-center py-5 bg-light rounded">
            <div style={{ fontSize: '4rem' }}>📝</div>
            <p className="h5 text-muted mt-3">
              {notes.length === 0 ? 'Belum ada catatan' : 'Tidak ada catatan yang cocok'}
            </p>
            <p className="text-muted">
              {notes.length === 0 ? 'Mulai dengan menambahkan catatan pertama Anda!' : 'Coba ubah filter atau kata kunci pencarian'}
            </p>
          </div>
        ) : (
          <div className="list-group">
            {filteredNotes.map((note) => (
              <div key={note.id} className="list-group-item list-group-item-action d-flex flex-column">
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-1 fw-semibold d-flex align-items-center gap-2">
                    {getPriorityIcon(note.priority)}
                    {note.title}
                  </h5>
                  <button onClick={() => handleDelete(note.id)} className="btn btn-sm btn-outline-danger border-0" title="Hapus catatan">
                    🗑️
                  </button>
                </div>
                <div className="d-flex align-items-center gap-3 mb-2">
                  <span className="badge bg-primary-subtle text-primary-emphasis rounded-pill">
                    📁 {note.category}
                  </span>
                  <small className="text-muted">📅 {formatDate(note.createdAt)}</small>
                </div>
                <div className="bg-white p-3 mt-2 rounded border shadow-sm">
                   <p className="mb-1" style={{ whiteSpace: 'pre-wrap' }}>{note.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}