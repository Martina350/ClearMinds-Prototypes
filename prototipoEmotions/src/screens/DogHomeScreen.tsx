import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Animated, TouchableOpacity, Alert, Image } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { appendMood } from '@/storage/localDb';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import { Spacing, BorderRadius } from '@/theme/spacing';
import AnimatedCard from '@/components/AnimatedCard';
import Card from '@/components/Card';
import PulseButton from '@/components/PulseButton';
import BackgroundGradient from '@/components/BackgroundGradient';

const MOOD_CATEGORIES = [
  {
    title: 'Exprésate con un perrito',
    options: [
      { image: require('@/assets/felizD.jpg'), label: 'Feliz', color: Colors.emotions.happy },
      { image: require('@/assets/tristeD.jpg'), label: 'Triste', color: Colors.emotions.sad },
      { image: require('@/assets/enojadoD.jpg'), label: 'Enojado', color: Colors.emotions.angry },
      { image: require('@/assets/tranquiloD.jpg'), label: 'Tranquilo', color: Colors.emotions.calm },
      { image: require('@/assets/neutralD.jpg'), label: 'Neutral', color: Colors.emotions.tired },
      { image: require('@/assets/cansadoD.jpg'), label: 'Cansado', color: Colors.emotions.tired },
      { image: require('@/assets/cariñosoD.jpg'), label: 'Cariñoso', color: Colors.emotions.happy },
      { image: require('@/assets/estresadoD.jpg'), label: 'Estresado', color: Colors.emotions.angry },
      { image: require('@/assets/confundidoD.jpg'), label: 'Confundido', color: Colors.emotions.confused }
    ]
  }
];

interface DogHomeScreenProps {
  navigation: {
    navigate: (screen: string, params?: { mood: string; label: string }) => void;
  };
}

export default function DogHomeScreen({ navigation }: DogHomeScreenProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [scaleAnim] = useState(new Animated.Value(1));

  const handleMoodSelect = async (label: string) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    setSelectedMood(label);
    try {
      await appendMood({ 
        date: Date.now(), 
        mood: label,
        action: label 
      });

      setTimeout(() => {
        navigation.navigate('Results', { mood: label, label: label });
      }, 300);
    } catch (error) {
      console.error('Error saving mood:', error);
    }
  };

  return (
    <BackgroundGradient variant="primary">
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.welcomeContainer}>
          <Ionicons name="paw" size={24} color={Colors.primary[600]} />
          <Text style={styles.welcomeText}>¿Cómo te sientes hoy?</Text>
        </View>
        <Text style={styles.descriptionText}>
          Selecciona la opción que mejor describa tu estado de ánimo actual
        </Text>
      </View>

      {MOOD_CATEGORIES.map((category, categoryIndex) => (
        <Animated.View
          key={categoryIndex}
          style={[
            styles.categoryCard,
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          <AnimatedCard 
            variant="elevated" 
            style={styles.categoryCardInner}
            delay={categoryIndex * 200}
          >
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
          </View>
          
          <View style={styles.optionsGrid}>
            {category.options.map((option, optionIndex) => (
              <TouchableOpacity
                key={optionIndex}
                style={[
                  styles.moodOption,
                  selectedMood === option.label && {
                    backgroundColor: option.color + '20',
                    borderColor: option.color,
                    borderWidth: 3,
                  }
                ]}
                onPress={() => handleMoodSelect(option.label)}
                activeOpacity={0.8}
              >
                <Image 
                  source={option.image} 
                  style={styles.moodImage}
                  resizeMode="cover"
                />
                <Text 
                  style={[
                    styles.moodLabel,
                    selectedMood === option.label && { 
                      color: option.color,
                      fontWeight: '700' 
                    }
                  ]}
                  numberOfLines={2}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          </AnimatedCard>
        </Animated.View>
      ))}

      <Card variant="outlined" style={styles.motivationCard}>
        <View style={styles.motivationContainer}>
          <MaterialIcons name="lightbulb" size={20} color={Colors.primary[600]} />
          <Text style={styles.motivationText}>
            Tip: Tu estado de ánimo es válido y temporal. 
            Recuerda que cada emoción tiene su propósito.
          </Text>
        </View>
      </Card>

      <PulseButton
        title="¿Necesitas ayuda?"
        onPress={() => {
          Alert.alert('Ayuda', '¿Necesitas apoyo emocional? Recuerda que siempre puedes hablar con un profesional de la salud mental.');
        }}
        variant="primary"
        size="medium"
        style={styles.helpButton}
      />
      </ScrollView>
    </BackgroundGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  welcomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  welcomeText: {
    ...Typography.h1,
    color: Colors.primary[700],
  },
  descriptionText: {
    ...Typography.body,
    textAlign: 'center',
    color: Colors.neutral[600],
    paddingHorizontal: Spacing.md,
  },
  categoryCard: {
    marginBottom: Spacing.lg,
    ...Colors.Shadows.medium,
  },
  categoryCardInner: {
    marginBottom: 0,
  },
  categoryHeader: {
    marginBottom: Spacing.md,
  },
  categoryTitle: {
    ...Typography.h4,
    color: Colors.primary[700],
    marginBottom: Spacing.xs,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  moodOption: {
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.neutral[200],
    backgroundColor: Colors.background.surface,
    width: '30%',
    minHeight: 120,
    ...Colors.Shadows.small,
  },
  moodImage: {
    width: 70,
    height: 70,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  moodLabel: {
    ...Typography.bodySmall,
    textAlign: 'center',
    color: Colors.neutral[600],
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 14,
  },
  motivationCard: {
    marginBottom: Spacing.lg,
    backgroundColor: Colors.primary[50],
    borderColor: Colors.primary[200],
    ...Colors.Shadows.small,
  },
  motivationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  motivationText: {
    ...Typography.body,
    flex: 1,
    color: Colors.primary[700],
    fontStyle: 'italic',
  },
  helpButton: {
    alignSelf: 'center',
  },
});



