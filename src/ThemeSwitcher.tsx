// Nama File: ThemeSwitcher.tsx
'use client'

import { useState, useEffect } from 'react'

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState('light')

  // Cek tema saat komponen pertama kali dimuat
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme) // Simpan pilihan pengguna

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg font-semibold text-gray-800 dark:text-gray-200"
    >
      Ubah ke Mode {theme === 'light' ? 'Gelap 🌙' : 'Terang ☀️'}
    </button>
  )
}