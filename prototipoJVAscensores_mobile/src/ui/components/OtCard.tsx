import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useAppState } from '../state/AppState';
import { getTheme } from '../theme/tokens';
import { AppText, Caption } from './AppText';
import { StatusBadge } from './StatusBadge';
import { Icon } from './Icon';

interface OtCardProps {
  id: string;
  edificio: string;
  ventana: string;
  durEstimadaMin: number;
  estado: 'PROGRAMADA' | 'EN_CURSO' | 'SUSPENDIDA' | 'REPROGRAMADA' | 'COMPLETADA';
  onPress: () => void;
}

export function OtCard({ id, edificio, ventana, durEstimadaMin, estado, onPress }: OtCardProps) {
  const { isDark } = useAppState();
  const theme = getTheme(isDark ? 'dark' : 'light');
  
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: theme.colors.card,
        borderRadius: theme.radii.lg,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        ...theme.shadows.sm
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: theme.radii.md,
          backgroundColor: theme.colors.primary + '20',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: theme.spacing.lg
        }}
      >
        <Icon name="schedule" color={theme.colors.primary} size={24} />
      </View>
      
      <View style={{ flex: 1 }}>
        <AppText style={{ fontWeight: '700', fontSize: theme.typography.body, marginBottom: 4 }}>
          {id}
        </AppText>
        <Caption style={{ marginBottom: 8 }}>
          Duración estimada: {Math.floor(durEstimadaMin / 60)}h {durEstimadaMin % 60}m
        </Caption>
        <StatusBadge status={estado} size="sm" />
      </View>
      
      <Icon name="chevron-right" color={theme.colors.textSecondary} size={20} />
    </TouchableOpacity>
  );
}
