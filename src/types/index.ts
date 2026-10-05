export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  color: string;
  isPinned: boolean;
  isArchived: boolean;
}

export interface AppState {
  notes: Note[];
  isDarkMode: boolean;
  hasSeenOnboarding: boolean;
  searchQuery: string;
}
