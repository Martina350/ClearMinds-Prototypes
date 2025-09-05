import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing, borderRadius } from '../../styles/spacing';
import { Input } from '../../components/Input';
import { FinalButton as Button } from '../../components/FinalButton';
import { AppIcons } from '../../components/Icon';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => void;
  onRegister: () => void;
  onAdminAccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  onRegister,
  onAdminAccess
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }

    if (!password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 4) {
      newErrors.password = 'La contraseña debe tener al menos 4 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (validateForm()) {
      onLogin(email, password);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.backgroundGradient}
        style={styles.gradient}
      >
        {/* Status Bar Indicator */}
        <View style={styles.statusBar}>
          <View style={styles.statusIndicator}>
            {AppIcons.phoneStatus(12, colors.textWhite)}
          </View>
        </View>

        {/* Logo Section */}
        <View style={styles.logoSection}>
          {AppIcons.leaf(48, colors.primary)}
          <Text style={styles.appName}>EcoSolution</Text>
          <Text style={styles.tagline}>Servicios de Sanidad Ambiental</Text>
        </View>

        {/* Login Form Card */}
        <View style={styles.formCard}>
          <Text style={styles.title}>Iniciar Sesión</Text>
          
          <Input
            icon="email"
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            error={errors.email}
          />
          
          <Input
            icon="lock"
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
          />
          
          <Button
            title="INICIAR SESIÓN"
            onPress={handleLogin}
            style={styles.loginButton}
          />
          
          <TouchableOpacity onPress={onRegister} style={styles.registerLink}>
            <Text style={styles.registerText}>
              ¿No tienes cuenta? <Text style={styles.registerLinkText}>Regístrate aquí</Text>
            </Text>
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity onPress={onAdminAccess} style={styles.adminLink}>
            <Text style={styles.adminText}>Acceso Administrador</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  statusBar: {
    alignItems: 'flex-end',
    paddingTop: 40,
    paddingRight: 20,
  },
  statusIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIcon: {
    fontSize: 12,
    color: colors.textWhite,
  },
  logoSection: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  leafIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  appName: {
    ...typography.h1,
    color: colors.textWhite,
    marginBottom: 8,
  },
  tagline: {
    ...typography.body,
    color: colors.textLight,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: colors.background,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    shadowColor: colors.shadowDark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    ...typography.h2,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  loginButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  registerLink: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  registerText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  registerLinkText: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  adminLink: {
    alignItems: 'center',
  },
  adminText: {
    ...typography.body,
    color: colors.textPrimary,
  },
});
