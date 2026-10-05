import React, { useEffect, useMemo, useState } from 'react';
import { StatusBar, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNoteStore } from './src/store/noteStore';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { EditorScreen } from './src/screens/EditorScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { Note } from './src/types';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AppTabs() {
  const { isDarkMode } = useNoteStore();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);

  const homeScreen = useMemo(
    () => (
      <HomeScreen
        onOpenNote={(note) => {
          setSelectedNote(note);
          setEditorOpen(true);
        }}
        onCreateNote={() => {
          setSelectedNote(null);
          setEditorOpen(true);
        }}
      />
    ),
    []
  );

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#1f1f1f' : '#ffffff',
          borderTopColor: isDarkMode ? '#2a2a2a' : '#e5e7eb',
          height: 76,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: isDarkMode ? '#9ca3af' : '#6b7280',
      }}
    >
      <Tab.Screen
        name="Notes"
        children={() => (editorOpen ? <EditorScreen note={selectedNote ?? undefined} onClose={() => setEditorOpen(false)} /> : homeScreen)}
        options={{
          tabBarLabel: 'Notes',
          tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size, color }}>📝</Text>,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size, color }}>⚙️</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const { loadFromStorage, isDarkMode, hasSeenOnboarding, setHasSeenOnboarding } = useNoteStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      await loadFromStorage();
      if (mounted) setReady(true);
    })();
    return () => {
      mounted = false;
    };
  }, [loadFromStorage]);

  if (!ready) {
    return <View style={{ flex: 1, backgroundColor: '#111827' }} />;
  }

  return (
    <>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!hasSeenOnboarding ? (
            <Stack.Screen name="Onboarding">
              {() => <OnboardingScreen onFinish={() => { setHasSeenOnboarding(true); }} />}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="Main" component={AppTabs} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

const Text = ({ style, ...props }: any) => <React.Text style={style} {...props} />;
