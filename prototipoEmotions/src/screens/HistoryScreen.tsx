import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { getHistory } from '@/storage/localDb';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import { Spacing, BorderRadius } from '@/theme/spacing';
import Card from '@/components/Card';
import Button from '@/components/Button';

type HistoryEntry = { date: number; mood: string; action?: string };

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('all');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const hist = await getHistory();
      setHistory(hist);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const filterHistoryByPeriod = (entries: HistoryEntry[], period: 'week' | 'month' | 'all') => {
    const now = Date.now();
    const weekAgo = now - (7 * 24 * 60 * 60 * 1000);
    const monthAgo = now - (30 * 24 * 60 * 60 * 1000);

    switch (period) {
      case 'week':
        return entries.filter(entry => entry.date >= weekAgo);
      case 'month':
        return entries.filter(entry => entry.date >= monthAgo);
      default:
        return entries;
    }
  };

  const filteredHistory = filterHistoryByPeriod(history, selectedPeriod);
  const width = Dimensions.get('window').width - 40;

  const moodCounts = filteredHistory.reduce<Record<string, number>>((acc, h) => {
    acc[h.mood] = (acc[h.mood] || 0) + 1;
    return acc;
  }, {});

  // Función para limpiar nombres de emociones (remover emojis)
  const cleanMoodName = (mood: string) => {
    // Mapeo directo de emojis a nombres de emociones
    const emojiToName: Record<string, string> = {
      '😀': 'Feliz',
      '😺': 'Feliz', 
      '😿': 'Triste',
      '😾': 'Enojado',
      '😌': 'Tranquilo',
      '😐': 'Neutral',
      '😴': 'Cansado',
      '😻': 'Cariñoso',
      '🙀': 'Estresado',
      '❓': 'Confundido',
      '😔': 'Triste',
      '😢': 'Triste',
      '😡': 'Enojado',
      '🤬': 'Enojado',
      '😠': 'Enojado',
      '😊': 'Feliz',
      '😄': 'Feliz',
      '😞': 'Triste',
      '😫': 'Cansado',
      '😪': 'Cansado',
      '😍': 'Cariñoso',
      '🥰': 'Cariñoso',
      '😰': 'Estresado',
      '😱': 'Estresado',
      '🤔': 'Confundido',
      '😕': 'Confundido',
      '☀️': 'Feliz',
      '🌧️': 'Triste',
      '🌪️': 'Enojado',
      '🦋': 'Feliz',
      '🐢': 'Tranquilo',
      '🦁': 'Confident',
      '⛅': 'Tranquilo',
      '🙂': 'Tranquilo',
      '😎': 'Confident'
    };

    // Si el mood ya es texto limpio, devolverlo
    if (!/[😀😺😿😾😌😐😴😻🙀❓😔😢😡🤬😠😊😄😞😫😪😍🥰😰😱🤔😕☀️🌧️🌪️🦋🐢🦁⛅🙂😎]/.test(mood)) {
      return mood;
    }

    // Buscar emoji en el mapeo
    for (const [emoji, name] of Object.entries(emojiToName)) {
      if (mood.includes(emoji)) {
        return name;
      }
    }

    // Si no se encuentra, remover emojis y devolver texto limpio
    const cleanText = mood
      .replace(/[\u{1F600}-\u{1F64F}]/gu, '')
      .replace(/[\u{1F300}-\u{1F5FF}]/gu, '')
      .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
      .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '')
      .replace(/[\u{2600}-\u{26FF}]/gu, '')
      .replace(/[\u{2700}-\u{27BF}]/gu, '')
      .trim();
    
    return cleanText.length > 0 ? cleanText : 'Desconocido';
  };

  const getMoodColor = (mood: string) => {
    // Detectar por etiquetas de texto primero
    if (mood.includes('Feliz') || mood.includes('Cariñoso')) return Colors.emotions.happy;
    if (mood.includes('Triste')) return Colors.emotions.sad;
    if (mood.includes('Enojado') || mood.includes('Estresado')) return Colors.emotions.angry;
    if (mood.includes('Tranquilo')) return Colors.emotions.calm;
    if (mood.includes('Neutral')) return Colors.emotions.tired;
    if (mood.includes('Cansado')) return Colors.emotions.tired;
    if (mood.includes('Confundido')) return Colors.emotions.confused;
    
    // Fallback para emojis si aún se usan
    if (mood?.includes('😀') || mood?.includes('☀️') || mood?.includes('🦋')) return Colors.emotions.happy;
    if (mood?.includes('😔') || mood?.includes('🌧️')) return Colors.emotions.sad;
    if (mood?.includes('😡') || mood?.includes('🌪️')) return Colors.emotions.angry;
    if (mood?.includes('🙂') || mood?.includes('⛅') || mood?.includes('🐢')) return Colors.emotions.calm;
    if (mood?.includes('😎') || mood?.includes('🦁')) return Colors.emotions.confident;
    
    return Colors.primary[500];
  };

  const getMoodEmoji = (mood: string) => {
    const text = cleanMoodName(mood);
    if (text.includes('Feliz') || text.includes('Cariñoso')) return '😊';
    if (text.includes('Triste')) return '😔';
    if (text.includes('Enojado') || text.includes('Estresado')) return '😡';
    if (text.includes('Tranquilo')) return '🙂';
    if (text.includes('Neutral')) return '😐';
    if (text.includes('Cansado')) return '😴';
    if (text.includes('Confundido')) return '🤔';
    return '🙂';
  };

  const barData = {
    labels: Object.keys(moodCounts).slice(0, 6).map(mood => mood.length > 3 ? mood.substring(0, 3) : mood),
    datasets: [{
      data: Object.values(moodCounts).slice(0, 6),
      colors: Object.keys(moodCounts).slice(0, 6).map(mood => (opacity = 1) => getMoodColor(mood))
    }]
  };

  // Generar datos para el gráfico de pastel
  const getPieData = () => {
    // Definir todas las emociones disponibles
    const allEmotions = [
      { name: 'Feliz', color: Colors.emotions.happy },
      { name: 'Triste', color: Colors.emotions.sad },
      { name: 'Enojado', color: Colors.emotions.angry },
      { name: 'Tranquilo', color: Colors.emotions.calm },
      { name: 'Neutral', color: Colors.emotions.tired },
      { name: 'Cansado', color: Colors.emotions.tired },
      { name: 'Cariñoso', color: Colors.emotions.happy },
      { name: 'Estresado', color: Colors.emotions.angry },
      { name: 'Confundido', color: Colors.emotions.confused }
    ];

    // Si no hay datos reales, mostrar todas las emociones con valores de ejemplo
    if (Object.keys(moodCounts).length === 0) {
      return allEmotions.map(emotion => ({
        name: emotion.name,
        population: Math.floor(Math.random() * 5) + 1, // Valores aleatorios entre 1-5
        color: emotion.color,
        legendFontColor: Colors.neutral[700],
        legendFontSize: 12
      }));
    }

    // Crear un mapa de emociones con sus conteos
    const emotionMap = new Map();
    
    // Agregar emociones que tienen registros
    Object.entries(moodCounts).forEach(([mood, count]) => {
      const cleanName = cleanMoodName(mood);
      emotionMap.set(cleanName, count);
    });

    // Generar datos para el gráfico incluyendo todas las emociones
    return allEmotions.map(emotion => ({
      name: emotion.name,
      population: emotionMap.get(emotion.name) || 0, // 0 si no hay registros
      color: emotion.color,
      legendFontColor: Colors.neutral[700],
      legendFontSize: 12
    })).filter(item => item.population > 0); // Solo mostrar emociones con registros
  };

  const pieData = getPieData();

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      }),
      time: date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'week': return 'Última semana';
      case 'month': return 'Último mes';
      default: return 'Todo el tiempo';
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <MaterialIcons name="analytics" size={28} color={Colors.primary[600]} />
          <Text style={styles.title}>Mi Viaje Emocional</Text>
        </View>
        <Text style={styles.subtitle}>Observa tus patrones y crecimiento personal</Text>
      </View>

      {/* Filtros de período */}
      <Card variant="elevated" style={styles.filtersCard}>
        <Text style={styles.filtersTitle}>Período de análisis</Text>
        <View style={styles.filterButtons}>
          {(['week', 'month', 'all'] as const).map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.filterButton,
                selectedPeriod === period && styles.filterButtonActive
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[
                styles.filterButtonText,
                selectedPeriod === period && styles.filterButtonTextActive
              ]}>
                {period === 'week' ? '7 días' : period === 'month' ? '30 días' : 'Todo'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {/* Resumen estadístico */}
      <Card variant="elevated" style={styles.statsCard}>
        <Text style={styles.statsTitle}>Resumen de {getPeriodLabel()}</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{filteredHistory.length}</Text>
            <Text style={styles.statLabel}>Registros</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{Object.keys(moodCounts).length}</Text>
            <Text style={styles.statLabel}>Estados únicos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {filteredHistory.length > 0 ? Math.round(filteredHistory.length / (selectedPeriod === 'week' ? 7 : selectedPeriod === 'month' ? 30 : 1)) : 0}
            </Text>
            <Text style={styles.statLabel}>Por día</Text>
          </View>
        </View>
      </Card>

      {/* Timeline de emociones */}
      <Card variant="elevated" style={styles.timelineCard}>
        <Text style={styles.timelineTitle}>Timeline de emociones</Text>
        {filteredHistory.length > 0 ? (
          <View style={styles.timeline}>
            {filteredHistory.slice().reverse().slice(0, 10).map((entry, idx) => {
              const { date, time } = formatDate(entry.date);
              const moodColor = getMoodColor(entry.mood);
              const displayAction = entry.action || cleanMoodName(entry.mood);
              const emoji = getMoodEmoji(entry.mood);

              return (
                <View key={idx} style={styles.timelineItem}>
                  <View style={[styles.timelineDot, { backgroundColor: moodColor }]} />
                  <View style={styles.timelineContent}>
                    <View style={styles.timelineHeader}>
                      <Text style={styles.timelineMood}>{emoji}</Text>
                      <Text style={styles.timelineDate}>{date} {time}</Text>
                    </View>
                    <Text style={styles.timelineAction}>Estado: {displayAction}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="description" size={48} color={Colors.neutral[400]} />
            <Text style={styles.emptyStateText}>Aún no hay registros</Text>
            <Text style={styles.emptyStateSubtext}>Comienza registrando tu estado de ánimo en la pantalla de inicio</Text>
          </View>
        )}
      </Card>

      {/* Gráficos de estadísticas */}
      {Object.keys(moodCounts).length > 0 && (
        <>
          {/* Gráfico de distribución */}
          <Card variant="elevated" style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <View style={styles.chartTitleContainer}>
                <MaterialIcons name="pie-chart" size={24} color={Colors.primary[600]} />
                <Text style={styles.chartTitle}>Distribución Emocional</Text>
              </View>
              <Text style={styles.chartSubtitle}>
                Análisis de tus estados de ánimo registrados
              </Text>
            </View>
            <View style={styles.chartContainer}>
              <PieChart
                data={pieData as any}
                width={width}
                height={220}
                accessor={'population'}
                backgroundColor={'transparent'}
                paddingLeft={'15'}
                hasLegend={true}
                chartConfig={{
                  color: (opacity = 1) => Colors.neutral[700],
                  labelColor: (opacity = 1) => Colors.neutral[700],
                }}
                style={{
                  marginVertical: Spacing.sm,
                  borderRadius: BorderRadius.md,
                }}
              />
            </View>
          </Card>
        </>
      )}

      {/* Insights */}
      <Card variant="outlined" style={styles.insightsCard}>
        <View style={styles.insightsHeader}>
          <MaterialIcons name="lightbulb" size={24} color={Colors.primary[600]} />
          <Text style={styles.insightsTitle}>Insights sobre tu bienestar</Text>
        </View>
        {filteredHistory.length > 0 ? (
          <View style={styles.insights}>
            <Text style={styles.insightText}>
              • Has registrado {filteredHistory.length} estados de ánimo en {getPeriodLabel().toLowerCase()}
            </Text>
            {Object.keys(moodCounts).length > 1 && (
              <Text style={styles.insightText}>
                • Tu emoción más frecuente es: {Object.entries(moodCounts).sort(([, a], [, b]) => b - a)[0][0]}
              </Text>
            )}
            <Text style={styles.insightText}>
              • ¡Sigue registrando para obtener insights más detallados!
            </Text>
          </View>
        ) : (
          <Text style={styles.insightText}>
            Comienza registrando tu estado de ánimo para obtener insights personalizados sobre tu bienestar emocional.
          </Text>
        )}
      </Card>
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
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  title: {
    ...Typography.h1,
    color: Colors.primary[700],
  },
  subtitle: {
    ...Typography.body,
    textAlign: 'center',
    color: Colors.neutral[600],
  },
  filtersCard: {
    marginBottom: Spacing.lg,
  },
  filtersTitle: {
    ...Typography.h4,
    color: Colors.primary[700],
    marginBottom: Spacing.md,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  filterButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.neutral[300],
    backgroundColor: Colors.background.surface,
    alignItems: 'center',
    ...Colors.Shadows.small,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary[600],
    borderColor: Colors.primary[600],
  },
  filterButtonText: {
    ...Typography.label,
    color: Colors.neutral[600],
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  statsCard: {
    marginBottom: Spacing.lg,
  },
  statsTitle: {
    ...Typography.h4,
    color: Colors.primary[700],
    marginBottom: Spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    ...Typography.h2,
    color: Colors.primary[600],
    fontWeight: '700',
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.neutral[600],
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  timelineCard: {
    marginBottom: Spacing.lg,
  },
  timelineTitle: {
    ...Typography.h4,
    color: Colors.primary[700],
    marginBottom: Spacing.md,
  },
  timeline: {
    paddingLeft: Spacing.md,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    alignItems: 'flex-start',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.md,
    marginTop: Spacing.xs,
  },
  timelineContent: {
    flex: 1,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  timelineMood: {
    fontSize: 24,
  },
  timelineDate: {
    ...Typography.caption,
    color: Colors.neutral[500],
  },
  timelineAction: {
    ...Typography.bodySmall,
    color: Colors.neutral[600],
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyStateText: {
    ...Typography.h4,
    color: Colors.neutral[600],
    marginBottom: Spacing.sm,
  },
  emptyStateSubtext: {
    ...Typography.body,
    textAlign: 'center',
    color: Colors.neutral[500],
  },
  chartCard: {
    marginBottom: Spacing.lg,
  },
  chartTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    justifyContent: 'center',
  },
  chartTitle: {
    ...Typography.h4,
    color: Colors.primary[700],
  },
  insightsCard: {
    backgroundColor: Colors.secondary[50],
    borderColor: Colors.secondary[200],
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  insightsTitle: {
    ...Typography.h4,
    color: Colors.secondary[700],
  },
  insights: {
    gap: Spacing.sm,
  },
  insightText: {
    ...Typography.body,
    color: Colors.secondary[600],
    lineHeight: 22,
  },
  // Estilos adicionales para estadísticas mejoradas
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  statValue: {
    ...Typography.h2,
    color: Colors.primary[600],
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  chartHeader: {
    marginBottom: Spacing.md,
  },
  chartSubtitle: {
    ...Typography.body,
    color: Colors.neutral[600],
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  chartLegend: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
  customLegend: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.sm,
  },
  legendText: {
    ...Typography.body,
    color: Colors.neutral[700],
    flex: 1,
  },
  legendPercentage: {
    ...Typography.label,
    color: Colors.primary[600],
    fontWeight: '600',
  },
});


