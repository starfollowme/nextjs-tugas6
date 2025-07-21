
import NoteForm from '@/NoteForm'
import NotesDisplay from '@/NotesDisplay'
import NotesStats from '@/NotesStats'
import ThemeSwitcher from '@/ThemeSwitcher' 

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-6xl">
        <header className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <ThemeSwitcher /> 
          </div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            📝 Personal Notes Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Aplikasi catatan dengan Redux State Management
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
       
          <div>
            <NotesStats />
            <NoteForm />
          </div>

         
          <div>
            <NotesDisplay />
          </div>
        </div>

        <footer className="text-center mt-8 text-gray-500 dark:text-gray-400 text-sm">
          <p>Demo Redux dengan Next.js - State Management Global</p>
        </footer>
      </div>
    </main>
  )
}