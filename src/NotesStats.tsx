'use client'

import { useAppSelector } from '@/lib/store/hooks'
import { useMemo } from 'react'

export default function NotesStats() {
  const { notes, loading } = useAppSelector((state) => state.notes)

  const stats = useMemo(() => {
    const total = notes.length
    const byPriority = notes.reduce((acc, note) => {
      acc[note.priority] = (acc[note.priority] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const categories = [...new Set(notes.map(note => note.category))].length

    return {
      total,
      high: byPriority.HIGH || 0,
      medium: byPriority.MEDIUM || 0,
      low: byPriority.LOW || 0,
      categories
    }
  }, [notes])

  if (loading && notes.length === 0) {
    return (
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-md p-6 mb-6">
        <div className="animate-pulse">
          <div className="h-4 bg-white bg-opacity-20 rounded w-32 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-6 bg-white bg-opacity-20 rounded w-8 mx-auto mb-2"></div>
                <div className="h-3 bg-white bg-opacity-20 rounded w-12 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">📊 Statistik Catatan</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm opacity-90">Total</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold">🔴 {stats.high}</div>
          <div className="text-sm opacity-90">Tinggi</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold">🟡 {stats.medium}</div>
          <div className="text-sm opacity-90">Sedang</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold">🟢 {stats.low}</div>
          <div className="text-sm opacity-90">Rendah</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold">{stats.categories}</div>
          <div className="text-sm opacity-90">Kategori</div>
        </div>
      </div>
    </div>
  )
}