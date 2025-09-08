import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing, borderRadius } from '../../styles/spacing';
import { Header } from '../../components/Header';
import { BottomNavigation } from '../../components/BottomNavigation';
import { Card } from '../../components/Card';
import { FinalButton as Button } from '../../components/FinalButton';
import { AppIcons } from '../../components/Icon';
import { Input } from '../../components/Input';

interface ProfileScreenProps {
  user: any;
  onNotificationPress: () => void;
  onProfilePress: () => void;
  onPhonePress: () => void;
  onTabPress: (tab: string) => void;
  onEditProfile: (updates: any) => void;
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  onNotificationPress,
  onProfilePress,
  onPhonePress,
  onTabPress,
  onEditProfile,
  onLogout
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  // Validate user exists
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: Usuario no encontrado</Text>
      </View>
    );
  }
  
  const tabs = [
    { id: 'services', label: 'Servicios', icon: AppIcons.services, activeIcon: AppIcons.services },
    { id: 'myServices', label: 'Mis Servicios', icon: AppIcons.myServices, activeIcon: AppIcons.myServicesActive },
    { id: 'profile', label: 'Perfil', icon: AppIcons.profile, activeIcon: AppIcons.profileActive }
  ];

  return (
    <View style={styles.container}>
      <Header
        onNotificationPress={onNotificationPress}
        onProfilePress={onProfilePress}
        onPhonePress={onPhonePress}
        notificationCount={0}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              {AppIcons.user(32, colors.textWhite)}
            </View>
          </View>
          
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </Card>
        
        {/* Action Buttons */}
        <Card style={styles.actionCard}>
          <TouchableOpacity style={styles.actionButton} onPress={() => setIsEditing(true)}>
            {AppIcons.edit(20, colors.primary)}
            <Text style={styles.actionText}>Editar Perfil</Text>
          </TouchableOpacity>
        </Card>
        
        <Card style={styles.actionCard}>
          <TouchableOpacity style={styles.actionButton} onPress={onLogout}>
            {AppIcons.logout(20, colors.primary)}
            <Text style={styles.actionText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
      
      <BottomNavigation
        tabs={tabs}
        activeTab="profile"
        onTabPress={onTabPress}
      />

      {/* Modal editar perfil */}
      <Modal visible={isEditing} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>
            <Input placeholder="Nombre" value={form.name} onChangeText={(v) => setForm({ ...form, name: v })} />
            <Input placeholder="Email" value={form.email} keyboardType="email-address" onChangeText={(v) => setForm({ ...form, email: v })} />
            <Input placeholder="Teléfono" value={form.phone} keyboardType="phone-pad" onChangeText={(v) => setForm({ ...form, phone: v })} />

            <View style={styles.modalActions}>
              <Button title="Cancelar" onPress={() => setIsEditing(false)} style={styles.modalButtonSecondary} />
              <Button title="Guardar" onPress={() => { onEditProfile(form); setIsEditing(false); }} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.screenPadding,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginBottom: spacing.lg,
  },
  avatarContainer: {
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarIcon: {
    fontSize: 32,
    color: colors.textWhite,
  },
  userName: {
    ...typography.h3,
    marginBottom: spacing.sm,
  },
  userEmail: {
    ...typography.body,
    color: colors.textSecondary,
  },
  actionCard: {
    marginBottom: spacing.md,
    padding: 0,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  actionIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  actionText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  errorText: {
    ...typography.h3,
    color: colors.error,
    textAlign: 'center',
    marginTop: 100,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  modalTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  modalButtonSecondary: {
    backgroundColor: colors.buttonSecondary,
  },
});
