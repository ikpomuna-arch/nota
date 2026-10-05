import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { AppState, Note } from '../types';

const NOTES_KEY = 'nota_notes';
const SETTINGS_KEY = 'nota_settings';

interface NoteStore extends AppState {
  addNote: (note: Partial<Note>) => Promise<void>;
  updateNote: (id: string, note: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setDarkMode: (value: boolean) => Promise<void>;
  setHasSeenOnboarding: (value: boolean) => Promise<void>;
  loadFromStorage: () => Promise<void>;
}

export const useNoteStore = create<NoteStore>((set, get) => ({
  notes: [],
  isDarkMode: true,
  hasSeenOnboarding: false,
  searchQuery: '',

  addNote: async (note) => {
    const now = new Date().toISOString();
    const fresh: Note = {
      id: `${Date.now()}`,
      title: note.title || 'Untitled',
      content: note.content || '',
      createdAt: now,
      updatedAt: now,
      color: note.color || '#6366F1',
      isPinned: note.isPinned || false,
      isArchived: note.isArchived || false,
    };

    const next = [fresh, ...get().notes];
    set({ notes: next });
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(next));
  },

  updateNote: async (id, note) => {
    const next = get().notes.map((item) =>
      item.id === id
        ? { ...item, ...note, updatedAt: new Date().toISOString() }
        : item
    );
    set({ notes: next });
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(next));
  },

  deleteNote: async (id) => {
    const next = get().notes.filter((item) => item.id !== id);
    set({ notes: next });
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(next));
  },

  togglePin: async (id) => {
    const note = get().notes.find((item) => item.id === id);
    if (!note) return;
    await get().updateNote(id, { isPinned: !note.isPinned });
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  setDarkMode: async (value) => {
    set({ isDarkMode: value });
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify({ isDarkMode: value }));
  },

  setHasSeenOnboarding: async (value) => {
    set({ hasSeenOnboarding: value });
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify({ hasSeenOnboarding: value }));
  },

  loadFromStorage: async () => {
    try {
      const [notesRaw, settingsRaw] = await Promise.all([
        AsyncStorage.getItem(NOTES_KEY),
        AsyncStorage.getItem(SETTINGS_KEY),
      ]);

      const notes = notesRaw ? JSON.parse(notesRaw) : [];
      const settings = settingsRaw ? JSON.parse(settingsRaw) : {};

      set({
        notes,
        isDarkMode: typeof settings.isDarkMode === 'boolean' ? settings.isDarkMode : true,
        hasSeenOnboarding: typeof settings.hasSeenOnboarding === 'boolean' ? settings.hasSeenOnboarding : false,
      });
    } catch (error) {
      console.log('storage load failed', error);
    }
  },
}));
