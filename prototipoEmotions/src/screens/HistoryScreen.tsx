import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
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

  const getMoodColor = (mood: string) => {
    if (mood?.includes('😀') || mood?.includes('☀️') || mood?.includes('🦋')) return Colors.emotions.happy;
    if (mood?.includes('😔') || mood?.includes('🌧️')) return Colors.emotions.sad;
    if (mood?.includes('😡') || mood?.includes('🌪️')) return Colors.emotions.angry;
    if (mood?.includes('🙂') || mood?.includes('⛅') || mood?.includes('🐢')) return Colors.emotions.calm;
    if (mood?.includes('😎') || mood?.includes('🦁')) return Colors.emotions.confident;
    return Colors.primary[500];
  };

  const barData = {
    labels: Object.keys(moodCounts).slice(0, 6).map(mood => mood.length > 3 ? mood.substring(0, 3) : mood),
    datasets: [{ 
      data: Object.values(moodCounts).slice(0, 6),
      colors: Object.keys(moodCounts).slice(0, 6).map(mood => (opacity = 1) => getMoodColor(mood))
    }]
  };

  const pieData = Object.entries(moodCounts).slice(0, 6).map(([mood, count], idx) => ({
    name: mood.length > 8 ? mood.substring(0, 8) + '...' : mood,
    population: count as number,
    color: getMoodColor(mood),
    legendFontColor: Colors.neutral[700],
    legendFontSize: 12
  }));

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
        <Text style={styles.title}>Mi Viaje Emocional 📊</Text>
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
        <Text style={styles.timelineTitle}>Timeline de emociones 📅</Text>
        {filteredHistory.length > 0 ? (
          <View style={styles.timeline}>
            {filteredHistory.slice().reverse().slice(0, 10).map((entry, idx) => {
              const { date, time } = formatDate(entry.date);
              const moodColor = getMoodColor(entry.mood);
              
              return (
                <View key={idx} style={styles.timelineItem}>
                  <View style={[styles.timelineDot, { backgroundColor: moodColor }]} />
                  <View style={styles.timelineContent}>
                    <View style={styles.timelineHeader}>
                      <Text style={styles.timelineMood}>{entry.mood}</Text>
                      <Text style={styles.timelineDate}>{date} {time}</Text>
                    </View>
                    {entry.action && (
                      <Text style={styles.timelineAction}>Estado: {entry.action}</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateEmoji}>📝</Text>
            <Text style={styles.emptyStateText}>Aún no hay registros</Text>
            <Text style={styles.emptyStateSubtext}>Comienza registrando tu estado de ánimo en la pantalla de inicio</Text>
          </View>
        )}
      </Card>

      {/* Gráficos */}
      {Object.keys(moodCounts).length > 0 && (
        <>
          <Card variant="elevated" style={styles.chartCard}>
            <Text style={styles.chartTitle}>Frecuencia de emociones 📈</Text>
            <BarChart
              width={width}
              height={220}
              data={barData}
              fromZero
              showValuesOnTopOfBars
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={{
                backgroundGradientFrom: Colors.background.light,
                backgroundGradientTo: Colors.background.light,
                decimalPlaces: 0,
                color: (opacity = 1) => Colors.primary[600],
                labelColor: (opacity = 1) => Colors.neutral[700],
                style: {
                  borderRadius: BorderRadius.md,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: Colors.primary[600]
                }
              }}
              style={{
                marginVertical: Spacing.sm,
                borderRadius: BorderRadius.md,
              }}
            />
          </Card>

          <Card variant="elevated" style={styles.chartCard}>
            <Text style={styles.chartTitle}>Distribución emocional 🥧</Text>
            <PieChart
              data={pieData as any}
              width={width}
              height={220}
              accessor={'population'}
              backgroundColor={'transparent'}
              paddingLeft={'15'}
              chartConfig={{
                color: (opacity = 1) => Colors.neutral[700],
              }}
              style={{
                marginVertical: Spacing.sm,
                borderRadius: BorderRadius.md,
              }}
            />
          </Card>
        </>
      )}

      {/* Insights */}
      <Card variant="outlined" style={styles.insightsCard}>
        <Text style={styles.insightsTitle}>💡 Insights sobre tu bienestar</Text>
        {filteredHistory.length > 0 ? (
          <View style={styles.insights}>
            <Text style={styles.insightText}>
              • Has registrado {filteredHistory.length} estados de ánimo en {getPeriodLabel().toLowerCase()}
            </Text>
            {Object.keys(moodCounts).length > 1 && (
              <Text style={styles.insightText}>
                • Tu emoción más frecuente es: {Object.entries(moodCounts).sort(([,a], [,b]) => b - a)[0][0]}
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
  title: {
    ...Typography.h1,
    color: Colors.primary[700],
    marginBottom: Spacing.xs,
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
    alignItems: 'center',
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
  chartTitle: {
    ...Typography.h4,
    color: Colors.primary[700],
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  insightsCard: {
    backgroundColor: Colors.secondary[50],
    borderColor: Colors.secondary[200],
  },
  insightsTitle: {
    ...Typography.h4,
    color: Colors.secondary[700],
    marginBottom: Spacing.md,
  },
  insights: {
    gap: Spacing.sm,
  },
  insightText: {
    ...Typography.body,
    color: Colors.secondary[600],
    lineHeight: 22,
  },
});


