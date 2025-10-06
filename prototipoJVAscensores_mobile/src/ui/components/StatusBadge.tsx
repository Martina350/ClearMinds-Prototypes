import React from 'react';
import { View, Text } from 'react-native';
import { useAppState } from '../state/AppState';
import { getTheme } from '../theme/tokens';

type OtEstado = 'PROGRAMADA' | 'EN_CURSO' | 'SUSPENDIDA' | 'REPROGRAMADA' | 'COMPLETADA';

interface StatusBadgeProps {
  status: OtEstado;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const { isDark } = useAppState();
  const theme = getTheme(isDark ? 'dark' : 'light');
  
  const statusConfig = {
    PROGRAMADA: { color: theme.colors.scheduled, label: 'Programada' },
    EN_CURSO: { color: theme.colors.inProgress, label: 'En curso' },
    SUSPENDIDA: { color: theme.colors.suspended, label: 'Suspendida' },
    REPROGRAMADA: { color: theme.colors.rescheduled, label: 'Reprogramada' },
    COMPLETADA: { color: theme.colors.completed, label: 'Completada' }
  };
  
  const config = statusConfig[status];
  const badgeSize = size === 'sm' ? 24 : 32;
  const fontSize = size === 'sm' ? theme.typography.caption : theme.typography.bodySmall;
  
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View
        style={{
          width: badgeSize,
          height: badgeSize,
          borderRadius: badgeSize / 2,
          backgroundColor: config.color + '20',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: theme.spacing.sm
        }}
      >
        <View
          style={{
            width: badgeSize * 0.6,
            height: badgeSize * 0.6,
            borderRadius: (badgeSize * 0.6) / 2,
            backgroundColor: config.color
          }}
        />
      </View>
      <Text style={{ color: config.color, fontSize, fontWeight: '600' }}>{config.label}</Text>
    </View>
  );
}
