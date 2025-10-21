import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { theme } from '../theme/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

interface Props {
  navigation: any;
}

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Campos requeridos', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      const success = await login(email, password);
      
      if (success) {
        Alert.alert(
          'Bienvenido',
          'Inicio de sesión exitoso',
          [{ text: 'Continuar' }]
        );
      } else {
        Alert.alert('Error', 'Credenciales incorrectas');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header con Logo */}
      <View style={styles.header}>
        <Image
          source={require('../assets/logoSantaTeresita.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Formulario de Login */}
      <View style={styles.formContainer}>
      <Text style={styles.title}>Iniciar Sesión</Text>
        <Input
          label="Correo Electrónico"
          placeholder="agente@santateresita.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={styles.passwordContainer}>
          <Input
            label="Contraseña"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <MaterialIcons
              name={showPassword ? 'visibility-off' : 'visibility'}
              size={24}
              color={theme.colors.primaryLight}
            />
          </TouchableOpacity>
        </View>

        <Button
          title="Ingresar"
          onPress={handleLogin}
          variant="primary"
          fullWidth
          disabled={loading}
        />

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Iniciando sesión...</Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>¿No tienes cuenta?</Text>
        <TouchableOpacity onPress={handleRegister}>
          <Text style={styles.registerLink}>Regístrate aquí</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundApp,
  },
  contentContainer: {
    flexGrow: 1,
    padding: theme.spacing.xl,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxxl,
  },
  logo: {
    width: 300,
    height: 100,
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.sizes.xxxl,
    fontWeight: theme.typography.weights.black,
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.primaryLight,
    fontWeight: theme.typography.weights.semibold,
  },
  formContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radii.xxl,
    padding: theme.spacing.xxl,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.md,
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeButton: {
    position: 'absolute',
    right: theme.spacing.md,
    top: 40,
    zIndex: 1,
    padding: theme.spacing.xs,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
  },
  loadingText: {
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textLight,
    fontWeight: theme.typography.weights.medium,
  },
  demoContainer: {
    backgroundColor: theme.colors.warningLight,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  demoTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  demoText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textLight,
    marginBottom: 4,
  },
  footer: {
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  footerText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.sm,
    fontWeight: theme.typography.weights.medium,
  },
  registerLink: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
    letterSpacing: 0.3,
  },
});
