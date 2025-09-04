import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows, baseStyles } from '../styles/theme';
import type { RootStackParamList } from '../navigation/types';
import type { StackScreenProps } from '@react-navigation/stack';

type Props = StackScreenProps<RootStackParamList, 'AssignmentDetail'>;

export const AssignmentDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { scheduleId, technicianId, technicianName, localName, address, clientName, tasks } = route.params;

  return (
    <View style={baseStyles.container}>
      <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.lg }}>
        <View style={styles.card}>
          <Text style={styles.title}>{localName}</Text>
          <Text style={styles.subtitle}>{address}</Text>
          <Text style={styles.subtle}>Cliente: {clientName}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Actividades a realizar</Text>
          {tasks.map(t => (
            <View key={t.id} style={styles.taskRow}>
              <Ionicons name="checkmark-circle-outline" size={18} color={colors.primary} style={{ marginRight: spacing.sm }} />
              <Text style={styles.taskText}>{t.description}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.cta}
          onPress={() => navigation.navigate('InformeForm', {
            technicianId,
            technicianName,
            localName,
            localId: route.params.localId,
            scheduleId,
          })}
          activeOpacity={0.85}
        >
          <Ionicons name="document-text-outline" size={18} color={colors.textInverse} style={{ marginRight: spacing.sm }} />
          <Text style={styles.ctaText}>Crear informe</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  subtle: {
    ...typography.labelSmall,
    color: colors.textTertiary,
  },
  sectionTitle: {
    ...typography.h6,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  taskText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
  },
  cta: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
    marginTop: spacing.lg,
  },
  ctaText: {
    color: colors.textInverse,
    fontWeight: '700',
  },
});

export default AssignmentDetailScreen;


