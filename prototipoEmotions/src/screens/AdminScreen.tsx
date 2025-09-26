import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { getHistory } from '@/storage/localDb';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import { Spacing, BorderRadius } from '@/theme/spacing';
import Card from '@/components/Card';
import Button from '@/components/Button';

type HistoryEntry = { date: number; mood: string; action?: string };

export default function AdminScreen() {
  const [globalHistory, setGlobalHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [screenData, setScreenData] = useState(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenData(window);
    });
    loadData();
    return () => subscription?.remove();
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

  const isTablet = screenData.width > 768;
  const chartWidth = isTablet ? screenData.width - 120 : screenData.width - 80;

  // Calcular estadísticas globales
  const totalUsers = globalHistory.length > 0 ? Math.max(1000, globalHistory.length * 10) : 1250; // Simulado
  const activeUsers = Math.round(totalUsers * 0.7); // Simulado
  const moodCounts = globalHistory.reduce<Record<string, number>>((acc, h) => {
    acc[h.mood] = (acc[h.mood] || 0) + 1;
    return acc;
  }, {});
  const mostFrequentMood = Object.entries(moodCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || 'Neutral';

  // Datos para tendencias de estado de ánimo (simulado)
  const moodTrendData = {
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    datasets: [{
      data: [3, 5, 2, 6, 1, 4, 5], // Valores de ánimo (ej. 1-7)
      color: (opacity = 1) => Colors.primary[600],
      strokeWidth: 3
    }]
  };

  // Datos para distribución de estados de ánimo
  const getMoodColor = (mood: string) => {
    if (mood.includes('Feliz') || mood.includes('Cariñoso')) return Colors.emotions.happy;
    if (mood.includes('Triste')) return Colors.emotions.sad;
    if (mood.includes('Enojado') || mood.includes('Estresado')) return Colors.emotions.angry;
    if (mood.includes('Tranquilo')) return Colors.emotions.calm;
    if (mood.includes('Neutral')) return Colors.emotions.tired;
    if (mood.includes('Cansado')) return Colors.emotions.tired;
    if (mood.includes('Confundido')) return Colors.emotions.confused;
    return Colors.primary[500];
  };

  const moodDistributionData = {
    labels: Object.keys(moodCounts).slice(0, 4).map(mood => 
      mood.length > 10 ? mood.substring(0, 10) + '...' : mood
    ),
    datasets: [{
      data: Object.values(moodCounts).slice(0, 4),
      colors: Object.keys(moodCounts).slice(0, 4).map(mood => 
        (opacity = 1) => getMoodColor(mood)
      )
    }]
  };

  // Calcular recomendaciones más populares (simulado basado en datos)
  const getRecommendationsData = () => {
    // Si no hay datos reales, usar datos de ejemplo más limpios
    if (globalHistory.length === 0) {
      return {
        labels: ["Ejercicio", "Socializar", "Meditación", "Música"],
        datasets: [{
          data: [30, 25, 20, 15], // Valores redondeados y limpios
          colors: [
            (opacity = 1) => Colors.primary[600],
            (opacity = 1) => Colors.primary[500],
            (opacity = 1) => Colors.primary[400],
            (opacity = 1) => Colors.primary[300]
          ]
        }]
      };
    }

    const recCounts: Record<string, number> = {};
    globalHistory.forEach(entry => {
      // Simular que cada entrada de historial tiene una recomendación asociada
      const simulatedRecType = ['Meditación', 'Ejercicio', 'Música', 'Socializar'][Math.floor(Math.random() * 4)];
      recCounts[simulatedRecType] = (recCounts[simulatedRecType] || 0) + 1;
    });

    const sortedRecs = Object.entries(recCounts).sort(([,a], [,b]) => b - a).slice(0, 4);
    const totalRecs = sortedRecs.reduce((sum, [, count]) => sum + count, 0);

    return {
      labels: sortedRecs.map(([rec]) => rec),
      datasets: [{
        data: sortedRecs.map(([, count]) => Math.round((count / totalRecs) * 100)), // Redondear a números enteros
        colors: [
          (opacity = 1) => Colors.primary[600],
          (opacity = 1) => Colors.primary[500],
          (opacity = 1) => Colors.primary[400],
          (opacity = 1) => Colors.primary[300]
        ]
      }]
    };
  };
  const recommendationsData = getRecommendationsData();
  const mostFrequentRec = recommendationsData.labels[0] || 'Ejercicio';
  const mostFrequentRecPercentage = recommendationsData.datasets[0].data[0] || 0;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <MaterialIcons name="admin-panel-settings" size={32} color={Colors.primary[600]} />
          <Text style={styles.loadingText}>Cargando datos del panel de administración...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { /* navigation.goBack() */ }} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.neutral[700]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Panel de Administración</Text>
      </View>

      {/* Estadísticas Globales de Usuarios */}
      <Card variant="elevated" style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Estadísticas Globales de Usuarios</Text>
        <View style={isTablet ? styles.statsGridTablet : styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalUsers.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total de Usuarios</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{activeUsers.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Usuarios Activos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{mostFrequentMood}</Text>
            <Text style={styles.statLabel}>Estado Promedio</Text>
          </View>
        </View>
      </Card>

      {/* Tendencias de Estado de Ánimo */}
      <Card variant="elevated" style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Tendencias de Estado de Ánimo</Text>
        <View style={styles.chartSummary}>
          <Text style={styles.chartSummaryText}>Estado actual: <Text style={{fontWeight: '600'}}>{mostFrequentMood}</Text></Text>
          <View style={styles.trendIndicator}>
            <Text style={styles.trendLabel}>Últimos 7 Días</Text>
            <Text style={styles.trendValue}>+5%</Text>
          </View>
        </View>
        <LineChart
          data={moodTrendData}
          width={chartWidth}
          height={200}
          chartConfig={{
            backgroundColor: Colors.background.surface,
            backgroundGradientFrom: Colors.background.surface,
            backgroundGradientTo: Colors.background.surface,
            decimalPlaces: 0,
            color: (opacity = 1) => Colors.primary[600],
            labelColor: (opacity = 1) => Colors.neutral[700],
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: Colors.primary[600]
            }
          }}
          bezier
          style={styles.chartStyle}
        />
      </Card>

      {/* Distribución de Estados de Ánimo */}
      <Card variant="elevated" style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Distribución de Estados de Ánimo</Text>
        <View style={styles.chartSummary}>
          <Text style={styles.chartSummaryText}>Más Alto: <Text style={{fontWeight: '600'}}>{(Object.values(moodCounts).length > 0 ? (Math.max(...Object.values(moodCounts)) / globalHistory.length * 100).toFixed(0) : 0)}% {mostFrequentMood}</Text></Text>
          <View style={styles.trendIndicator}>
            <Text style={styles.trendLabel}>Últimos 30 Días</Text>
            <Text style={styles.trendValue}>+2%</Text>
          </View>
        </View>
        <BarChart
          data={moodDistributionData}
          width={chartWidth}
          height={200}
          fromZero
          showValuesOnTopOfBars
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: Colors.background.surface,
            backgroundGradientFrom: Colors.background.surface,
            backgroundGradientTo: Colors.background.surface,
            decimalPlaces: 0,
            color: (opacity = 1) => Colors.primary[400],
            labelColor: (opacity = 1) => Colors.neutral[700],
            propsForLabels: {
              fontSize: isTablet ? 12 : 10,
            }
          }}
          style={styles.chartStyle}
        />
      </Card>

      {/* Recomendaciones Más Populares */}
      <Card variant="elevated" style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Recomendaciones Más Populares</Text>
        <View style={styles.chartSummary}>
          <Text style={styles.chartSummaryText}>Más Frecuente: <Text style={{fontWeight: '600'}}>{mostFrequentRecPercentage.toFixed(0)}% {mostFrequentRec}</Text></Text>
          <View style={styles.trendIndicator}>
            <Text style={styles.trendLabel}>Últimos 30 Días</Text>
            <Text style={styles.trendValue}>+3%</Text>
          </View>
        </View>
        <BarChart
          data={recommendationsData}
          width={chartWidth}
          height={200}
          fromZero
          showValuesOnTopOfBars
          yAxisLabel=""
          yAxisSuffix="%"
          horizontalLabelRotation={-30}
          chartConfig={{
            backgroundColor: Colors.background.surface,
            backgroundGradientFrom: Colors.background.surface,
            backgroundGradientTo: Colors.background.surface,
            decimalPlaces: 0,
            color: (opacity = 1) => Colors.primary[600],
            labelColor: (opacity = 1) => Colors.neutral[700],
            propsForLabels: {
              fontSize: isTablet ? 12 : 10,
            },
            formatYLabel: (value) => `${Math.round(parseFloat(value))}%`
          }}
          style={styles.chartStyle}
        />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.lg,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: Spacing.sm,
  },
  headerTitle: {
    ...Typography.h2,
    color: Colors.primary[700],
    fontWeight: '700',
  },
  sectionCard: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.primary[700],
    fontWeight: '600',
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'column', // Default to column for mobile
    gap: Spacing.md,
    paddingVertical: Spacing.md,
  },
  statsGridTablet: {
    flexDirection: 'row', // Row for tablet
    justifyContent: 'space-around',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    padding: Spacing.sm,
    backgroundColor: Colors.neutral[50],
    borderRadius: BorderRadius.md,
    ...Colors.Shadows.small,
  },
  statValue: {
    ...Typography.h2,
    color: Colors.primary[600],
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.neutral[600],
    textAlign: 'center',
  },
  chartSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  chartSummaryText: {
    ...Typography.body,
    color: Colors.neutral[700],
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success[50],
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.xs,
  },
  trendLabel: {
    ...Typography.caption,
    color: Colors.success[700],
    marginRight: Spacing.xs,
  },
  trendValue: {
    ...Typography.caption,
    color: Colors.success[700],
    fontWeight: '600',
  },
  chartStyle: {
    marginVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignSelf: 'center', // Center the chart
  },
});