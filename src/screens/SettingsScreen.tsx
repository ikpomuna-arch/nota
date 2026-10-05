import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useNoteStore } from '../store/noteStore';

export function SettingsScreen() {
  const { isDarkMode, setDarkMode, notes } = useNoteStore();

  const total = notes.length;
  const pinned = notes.filter((n) => n.isPinned).length;
  const archived = notes.filter((n) => n.isArchived).length;

  return (
    <View style={[styles.screen, { backgroundColor: isDarkMode ? '#111827' : '#f8fafc' }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDarkMode ? '#f9fafb' : '#111827' }]}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 26 }}>
        <View style={[styles.panel, { backgroundColor: isDarkMode ? '#1f2937' : '#ffffff' }]}>
          <Text style={[styles.label, { color: isDarkMode ? '#9ca3af' : '#6b7280' }]}>DISPLAY</Text>
          <View style={styles.row}>
            <Text style={[styles.option, { color: isDarkMode ? '#f9fafb' : '#111827' }]}>Dark mode</Text>
            <Switch value={isDarkMode} onValueChange={setDarkMode} />
          </View>
        </View>

        <View style={[styles.stats, { backgroundColor: isDarkMode ? '#1f2937' : '#ffffff' }]}>
          <Text style={[styles.label, { color: isDarkMode ? '#9ca3af' : '#6b7280' }]}>STATS</Text>
          <View style={styles.statGrid}>
            <StatBox value={total} label="Notes" icon="📝" />
            <StatBox value={pinned} label="Pinned" icon="📌" />
            <StatBox value={archived} label="Archived" icon="🗂️" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function StatBox({ value, label, icon }: { value: number; label: string; icon: string }) {
  const { isDarkMode } = useNoteStore();
  return (
    <View style={[styles.statBox, { backgroundColor: isDarkMode ? '#111827' : '#f8fafc' }]}>
      <Text style={{ fontSize: 28 }}>{icon}</Text>
      <Text style={[styles.statValue, { color: isDarkMode ? '#f9fafb' : '#111827' }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: isDarkMode ? '#9ca3af' : '#6b7280' }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 18 },
  title: { fontSize: 30, fontWeight: '800' },
  panel: { borderRadius: 18, padding: 18, marginBottom: 18 },
  label: { fontSize: 12, letterSpacing: 1, fontWeight: '700', marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  option: { fontSize: 18, fontWeight: '600' },
  stats: { borderRadius: 18, padding: 18 },
  statGrid: { flexDirection: 'row', gap: 12 },
  statBox: { flex: 1, borderRadius: 14, padding: 18, alignItems: 'center' },
  statValue: { fontSize: 26, fontWeight: '800', marginTop: 10 },
  statLabel: { fontSize: 12, marginTop: 6 },
});
