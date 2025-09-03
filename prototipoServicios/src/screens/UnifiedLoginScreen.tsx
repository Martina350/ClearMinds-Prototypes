import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AuthService from '../services/AuthService';
import { colors, spacing, borderRadius, shadows, baseStyles } from '../styles/theme';
import type { LoginScreenProps } from '../navigation/types';

export const UnifiedLoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'tecnico' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);

  const handleLogin = async () => {
    if (!selectedRole) {
      Alert.alert('Rol requerido', 'Por favor selecciona tu rol');
      return;
    }
    if (!username.trim() || !password.trim()) {
      Alert.alert('Campos requeridos', 'Por favor completa todos los campos');
      return;
    }
    setIsLoading(true);
    try {
      const authService = AuthService.getInstance();
      const user = authService.authenticate(username.trim(), password.trim());
      if (user && user.role === selectedRole) {
        setTimeout(() => {
          setIsLoading(false);
          if (user.role === 'admin') {
            navigation.replace('AdminDashboard');
          } else {
            navigation.replace('TecnicoDashboard', {
              technicianId: user.id,
              technicianName: user.name,
            });
          }
        }, 1000);
      } else {
        setIsLoading(false);
        Alert.alert('Error de autenticación', 'Usuario, contraseña o rol incorrecto. Por favor verifica tus credenciales.');
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Ocurrió un error durante el inicio de sesión');
    }
  };

  const toggleCredentials = () => {
    setShowCredentials(!showCredentials);
  };

  return (
    <View style={baseStyles.container}>
      {/* Header con gradiente */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="shield-checkmark" size={64} color={colors.textInverse} />
        </View>
        <Text style={styles.appTitle}>ClearMinds</Text>
        <Text style={styles.appSubtitle}>Sistema de Gestión de Servicios</Text>
      </View>

      {/* Formulario de login */}
      <View style={styles.formContainer}>
        <View style={styles.formCard}>
          <View style={{ backgroundColor: '#10B981', padding: 8, borderRadius: 8, marginBottom: 16 }}>
            <Text style={{ color: 'white', textAlign: 'center', fontSize: 12, fontWeight: '600' }}>
              ✅ React Navigation Activo - Pantalla: Login
            </Text>
          </View>
          <Text style={styles.formTitle}>🚀 Iniciar Sesión (React Navigation)</Text>
          <Text style={styles.formSubtitle}>Navegación implementada exitosamente - Accede a tu cuenta para continuar</Text>

          {/* Selector de rol */}
          <View style={styles.roleSelector}>
            <Text style={styles.inputLabel}>Selecciona tu rol</Text>
            <View style={styles.roleButtons}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  selectedRole === 'admin' && styles.roleButtonActive
                ]}
                onPress={() => setSelectedRole('admin')}
                activeOpacity={0.8}
              >
                <Ionicons 
                  name="person-circle" 
                  size={24} 
                  color={selectedRole === 'admin' ? colors.textInverse : colors.primary} 
                />
                <Text style={[
                  styles.roleButtonText,
                  selectedRole === 'admin' && styles.roleButtonTextActive
                ]}>
                  Administrador
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleButton,
                  selectedRole === 'tecnico' && styles.roleButtonActive
                ]}
                onPress={() => setSelectedRole('tecnico')}
                activeOpacity={0.8}
              >
                <Ionicons 
                  name="construct" 
                  size={24} 
                  color={selectedRole === 'tecnico' ? colors.textInverse : colors.primary} 
                />
                <Text style={[
                  styles.roleButtonText,
                  selectedRole === 'tecnico' && styles.roleButtonTextActive
                ]}>
                  Técnico
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Campo de usuario */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Usuario</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Ingresa tu usuario"
                placeholderTextColor={colors.textTertiary}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Campo de contraseña */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Contraseña</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Ingresa tu contraseña"
                placeholderTextColor={colors.textTertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Botón de login */}
          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.textInverse} size="small" />
            ) : (
              <>
                <Ionicons name="log-in-outline" size={20} color={colors.textInverse} />
                <Text style={styles.loginButtonText}>🚀 Iniciar con React Navigation</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Botón para ver credenciales */}
          <TouchableOpacity
            style={styles.credentialsButton}
            onPress={toggleCredentials}
            activeOpacity={0.8}
          >
            <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
            <Text style={styles.credentialsButtonText}>Ver credenciales de ejemplo</Text>
          </TouchableOpacity>

          {/* Credenciales de ejemplo */}
          {showCredentials && (
            <View style={styles.credentialsCard}>
              <Text style={styles.credentialsTitle}>Credenciales de Prueba</Text>
              
              <View style={styles.credentialItem}>
                <Text style={styles.credentialRole}>👑 Administrador:</Text>
                <Text style={styles.credentialText}>Usuario: admin | Contraseña: admin123</Text>
              </View>
              
              <View style={styles.credentialItem}>
                <Text style={styles.credentialRole}>🔧 Técnico:</Text>
                <Text style={styles.credentialText}>Usuario: tecnico1 | Contraseña: tecnico123</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 ClearMinds. Todos los derechos reservados.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
    alignItems: 'center',
    ...shadows.lg,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    color: colors.textInverse,
    marginBottom: spacing.xs,
  },
  appSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
    color: colors.textInverse,
    opacity: 0.9,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    ...shadows.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  formSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  roleSelector: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 2,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  roleButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    color: colors.textSecondary,
  },
  roleButtonTextActive: {
    color: colors.textInverse,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  textInput: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: colors.textPrimary,
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    gap: spacing.sm,
    ...shadows.md,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    color: colors.textInverse,
  },
  credentialsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  credentialsButtonText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: colors.primary,
  },
  credentialsCard: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  credentialsTitle: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  credentialItem: {
    marginBottom: spacing.sm,
  },
  credentialRole: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    color: colors.accent,
    marginBottom: spacing.xs,
  },
  credentialText: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: colors.textSecondary,
  },
  footer: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    color: colors.textTertiary,
    textAlign: 'center',
  },
});
