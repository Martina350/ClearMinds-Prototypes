import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows, baseStyles } from '../styles/theme';

type Props = {
  onLoginSuccess: (role: 'admin' | 'tecnico') => void;
};

export const UnifiedLoginScreen: React.FC<Props> = ({ onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState<'admin' | 'tecnico' | undefined>(undefined);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRoleSelect = (role: 'admin' | 'tecnico') => {
    setSelectedRole(role);
  };

  const handleLogin = async () => {
    if (!selectedRole) {
      Alert.alert('Rol requerido', 'Por favor selecciona tu rol');
      return;
    }

    if (!email.trim() || !password.trim()) {
      Alert.alert('Campos requeridos', 'Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);
    
    // Simular proceso de login
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(selectedRole);
    }, 1500);
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleRecoverySubmit = () => {
    if (!recoveryEmail.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico');
      return;
    }
    
    // Simular envío de correo de recuperación
    Alert.alert(
      'Correo enviado',
      'Se ha enviado un enlace de recuperación a tu correo electrónico',
      [
        {
          text: 'OK',
          onPress: () => {
            setShowForgotPassword(false);
            setRecoveryEmail('');
          }
        }
      ]
    );
  };

  const isFormValid = selectedRole && email.trim() && password.trim();

  return (
    <View style={baseStyles.container}>
      <Animated.View 
        style={[
          baseStyles.content,
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.mainContainer}>
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.headerSpacer} />
            <Text style={styles.title}>Bienvenido de nuevo!</Text>
            <Text style={styles.subtitle}>Por favor ingresa tus credenciales</Text>
          </View>

        {/* Role Selection - Two Small Buttons */}
        <View style={styles.roleSection}>
          <Text style={styles.roleLabel}>Selecciona tu rol</Text>
          <View style={styles.roleButtons}>
            <TouchableOpacity 
              style={[
                styles.roleButton,
                selectedRole === 'admin' && styles.roleButtonSelected
              ]}
              onPress={() => handleRoleSelect('admin')}
              activeOpacity={0.8}
            >
              <Ionicons 
                name="briefcase-outline" 
                size={20} 
                color={selectedRole === 'admin' ? colors.textInverse : colors.textSecondary} 
              />
              <Text style={[
                styles.roleButtonText,
                selectedRole === 'admin' && styles.roleButtonTextSelected
              ]}>Admin</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.roleButton,
                selectedRole === 'tecnico' && styles.roleButtonSelected
              ]}
              onPress={() => handleRoleSelect('tecnico')}
              activeOpacity={0.8}
            >
              <Ionicons 
                name="construct-outline" 
                size={20} 
                color={selectedRole === 'tecnico' ? colors.textInverse : colors.textSecondary} 
              />
              <Text style={[
                styles.roleButtonText,
                selectedRole === 'tecnico' && styles.roleButtonTextSelected
              ]}>Técnico</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Login Form */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="Your email"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor={colors.textTertiary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              placeholder="Your password"
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor={colors.textTertiary}
            />
          </View>

          <TouchableOpacity 
            style={[
              styles.loginButton, 
              (!isFormValid || isLoading) && styles.loginButtonDisabled
            ]} 
            onPress={handleLogin}
            disabled={!isFormValid || isLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotPasswordButton} onPress={handleForgotPassword} activeOpacity={0.7}>
            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </View>

        
        </View>
      </Animated.View>

      {/* Forgot Password Modal */}
      <Modal
        visible={showForgotPassword}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowForgotPassword(false)}
      >
        <View style={baseStyles.modalOverlay}>
          <View style={baseStyles.modalContent}>
            <View style={baseStyles.modalHeader}>
              <Text style={baseStyles.modalTitle}>Reset Password</Text>
              <TouchableOpacity 
                style={baseStyles.modalCloseButton}
                onPress={() => setShowForgotPassword(false)}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={16} color={colors.textInverse} />
              </TouchableOpacity>
            </View>
            
            <View style={baseStyles.modalBody}>
              <Text style={styles.modalDescription}>
                Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
              </Text>
              
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Email</Text>
                <TextInput
                  placeholder="Your email"
                  style={styles.modalInput}
                  value={recoveryEmail}
                  onChangeText={setRecoveryEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
              
              <TouchableOpacity 
                style={styles.modalSubmitButton} 
                onPress={handleRecoverySubmit}
                activeOpacity={0.8}
              >
                <Text style={styles.modalSubmitText}>Enviar enlace de recuperación</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    maxWidth: 600,
    alignSelf: 'center',
    width: '85%',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingTop: spacing.xxl,
    marginTop: spacing.xl,
  },
  headerSpacer: {
    height: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
    fontWeight: '800',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  roleSection: {
    marginBottom: spacing.lg,
  },
  roleLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  roleButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
  },
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray100,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.border,
    gap: spacing.xs,
    minWidth: 100,
    justifyContent: 'center',
  },
  roleButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    ...shadows.sm,
  },
  roleButtonText: {
    ...typography.label,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  roleButtonTextSelected: {
    color: colors.textInverse,
  },
  formSection: {
    marginBottom: spacing.lg,
    width: '100%',
  },
  inputGroup: {
    marginBottom: spacing.md,
    width: '100%',
  },
  label: {
    ...typography.label,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  input: {
    ...baseStyles.input,
    backgroundColor: colors.gray50,
    borderColor: colors.border,
    borderWidth: 1,
    width: '100%',
    minHeight: 50,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  loginButton: {
    backgroundColor: colors.textPrimary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    marginTop: spacing.md,
    ...shadows.md,
  },
  loginButtonDisabled: {
    backgroundColor: colors.gray500,
    shadowOpacity: 0.1,
  },
  loginButtonText: {
    color: colors.textInverse,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
  },
  forgotPasswordButton: {
    alignItems: 'center',
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
  },
  forgotPasswordText: {
    color: colors.primary,
    ...typography.bodySmall,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  footerText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  createAccountText: {
    color: colors.primary,
    fontWeight: '600',
  },
  // Modal styles
  modalDescription: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  modalInputGroup: {
    marginBottom: spacing.lg,
  },
  modalLabel: {
    ...baseStyles.inputLabel,
  },
  modalInput: {
    ...baseStyles.input,
  },
  modalSubmitButton: {
    ...baseStyles.button,
    ...baseStyles.buttonPrimary,
  },
  modalSubmitText: {
    ...baseStyles.buttonText,
  },
});
