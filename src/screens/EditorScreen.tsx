import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNoteStore } from '../store/noteStore';
import { Note } from '../types';

const palette = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#8b5cf6'];

export function EditorScreen({ note, onClose }: { note?: Note; onClose: () => void }) {
  const { addNote, updateNote, deleteNote, isDarkMode } = useNoteStore();
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [color, setColor] = useState(note?.color || palette[0]);

  const save = async () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert('Empty note', 'Add a title or some text before saving.');
      return;
    }

    if (note) {
      await updateNote(note.id, { title, content, color });
    } else {
      await addNote({ title, content, color });
    }
    onClose();
  };

  const remove = async () => {
    if (!note) return;
    await deleteNote(note.id);
    onClose();
  };

  return (
    <View style={[styles.screen, { backgroundColor: isDarkMode ? '#111827' : '#f8fafc' }]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onClose}><Text style={[styles.icon, { color: isDarkMode ? '#f9fafb' : '#111827' }]}>←</Text></TouchableOpacity>
        <Text style={[styles.heading, { color: isDarkMode ? '#f9fafb' : '#111827' }]}>{note ? 'Edit note' : 'New note'}</Text>
        <TouchableOpacity onPress={save} style={[styles.saveBtn, { backgroundColor: color }]}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
          style={[styles.titleInput, { color: isDarkMode ? '#f9fafb' : '#111827' }]}
        />

        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="Write anything..."
          placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
          multiline
          style={[styles.contentInput, { color: isDarkMode ? '#f9fafb' : '#111827' }]}
        />
      </ScrollView>

      <View style={styles.bottomRow}>
        <View style={styles.paletteRow}>
          {palette.map((swatch) => (
            <TouchableOpacity
              key={swatch}
              onPress={() => setColor(swatch)}
              style={[styles.swatch, { backgroundColor: swatch, borderWidth: color === swatch ? 3 : 0, borderColor: '#fff' }]}
            />
          ))}
        </View>

        {note && (
          <TouchableOpacity onPress={remove}>
            <Text style={styles.delete}>🗑️</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingTop: 52, paddingBottom: 18 },
  icon: { fontSize: 30, fontWeight: '700' },
  heading: { fontSize: 18, fontWeight: '700' },
  saveBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  saveText: { color: '#fff', fontWeight: '700' },
  titleInput: { fontSize: 32, fontWeight: '700', marginBottom: 18 },
  contentInput: { minHeight: 260, fontSize: 18, lineHeight: 28, textAlignVertical: 'top' },
  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 26, paddingTop: 12 },
  paletteRow: { flexDirection: 'row', gap: 10 },
  swatch: { width: 28, height: 28, borderRadius: 14 },
  delete: { fontSize: 28 },
});
