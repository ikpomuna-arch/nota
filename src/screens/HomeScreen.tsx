import React from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNoteStore } from '../store/noteStore';

export function HomeScreen({ onOpenNote, onCreateNote }: { onOpenNote: (note: any) => void; onCreateNote: () => void }) {
  const { notes, searchQuery, setSearchQuery, isDarkMode } = useNoteStore();

  const filtered = notes.filter((note) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return !note.isArchived;
    return (!note.isArchived) && (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    );
  });

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => onOpenNote(item)}
      style={[
        styles.card,
        {
          backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
          borderColor: item.color || '#6366f1',
        },
      ]}
    >
      <Text style={[styles.cardTitle, { color: isDarkMode ? '#f9fafb' : '#111827' }]}>{item.title}</Text>
      <Text style={[styles.cardBody, { color: isDarkMode ? '#9ca3af' : '#6b7280' }]} numberOfLines={3}>{item.content}</Text>
      <View style={styles.metaRow}>
        <Text style={[styles.meta, { color: isDarkMode ? '#9ca3af' : '#6b7280' }]}>{new Date(item.updatedAt).toLocaleDateString()}</Text>
        {item.isPinned && <Text style={styles.pinned}>📌</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.screen, { backgroundColor: isDarkMode ? '#111827' : '#f8fafc' }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDarkMode ? '#f9fafb' : '#111827' }]}>Nota</Text>
        <View style={[styles.search, { backgroundColor: isDarkMode ? '#1f2937' : '#ffffff', borderColor: isDarkMode ? '#374151' : '#e5e7eb' }]}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search notes..."
            placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
            style={[styles.searchInput, { color: isDarkMode ? '#f9fafb' : '#111827' }]}
          />
        </View>
      </View>

      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ fontSize: 48 }}>📝</Text>
          <Text style={[styles.emptyText, { color: isDarkMode ? '#f9fafb' : '#111827' }]}>No notes yet</Text>
          <Text style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>Create a note to begin.</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 90 }}
          renderItem={renderItem}
        />
      )}

      <TouchableOpacity onPress={onCreateNote} style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 52, paddingBottom: 18 },
  title: { fontSize: 34, fontWeight: '800', marginBottom: 18 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    height: 48,
    paddingHorizontal: 12,
  },
  searchIcon: { fontSize: 20, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16 },
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  cardBody: { fontSize: 14, lineHeight: 20 },
  metaRow: { marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  meta: { fontSize: 12 },
  pinned: { fontSize: 16 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 22, fontWeight: '700', marginTop: 12, marginBottom: 8 },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 28,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  fabText: { color: '#fff', fontSize: 32, fontWeight: '700', marginTop: -3 },
});
