import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Animated, TouchableOpacity, Alert, Image } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { getRecommendationsForMood, Recommendation } from '@/services/ai';
import { savePreferences, getPreferences } from '@/storage/localDb';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import { Spacing, BorderRadius } from '@/theme/spacing';
import Card from '@/components/Card';
import Button from '@/components/Button';

const RECOMMENDATION_ICONS = {
  music: (color: string) => <MaterialIcons name="music-note" size={24} color={color} />,
  activity: (color: string) => <MaterialIcons name="sports-esports" size={24} color={color} />,
  quote: (color: string) => <MaterialIcons name="format-quote" size={24} color={color} />,
  tip: (color: string) => <MaterialIcons name="lightbulb" size={24} color={color} />,
} as const;

// Mapeo de emociones a sus imágenes
const MOOD_IMAGES = {
  'Feliz': require('@/assets/feliz.jpg'),
  'Tranquilo': require('@/assets/tranquilo.jpg'),
  'Neutral': require('@/assets/neutral.jpg'),
  'Triste': require('@/assets/triste.jpg'),
  'Enojado': require('@/assets/enojado.jpg'),
  'Cansado': require('@/assets/cansado.jpg'),
  'Cariñoso': require('@/assets/cariñoso.jpg'),
  'Confundido': require('@/assets/confundido.jpg'),
  'Estresado': require('@/assets/estresado.jpg'),
} as const;

const RECOMMENDATION_COLORS = {
  music: Colors.emotions.happy,
  activity: Colors.emotions.confident,
  quote: Colors.emotions.calm,
  tip: Colors.emotions.excited,
} as const;

interface ResultsScreenProps {
  route: {
    params: {
      mood: string;
      label?: string;
    };
  };
  navigation: {
    navigate: (screen: string, params?: { screen: string }) => void;
  };
}

