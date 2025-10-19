import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { theme } from '../theme/theme';
import { MaterialIcons } from '@expo/vector-icons';

interface Props {
  navigation: any;
}

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    cedula: '',
    telefono: '',
    email: '',
    password: '',
    confirmPassword: '',
    codigoAgente: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { nombre, apellidos, cedula, telefono, email, password, confirmPassword, codigoAgente } = formData;
    
    if (!nombre.trim() || !apellidos.trim() || !cedula.trim() || !telefono.trim() || 
        !email.trim() || !password.trim() || !confirmPassword.trim() || !codigoAgente.trim()) {
      Alert.alert('Campos requeridos', 'Por favor completa todos los campos');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Ingresa un email válido');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simular registro
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Registro Exitoso',
        'Tu cuenta ha sido creada. Un administrador revisará tu solicitud.',
        [{ text: 'Aceptar', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header con Logo */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackToLogin}>
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Image
          source={require('../assets/logoSantaTeresita2.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={{ width: 24 }} />
      </View>

      {/* Formulario de Registro */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>Registro de Agente</Text>
        <Text style={styles.subtitle}>Completa tus datos para crear tu cuenta</Text>
        <Input
          label="Nombre"
          placeholder="Tu nombre"
          value={formData.nombre}
          onChangeText={(value) => handleInputChange('nombre', value)}
        />

        <Input
          label="Apellidos"
          placeholder="Tus apellidos"
          value={formData.apellidos}
          onChangeText={(value) => handleInputChange('apellidos', value)}
        />

        <Input
          label="Cédula"
          placeholder="1234567890"
          value={formData.cedula}
          onChangeText={(value) => handleInputChange('cedula', value)}
          keyboardType="numeric"
        />

        <Input
          label="Teléfono"
          placeholder="0987654321"
          value={formData.telefono}
          onChangeText={(value) => handleInputChange('telefono', value)}
          keyboardType="phone-pad"
        />

        <Input
          label="Correo Electrónico"
          placeholder="tu@email.com"
          value={formData.email}
          onChangeText={(value) => handleInputChange('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Input
          label="Código de Agente"
          placeholder="Código asignado por la caja"
          value={formData.codigoAgente}
          onChangeText={(value) => handleInputChange('codigoAgente', value)}
        />

        <View style={styles.passwordContainer}>
          <Input
            label="Contraseña"
            placeholder="Mínimo 6 caracteres"
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
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

        <View style={styles.passwordContainer}>
          <Input
            label="Confirmar Contraseña"
            placeholder="Repite tu contraseña"
            value={formData.confirmPassword}
            onChangeText={(value) => handleInputChange('confirmPassword', value)}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <MaterialIcons
              name={showConfirmPassword ? 'visibility-off' : 'visibility'}
              size={24}
              color={theme.colors.primaryLight}
            />
          </TouchableOpacity>
        </View>

        <Button
          title="Crear Cuenta"
          onPress={handleRegister}
          variant="primary"
          fullWidth
          disabled={loading}
        />

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Creando cuenta...</Text>
          </View>
        )}
      </View>
      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>¿Ya tienes cuenta?</Text>
        <TouchableOpacity onPress={handleBackToLogin}>
          <Text style={styles.loginLink}>Inicia sesión aquí</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEBEE',
  },
  contentContainer: {
    flexGrow: 1,
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  logo: {
    width: 120,
    height: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.primaryLight,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  formContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radii.xl,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.card,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeButton: {
    position: 'absolute',
    right: theme.spacing.md,
    top: 35,
    zIndex: 1,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.md,
  },
  loadingText: {
    marginLeft: theme.spacing.sm,
    fontSize: 14,
    color: theme.colors.primaryLight,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  infoText: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontSize: 14,
    color: theme.colors.text,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: theme.colors.primaryLight,
    marginBottom: theme.spacing.sm,
  },
  loginLink: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
  },
});
