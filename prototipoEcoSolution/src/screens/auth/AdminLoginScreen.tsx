import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing, borderRadius } from '../../styles/spacing';
import { Input } from '../../components/Input';
import { FinalButton as Button } from '../../components/FinalButton';
import { AppIcons } from '../../components/Icon';

interface AdminLoginScreenProps {
  onLogin: (username: string, password: string) => void;
  onBackToClient: () => void;
}

export const AdminLoginScreen: React.FC<AdminLoginScreenProps> = ({
  onLogin,
  onBackToClient
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { username?: string; password?: string } = {};

    if (!username.trim()) {
      newErrors.username = 'El usuario es requerido';
    }

    if (!password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (validateForm()) {
      onLogin(username, password);
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

        {/* Admin Login Form Card */}
        <View style={styles.formCard}>
          <Text style={styles.title}>Acceso Administrador</Text>
          
          <Input
            icon="user"
            placeholder="admin"
            value={username}
            onChangeText={setUsername}
            error={errors.username}
          />
          
          <Input
            icon="lock"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
          />
          
          <Button
            title="ACCEDER"
            onPress={handleLogin}
            style={styles.loginButton}
          />
          
          <TouchableOpacity onPress={onBackToClient} style={styles.backLink}>
            <Text style={styles.backText}>Volver a cliente</Text>
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
  backLink: {
    alignItems: 'center',
  },
  backText: {
    ...typography.body,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
});
