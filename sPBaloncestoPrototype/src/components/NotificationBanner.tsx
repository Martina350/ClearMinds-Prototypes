// Componente de notificaciones in-app
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Notification {
  id: string;
  type: 'payment' | 'match' | 'reminder' | 'success' | 'info';
  title: string;
  message: string;
  action?: () => void;
  actionLabel?: string;
}

interface NotificationBannerProps {
  notification: Notification | null;
  onDismiss: () => void;
  duration?: number;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  notification,
  onDismiss,
  duration = 5000,
}) => {
  const [slideAnim] = useState(new Animated.Value(-100));

  useEffect(() => {
    if (notification) {
      // Slide in
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();

      // Auto dismiss after duration
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleDismiss = () => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onDismiss();
    });
  };

  if (!notification) return null;

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'payment':
        return '#E62026';
      case 'match':
        return '#3498db';
      case 'reminder':
        return '#f39c12';
      case 'success':
        return '#24C36B';
      case 'info':
        return '#9b59b6';
      default:
        return '#2c3e50';
    }
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'payment':
        return 'card-outline';
      case 'match':
        return 'trophy-outline';
      case 'reminder':
        return 'time-outline';
      case 'success':
        return 'checkmark-circle-outline';
      case 'info':
        return 'information-circle-outline';
      default:
        return 'notifications-outline';
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={getIcon()} size={24} color="#FFFFFF" />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{notification.title}</Text>
        <Text style={styles.message}>{notification.message}</Text>
        
        {notification.action && notification.actionLabel && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              notification.action!();
              handleDismiss();
            }}
          >
            <Text style={styles.actionLabel}>{notification.actionLabel}</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.closeButton} onPress={handleDismiss}>
        <Ionicons name="close" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingTop: 50,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  iconContainer: {
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  actionButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 5,
  },
});

