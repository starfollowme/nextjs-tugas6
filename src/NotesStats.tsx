'use client'

import { useAppSelector } from '@/lib/store/hooks'
import { useMemo, useState, useEffect } from 'react'

export default function NotesStats() {
  const { notes, loading } = useAppSelector((state) => state.notes)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setIsVisible(true), 100)
      return () => clearTimeout(timer)
    }
  }, [loading])

  const statItems = useMemo(() => {
    const byPriority = notes.reduce((acc, note) => {
      acc[note.priority] = (acc[note.priority] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return [
      { value: notes.length, label: 'Total', icon: 'Σ' },
      { value: byPriority.HIGH || 0, label: 'Tinggi', icon: '🔴' },
      { value: byPriority.MEDIUM || 0, label: 'Sedang', icon: '🟡' },
      { value: byPriority.LOW || 0, label: 'Rendah', icon: '🟢' },
      {
        value: [...new Set(notes.map((note) => note.category))].length,
        label: 'Kategori',
        icon: '🏷️',
      },
    ]
  }, [notes])

  if (loading && notes.length === 0) {
    return (
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl shadow-lg p-6 mb-6">
        <div className="animate-pulse">
          <div className="h-6 bg-white/25 rounded-md w-44 mb-5"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i}>
                <div className="h-8 bg-white/25 rounded-md w-12 mx-auto mb-2"></div>
                <div className="h-4 bg-white/25 rounded-md w-16 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`bg-gradient-to-br from-blue-600 to-purple-700 text-white rounded-xl shadow-lg p-6 mb-6 transform transition-all duration-500 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <h2 className="text-xl font-bold mb-4">📊 Statistik Catatan</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-4">
        {statItems.map((stat) => (
          <div
            key={stat.label}
            className="text-center rounded-lg p-3 transition-all duration-300 ease-in-out hover:bg-white/10 hover:scale-105 cursor-pointer"
          >
            <div className="text-3xl font-bold flex items-center justify-center gap-x-2">
              <span>{stat.icon}</span>
              <span>{stat.value}</span>
            </div>
            <div className="text-sm opacity-90 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}