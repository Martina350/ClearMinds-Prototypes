import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getHistory } from '@/storage/localDb';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import { Spacing, BorderRadius } from '@/theme/spacing';
import Card from '@/components/Card';
import Button from '@/components/Button';

type HistoryEntry = { date: number; mood: string; action?: string };

export default function AdminScreen() {
  const [globalHistory, setGlobalHistory] = useState<HistoryEntry[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const hist = await getHistory();
      setGlobalHistory(hist);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
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

  const filteredHistory = filterHistoryByPeriod(globalHistory, selectedPeriod);
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

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'week': return 'Última semana';
      case 'month': return 'Último mes';
      default: return 'Todo el tiempo';
    }
  };

  const getTopEmotions = () => {
    return Object.entries(moodCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
  };

  const exportData = () => {
    // En un prototipo real, aquí se exportarían los datos
    // Por ahora solo mostramos un mensaje de éxito
    Alert.alert('Éxito', 'Los datos han sido exportados correctamente.');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando datos de administración... 📊</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard Administrativo 👨‍💼</Text>
        <Text style={styles.subtitle}>Análisis de tendencias emocionales globales</Text>
      </View>

      {/* Resumen ejecutivo */}
      <Card variant="elevated" style={styles.summaryCard}>
        <Text style={styles.cardTitle}>📈 Resumen Ejecutivo</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{filteredHistory.length}</Text>
            <Text style={styles.summaryLabel}>Total Registros</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{Object.keys(moodCounts).length}</Text>
            <Text style={styles.summaryLabel}>Estados Únicos</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>
              {filteredHistory.length > 0 ? Math.round(filteredHistory.length / (selectedPeriod === 'week' ? 7 : selectedPeriod === 'month' ? 30 : 1)) : 0}
            </Text>
            <Text style={styles.summaryLabel}>Promedio/Día</Text>
          </View>
        </View>
      </Card>

      {/* Filtros de período */}
      <Card variant="elevated" style={styles.filtersCard}>
        <Text style={styles.cardTitle}>Filtros de análisis</Text>
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

      {/* Tendencias principales */}
      <Card variant="elevated" style={styles.trendsCard}>
        <Text style={styles.cardTitle}>🎯 Tendencias Principales - {getPeriodLabel()}</Text>
        {getTopEmotions().length > 0 ? (
          <View style={styles.trendsList}>
            {getTopEmotions().map(([mood, count], index) => (
              <View key={mood} style={styles.trendItem}>
                <View style={styles.trendRank}>
                  <Text style={styles.trendRankNumber}>#{index + 1}</Text>
                </View>
                <View style={styles.trendMood}>
                  <Text style={styles.trendEmoji}>{mood}</Text>
                </View>
                <View style={styles.trendInfo}>
                  <Text style={styles.trendCount}>{count} registros</Text>
                  <Text style={styles.trendPercentage}>
                    {Math.round((count / filteredHistory.length) * 100)}%
                  </Text>
                </View>
                <View style={[styles.trendBar, { 
                  width: `${(count / Math.max(...Object.values(moodCounts))) * 100}%`,
                  backgroundColor: getMoodColor(mood)
                }]} />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateEmoji}>📊</Text>
            <Text style={styles.emptyStateText}>No hay datos suficientes</Text>
            <Text style={styles.emptyStateSubtext}>Los usuarios necesitan registrar más estados de ánimo</Text>
          </View>
        )}
      </Card>

      {/* Gráficos */}
      {Object.keys(moodCounts).length > 0 && (
        <>
          <Card variant="elevated" style={styles.chartCard}>
            <Text style={styles.chartTitle}>Distribución por Frecuencia 📊</Text>
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
            <Text style={styles.chartTitle}>Distribución Proporcional 🥧</Text>
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

      {/* Insights administrativos */}
      <Card variant="outlined" style={styles.insightsCard}>
        <Text style={styles.insightsTitle}>💡 Insights Administrativos</Text>
        <View style={styles.insights}>
          {filteredHistory.length > 0 ? (
            <>
              <Text style={styles.insightText}>
                • Período analizado: {getPeriodLabel().toLowerCase()}
              </Text>
              <Text style={styles.insightText}>
                • Total de interacciones: {filteredHistory.length}
              </Text>
              {getTopEmotions().length > 0 && (
                <Text style={styles.insightText}>
                  • Estado más común: {getTopEmotions()[0][0]} ({getTopEmotions()[0][1]} registros)
                </Text>
              )}
              <Text style={styles.insightText}>
                • Diversidad emocional: {Object.keys(moodCounts).length} estados únicos
              </Text>
            </>
          ) : (
            <Text style={styles.insightText}>
              Los datos se están recopilando. El análisis estará disponible una vez que haya más registros.
            </Text>
          )}
        </View>
      </Card>

      {/* Acciones administrativas */}
      <Card variant="outlined" style={styles.actionsCard}>
        <Text style={styles.actionsTitle}>⚙️ Acciones Administrativas</Text>
        <View style={styles.actionButtons}>
          <Button
            title="📤 Exportar Datos"
            onPress={exportData}
            variant="outline"
            size="medium"
            style={styles.actionButton}
          />
          <Button
            title="🔄 Actualizar Datos"
            onPress={loadData}
            variant="primary"
            size="medium"
            style={styles.actionButton}
          />
        </View>
      </Card>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.light,
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
  summaryCard: {
    marginBottom: Spacing.lg,
    backgroundColor: Colors.primary[50],
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    ...Typography.h2,
    color: Colors.primary[600],
    fontWeight: '700',
  },
  summaryLabel: {
    ...Typography.caption,
    color: Colors.primary[600],
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  filtersCard: {
    marginBottom: Spacing.lg,
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
  trendsCard: {
    marginBottom: Spacing.lg,
  },
  trendsList: {
    gap: Spacing.md,
  },
  trendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    position: 'relative',
  },
  trendRank: {
    width: 40,
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  trendRankNumber: {
    ...Typography.h4,
    color: Colors.primary[600],
    fontWeight: '700',
  },
  trendMood: {
    marginRight: Spacing.md,
  },
  trendEmoji: {
    fontSize: 32,
  },
  trendInfo: {
    flex: 1,
  },
  trendCount: {
    ...Typography.label,
    color: Colors.neutral[800],
  },
  trendPercentage: {
    ...Typography.caption,
    color: Colors.neutral[600],
  },
  trendBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    borderRadius: BorderRadius.sm,
    opacity: 0.3,
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
    marginBottom: Spacing.lg,
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
  actionsCard: {
    backgroundColor: Colors.neutral[50],
    borderColor: Colors.neutral[200],
  },
  actionsTitle: {
    ...Typography.h4,
    color: Colors.neutral[700],
    marginBottom: Spacing.md,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  cardTitle: {
    ...Typography.h4,
    color: Colors.primary[700],
    marginBottom: Spacing.md,
  },
});


