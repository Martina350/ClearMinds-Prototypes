import React, { useRef } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { AppText } from './AppText';
import { Icon } from './Icon';
import { getTheme } from '../theme/tokens';

interface SwipeableNotificationProps {
  type: 'EMERGENCIA' | 'REPROG';
  message: string;
  onDismiss: () => void;
  isDark?: boolean;
}

export function SwipeableNotification({ 
  type, 
  message, 
  onDismiss, 
  isDark = false 
}: SwipeableNotificationProps) {
  const theme = getTheme(isDark ? 'dark' : 'light');
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const screenHeight = Dimensions.get('window').height;

  const getNotificationStyle = () => {
    if (type === 'EMERGENCIA') {
      return {
        backgroundColor: theme.colors.urgent,
        iconBg: '#FFCDD2',
        iconColor: theme.colors.card,
        textColor: theme.colors.card,
        icon: '!'
      };
    } else {
      return {
        backgroundColor: theme.colors.warning,
        iconBg: '#FB8C00',
        iconColor: theme.colors.card,
        textColor: '#E65100',
        icon: 'warning'
      };
    }
  };

  const handleGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const handleStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationY, velocityY } = event.nativeEvent;
      
      // Si se desliza hacia arriba más de 50px o con velocidad negativa suficiente
      if (translationY < -50 || velocityY < -500) {
        // Animar hacia arriba y desvanecer
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -screenHeight,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          })
        ]).start(() => {
          onDismiss();
        });
      } else {
        // Volver a la posición original
        Animated.parallel([
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          })
        ]).start();
      }
    }
  };

  const style = getNotificationStyle();

  return (
    <PanGestureHandler
      onGestureEvent={handleGestureEvent}
      onHandlerStateChange={handleStateChange}
    >
      <Animated.View
        style={{
          transform: [{ translateY }],
          opacity,
          backgroundColor: style.backgroundColor,
          borderRadius: theme.radii.lg,
          padding: theme.spacing.lg,
          marginHorizontal: theme.spacing.lg,
          marginBottom: theme.spacing.md,
          flexDirection: 'row',
          alignItems: 'center',
          ...theme.shadows.sm
        }}
      >
        {/* Icono circular */}
        <View style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: style.iconBg,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: theme.spacing.lg
        }}>
          {type === 'EMERGENCIA' ? (
            <AppText style={{ 
              color: style.iconColor, 
              fontSize: 20, 
              fontWeight: '700' 
            }}>
              !
            </AppText>
          ) : (
            <Icon name="warning" color={style.iconColor} size={20} />
          )}
        </View>

        {/* Texto de la notificación */}
        <View style={{ flex: 1 }}>
          <AppText style={{ 
            color: style.textColor, 
            fontWeight: '700', 
            fontSize: theme.typography.body,
            marginBottom: 4
          }}>
            {type === 'EMERGENCIA' ? 'Nueva orden de trabajo asignada' : 'Reprogramación de emergencia'}
          </AppText>
          <AppText style={{ 
            color: type === 'EMERGENCIA' ? style.textColor : theme.colors.textSecondary,
            fontSize: theme.typography.bodySmall 
          }}>
            {message}
          </AppText>
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
}
