import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Note {
  id: string
  title: string
  content: string
  category: string
  createdAt: string
  priority: 'low' | 'medium' | 'high'
}

interface NotesState {
  notes: Note[]
  filter: string
  searchQuery: string
}

const initialState: NotesState = {
  notes: [],
  filter: 'all',
  searchQuery: '',
}

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    addNote: (state, action: PayloadAction<Omit<Note, 'id' | 'createdAt'>>) => {
      const newNote: Note = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      }
      state.notes.unshift(newNote)
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter(note => note.id !== action.payload)
    },
    updateNote: (state, action: PayloadAction<Note>) => {
      const index = state.notes.findIndex(note => note.id === action.payload.id)
      if (index !== -1) {
        state.notes[index] = action.payload
      }
    },
    setFilter: (state, action: PayloadAction<string>) => {
      state.filter = action.payload
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    clearAllNotes: (state) => {
      state.notes = []
    },
  },
})

export const { 
  addNote, 
  deleteNote, 
  updateNote, 
  setFilter, 
  setSearchQuery,
  clearAllNotes 
} = notesSlice.actions

export default notesSlice.reducer