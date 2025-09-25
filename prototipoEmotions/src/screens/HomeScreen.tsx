import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Animated, TouchableOpacity, Alert } from 'react-native';
import { appendMood } from '@/storage/localDb';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import { Spacing, BorderRadius } from '@/theme/spacing';
import AnimatedCard from '@/components/AnimatedCard';
import Card from '@/components/Card';
import PulseButton from '@/components/PulseButton';

const MOOD_CATEGORIES = [
  {
    title: 'Expresa con emojis 😊',
    subtitle: '¿Cómo te sientes emocionalmente?',
    options: [
      { emoji: '😀', label: 'Feliz', color: Colors.emotions.happy },
      { emoji: '🙂', label: 'Tranquilo', color: Colors.emotions.calm },
      { emoji: '😐', label: 'Neutral', color: Colors.emotions.tired },
      { emoji: '😔', label: 'Triste', color: Colors.emotions.sad },
      { emoji: '😡', label: 'Enojado', color: Colors.emotions.angry },
      { emoji: '😴', label: 'Cansado', color: Colors.emotions.tired },
      { emoji: '🤗', label: 'Cariñoso', color: Colors.emotions.happy },
      { emoji: '😎', label: 'Confianza', color: Colors.emotions.confident },
      { emoji: '😵‍💫', label: 'Confundido', color: Colors.emotions.confused },
    ]
  },
  {
    title: 'Describe con el clima 🌤️',
    subtitle: '¿Cómo está tu mundo interior?',
    options: [
      { emoji: '☀️', label: 'Soleado', color: Colors.emotions.happy },
      { emoji: '⛅', label: 'Parcialmente nublado', color: Colors.emotions.calm },
      { emoji: '🌧️', label: 'Lluvioso', color: Colors.emotions.sad },
      { emoji: '🌈', label: 'Arcoíris', color: Colors.emotions.excited },
      { emoji: '🌪️', label: 'Tormentoso', color: Colors.emotions.angry },
      { emoji: '🌙', label: 'Noche estrellada', color: Colors.emotions.calm },
    ]
  },
  {
    title: 'Animales que te representan 🐾',
    subtitle: '¿Con qué animal te identificas hoy?',
    options: [
      { emoji: '🦁', label: 'León - Valiente', color: Colors.emotions.confident },
      { emoji: '🐍', label: 'Serpiente - Sabio', color: Colors.emotions.calm },
      { emoji: '🦋', label: 'Mariposa - Libre', color: Colors.emotions.happy },
      { emoji: '🐢', label: 'Tortuga - Paciente', color: Colors.emotions.calm },
      { emoji: '🦊', label: 'Zorro - Astuto', color: Colors.emotions.confident },
      { emoji: '🐨', label: 'Koala - Relajado', color: Colors.emotions.calm },
    ]
  }
];

interface HomeScreenProps {
  navigation: {
    navigate: (screen: string, params?: { mood: string; label: string }) => void;
  };
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [scaleAnim] = useState(new Animated.Value(1));

  const handleMoodSelect = async (mood: string, label: string) => {
    // Animación de selección
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setSelectedMood(mood);
    
    try {
      await appendMood({ 
        date: Date.now(), 
        mood: mood,
        action: label 
      });
      
      // Navegar después de un pequeño delay para mostrar la selección
      setTimeout(() => {
        navigation.navigate('Results', { mood: mood, label: label });
      }, 300);
    } catch (error) {
      console.error('Error saving mood:', error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>¡Hola! 👋</Text>
        <Text style={styles.subtitleText}>¿Cómo te sientes hoy?</Text>
        <Text style={styles.descriptionText}>
          Selecciona la opción que mejor describa tu estado de ánimo actual
        </Text>
      </View>

      {/* Categorías de estado de ánimo */}
      {MOOD_CATEGORIES.map((category, categoryIndex) => (
        <AnimatedCard 
          key={categoryIndex} 
          variant="elevated" 
          style={styles.categoryCard}
          delay={categoryIndex * 200}
        >
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <Text style={styles.categorySubtitle}>{category.subtitle}</Text>
          </View>
          
          <View style={styles.optionsGrid}>
            {category.options.map((option, optionIndex) => (
              <TouchableOpacity
                key={optionIndex}
                style={[
                  styles.moodOption,
                  selectedMood === option.emoji && {
                    backgroundColor: option.color + '20',
                    borderColor: option.color,
                    borderWidth: 3,
                    transform: [{ scale: 1.05 }],
                  }
                ]}
                onPress={() => handleMoodSelect(option.emoji, option.label)}
                activeOpacity={0.8}
              >
                <Text style={styles.moodEmoji}>{option.emoji}</Text>
                <Text style={[
                  styles.moodLabel,
                  selectedMood === option.emoji && { 
                    color: option.color,
                    fontWeight: '700' 
                  }
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </AnimatedCard>
      ))}

      {/* Mensaje motivacional */}
      <Card variant="outlined" style={styles.motivationCard}>
        <Text style={styles.motivationText}>
          💡 Tip: Tu estado de ánimo es válido y temporal. 
          Recuerda que cada emoción tiene su propósito.
        </Text>
      </Card>

      {/* Botón de ayuda */}
      <PulseButton
        title="💬 ¿Necesitas ayuda?"
        onPress={() => {
          // Aquí podrías abrir un modal de ayuda o navegar a recursos
          // Por ahora solo mostramos un mensaje de ayuda
          Alert.alert('Ayuda', '¿Necesitas apoyo emocional? Recuerda que siempre puedes hablar con un profesional de la salud mental.');
        }}
        variant="primary"
        size="medium"
        style={styles.helpButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lavender, // Lavanda Suave - Fondo principal
  },
  contentContainer: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  welcomeText: {
    ...Typography.h1,
    color: Colors.primary[700],
    marginBottom: Spacing.xs,
  },
  subtitleText: {
    ...Typography.h3,
    color: Colors.neutral[800],
    marginBottom: Spacing.sm,
  },
  descriptionText: {
    ...Typography.body,
    textAlign: 'center',
    color: Colors.neutral[600],
    paddingHorizontal: Spacing.md,
  },
  categoryCard: {
    marginBottom: Spacing.lg,
  },
  categoryHeader: {
    marginBottom: Spacing.md,
  },
  categoryTitle: {
    ...Typography.h4,
    color: Colors.primary[700],
    marginBottom: Spacing.xs,
  },
  categorySubtitle: {
    ...Typography.body,
    color: Colors.neutral[600],
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  moodOption: {
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.neutral[200],
    backgroundColor: '#ffffff',
    minWidth: '30%',
    ...Colors.Shadows.small,
  },
  moodEmoji: {
    fontSize: 36,
    marginBottom: Spacing.xs,
  },
  moodLabel: {
    ...Typography.bodySmall,
    textAlign: 'center',
    color: Colors.neutral[600],
    fontWeight: '500',
  },
  motivationCard: {
    marginBottom: Spacing.lg,
    backgroundColor: Colors.primary[50],
    borderColor: Colors.primary[200],
  },
  motivationText: {
    ...Typography.body,
    textAlign: 'center',
    color: Colors.primary[700],
    fontStyle: 'italic',
  },
  helpButton: {
    alignSelf: 'center',
  },
});