export default function ResultsScreen({ route, navigation }: ResultsScreenProps) {
  const { mood, label } = route.params || {};
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadRecommendations();
  }, [mood]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const recs = await getRecommendationsForMood(mood);
      setRecommendations(recs);
      
      // Animación de entrada
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeRecommendation = async (rec: Recommendation, index: number) => {
    const recKey = `${mood}-${rec.type}-${index}`;
    
    try {
      const prefs = await getPreferences() || {};
      const updatedPrefs = {
        ...prefs,
        liked: [...(prefs.liked || []), { mood, rec, timestamp: Date.now() }]
      };
      
      await savePreferences(updatedPrefs);
      setLikedItems(prev => new Set([...prev, recKey]));
      
      // Feedback visual
      Alert.alert('¡Guardado!', 'Tu preferencia se ha guardado para personalizar futuras recomendaciones.');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la preferencia. Inténtalo de nuevo.');
    }
  };

  const getMoodColor = () => {
    // Usar el label si está disponible, sino usar el mood
    const moodText = label || mood || '';
    
    if (moodText.includes('Feliz') || moodText.includes('Cariñoso')) return Colors.emotions.happy;
    if (moodText.includes('Triste')) return Colors.emotions.sad;
    if (moodText.includes('Enojado') || moodText.includes('Estresado')) return Colors.emotions.angry;
    if (moodText.includes('Tranquilo')) return Colors.emotions.calm;
    if (moodText.includes('Neutral')) return Colors.emotions.tired;
    if (moodText.includes('Cansado')) return Colors.emotions.tired;
    if (moodText.includes('Confundido')) return Colors.emotions.confused;
    
    // Fallback para emojis si aún se usan
    if (mood?.includes('😀') || mood?.includes('☀️') || mood?.includes('🦋')) return Colors.emotions.happy;
    if (mood?.includes('😔') || mood?.includes('🌧️')) return Colors.emotions.sad;
    if (mood?.includes('😡') || mood?.includes('🌪️')) return Colors.emotions.angry;
    if (mood?.includes('🙂') || mood?.includes('⛅') || mood?.includes('🐢')) return Colors.emotions.calm;
    if (mood?.includes('😎') || mood?.includes('🦁')) return Colors.emotions.confident;
    
    return Colors.primary[500];
  };

  const moodColor = getMoodColor();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <MaterialIcons name="auto-awesome" size={32} color={Colors.primary[600]} />
          <Text style={styles.loadingText}>Generando recomendaciones personalizadas...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header con estado de ánimo */}
      <View style={styles.header}>
        <View style={[styles.moodDisplay, { backgroundColor: moodColor + '20' }]}>
          {label && MOOD_IMAGES[label as keyof typeof MOOD_IMAGES] ? (
            <Image 
              source={MOOD_IMAGES[label as keyof typeof MOOD_IMAGES]} 
              style={styles.moodImage}
              resizeMode="cover"
              onError={() => console.log('Error loading image for:', label)}
            />
          ) : (
            <Text style={styles.moodEmoji}>{mood || '😊'}</Text>
          )}
        </View>
        <Text style={styles.moodTitle}>
          Te sentiste <Text style={{ color: moodColor, fontWeight: '600' }}>{label || 'así'}</Text>
        </Text>
        <Text style={styles.descriptionText}>
          Basándome en tu estado de ánimo, aquí tienes algunas recomendaciones personalizadas:
        </Text>
      </View>

      {/* Recomendaciones */}
      <Animated.View style={[styles.recommendationsContainer, { opacity: fadeAnim }]}>
        {recommendations.map((rec, index) => {
          const recKey = `${mood}-${rec.type}-${index}`;
          const isLiked = likedItems.has(recKey);
          const recColor = RECOMMENDATION_COLORS[rec.type];
          
          return (
            <Card key={index} variant="elevated" style={styles.recommendationCard}>
              <View style={styles.recommendationHeader}>
                <View style={[styles.typeIcon, { backgroundColor: recColor + '20' }]}>
                  {RECOMMENDATION_ICONS[rec.type](recColor)}
                </View>
                <View style={styles.typeInfo}>
                  <Text style={[styles.typeTitle, { color: recColor }]}>
                    {rec.type === 'music' ? 'MÚSICA' :
                     rec.type === 'activity' ? 'ACTIVIDAD' :
                     rec.type === 'quote' ? 'FRASE MOTIVACIONAL' :
                     'CONSEJO RÁPIDO'}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.recommendationText}>{rec.text}</Text>
              
              <View style={styles.actionContainer}>
                <TouchableOpacity
                  style={[
                    styles.likeButton,
                    { 
                      backgroundColor: isLiked ? recColor : Colors.neutral[100],
                      borderColor: isLiked ? recColor : Colors.neutral[300],
                    }
                  ]}
                  onPress={() => handleLikeRecommendation(rec, index)}
                  activeOpacity={0.7}
                >
                  <View style={styles.likeButtonContent}>
                    <MaterialIcons 
                      name={isLiked ? "favorite" : "favorite-border"} 
                      size={16} 
                      color={isLiked ? '#ffffff' : recColor} 
                    />
                    <Text style={[
                      styles.likeButtonText,
                      { color: isLiked ? '#ffffff' : recColor }
                    ]}>
                      Me gusta
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Card>
          );
        })}
      </Animated.View>

      {/* Mensaje de personalización */}
      <Card variant="outlined" style={styles.personalizationCard}>
        <View style={styles.personalizationHeader}>
          <MaterialIcons name="tune" size={24} color={Colors.primary[600]} />
          <Text style={styles.personalizationTitle}>Personalización en progreso</Text>
        </View>
        <Text style={styles.personalizationText}>
          Cuantas más recomendaciones marques como "Me gusta", mejor personalizadas serán tus futuras sugerencias.
        </Text>
      </Card>

      {/* Botones de acción */}
      <View style={styles.actionButtons}>
        <Button
          title="Ver mi historial"
          onPress={() => {
            // Navegar al historial
            navigation.navigate('MainTabs', { screen: 'Historial' });
          }}
          variant="outline"
          size="medium"
          style={styles.actionButton}
        />
        <Button
          title="Volver al inicio"
          onPress={() => {
            // Navegar al inicio
            navigation.navigate('MainTabs', { screen: 'Inicio' });
          }}
          variant="primary"
          size="medium"
          style={styles.actionButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  contentContainer: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.light,
  },
  loadingContent: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    ...Typography.h4,
    color: Colors.primary[600],
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  moodDisplay: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Colors.Shadows.medium,
  },
  moodEmoji: {
    fontSize: 40,
  },
  moodImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  moodTitle: {
    ...Typography.h1,
    color: Colors.primary[700],
    marginBottom: Spacing.xs,
  },
  moodSubtitle: {
    ...Typography.h4,
    color: Colors.neutral[800],
    marginBottom: Spacing.sm,
  },
  descriptionText: {
    ...Typography.body,
    textAlign: 'center',
    color: Colors.neutral[600],
    paddingHorizontal: Spacing.md,
  },
  recommendationsContainer: {
    marginBottom: Spacing.lg,
  },
  recommendationCard: {
    marginBottom: Spacing.md,
    ...Colors.Shadows.medium,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  typeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  typeEmoji: {
    fontSize: 24,
  },
  typeInfo: {
    flex: 1,
  },
  typeTitle: {
    ...Typography.label,
    fontWeight: '700',
    letterSpacing: 1,
  },
  recommendationText: {
    ...Typography.bodyLarge,
    color: Colors.neutral[700],
    marginBottom: Spacing.md,
    lineHeight: 26,
  },
  actionContainer: {
    alignItems: 'flex-end',
  },
  likeButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    minWidth: 120,
    alignItems: 'center',
    backgroundColor: Colors.background.surface,
    ...Colors.Shadows.small,
  },
  likeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  likeButtonText: {
    ...Typography.label,
    fontWeight: '600',
  },
  personalizationCard: {
    marginBottom: Spacing.lg,
    backgroundColor: Colors.secondary[50],
    borderColor: Colors.secondary[200],
    ...Colors.Shadows.small,
  },
  personalizationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  personalizationTitle: {
    ...Typography.h4,
    color: Colors.secondary[700],
  },
  personalizationText: {
    ...Typography.body,
    color: Colors.secondary[600],
    lineHeight: 22,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
  },
});


