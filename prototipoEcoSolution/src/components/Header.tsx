import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { spacing } from '../styles/spacing';
import { AppIcons } from './Icon';

interface HeaderProps {
  title?: string;
  showNotifications?: boolean;
  showProfile?: boolean;
  showPhoneButton?: boolean;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
  onPhonePress?: () => void;
  notificationCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'EcoSolution',
  showNotifications = true,
  showProfile = true,
  showPhoneButton = true,
  onNotificationPress,
  onProfilePress,
  onPhonePress,
  notificationCount = 0
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>{title}</Text>
      
      <View style={styles.rightContainer}>
        {showNotifications && (
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={onNotificationPress}
          >
            <View style={styles.bellIcon}>
              {AppIcons.bell(20, colors.textPrimary)}
              {notificationCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{notificationCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
        
        {showProfile && (
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={onProfilePress}
          >
            {AppIcons.user(20, colors.textPrimary)}
          </TouchableOpacity>
        )}
        
        {showPhoneButton && (
          <TouchableOpacity 
            style={styles.phoneButton} 
            onPress={onPhonePress}
          >
            {AppIcons.phone(16, colors.textWhite)}
            <Text style={styles.phoneText}>0</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
  },
  logo: {
    ...typography.logo,
    color: colors.primary,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: spacing.sm,
    marginLeft: spacing.sm,
  },
  bellIcon: {
    position: 'relative',
  },
  bellText: {
    fontSize: 20,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.notificationBadge,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: colors.textWhite,
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileIcon: {
    fontSize: 20,
    color: colors.textPrimary,
  },
  phoneButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
    position: 'relative',
  },
  phoneIcon: {
    fontSize: 16,
    color: colors.textWhite,
  },
  phoneText: {
    position: 'absolute',
    bottom: 8,
    fontSize: 10,
    color: colors.textWhite,
    fontWeight: 'bold',
  },
});
