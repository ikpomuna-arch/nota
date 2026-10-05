import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNoteStore } from '../store/noteStore';

const { width } = Dimensions.get('window');

const steps = [
  {
    id: 1,
    emoji: '✨',
    title: 'Capture any thought',
    body: 'Write down ideas, plans, and inspiration before they fade away.',
    color: '#6366f1',
  },
  {
    id: 2,
    emoji: '🧠',
    title: 'Stay focused',
    body: 'Turn clutter into clean thoughts and keep your notes beautifully organized.',
    color: '#ec4899',
  },
  {
    id: 3,
    emoji: '🚀',
    title: 'Create your flow',
    body: 'Build a note system that fits your day, your ideas, and your goals.',
    color: '#10b981',
  },
];

export function OnboardingScreen({ onFinish }: { onFinish: () => void }) {
  const [index, setIndex] = React.useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { isDarkMode } = useNoteStore();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [index]);

  const current = steps[index];

  const next = () => {
    if (index < steps.length - 1) {
      setIndex(index + 1);
      fadeAnim.setValue(0);
    } else {
      onFinish();
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: isDarkMode ? '#111827' : '#f8fafc' }]}>
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}> 
        <Text style={[styles.emoji, { color: current.color }]}>{current.emoji}</Text>
        <Text style={[styles.title, { color: isDarkMode ? '#f9fafb' : '#111827' }]}>{current.title}</Text>
        <Text style={[styles.body, { color: isDarkMode ? '#9ca3af' : '#6b7280' }]}>{current.body}</Text>
      </Animated.View>

      <View style={styles.progressRow}>
        {steps.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                width: i === index ? 28 : 8,
                backgroundColor: i <= index ? current.color : isDarkMode ? '#374151' : '#d1d5db',
              },
            ]}
          />
        ))}
      </View>

      <TouchableOpacity onPress={next} style={[styles.button, { backgroundColor: current.color }]}>
        <Text style={styles.buttonText}>{index === steps.length - 1 ? 'Get started' : 'Next'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: width - 48,
    alignItems: 'center',
    paddingVertical: 48,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  body: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 26,
    marginBottom: 28,
  },
  dot: {
    height: 8,
    borderRadius: 999,
  },
  button: {
    width: '100%',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
