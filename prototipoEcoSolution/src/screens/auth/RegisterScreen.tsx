import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing, borderRadius } from '../../styles/spacing';
import { Input } from '../../components/Input';
import { FinalButton as Button } from '../../components/FinalButton';
import { AppIcons } from '../../components/Icon';

interface RegisterScreenProps {
  onRegister: (userData: any) => void;
  onBackToLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onRegister,
  onBackToLogin
}) => {
  const [formData, setFormData] = useState({
    country: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const countries = [
    { code: 'Ecuador', name: 'Ecuador' },
    { code: 'USA', name: 'Estados Unidos' },
    { code: 'Colombia', name: 'Colombia' },
    { code: 'Peru', name: 'Perú' }
  ];

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.country) {
      newErrors.country = 'El país es requerido';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre completo es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es requerida';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'La ciudad es requerida';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'El estado/provincia es requerido';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 4) {
      newErrors.password = 'La contraseña debe tener al menos 4 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = () => {
    if (validateForm()) {
      onRegister(formData);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.backgroundGradient}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.formCard}>
            <Text style={styles.title}>Crear Cuenta</Text>
            
            <Input
              icon="globe"
              placeholder="Seleccionar país"
              value={formData.country}
              onChangeText={(value) => updateField('country', value)}
              error={errors.country}
            />
            
            <Input
              icon="user"
              placeholder="Nombre completo"
              value={formData.name}
              onChangeText={(value) => updateField('name', value)}
              error={errors.name}
            />
            
            <Input
              icon="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChangeText={(value) => updateField('email', value)}
              keyboardType="email-address"
              error={errors.email}
            />
            
            <Input
              icon="phone"
              placeholder="Teléfono"
              value={formData.phone}
              onChangeText={(value) => updateField('phone', value)}
              keyboardType="phone-pad"
              error={errors.phone}
            />
            
            <Input
              icon="mapPin"
              placeholder="Dirección"
              value={formData.address}
              onChangeText={(value) => updateField('address', value)}
              error={errors.address}
            />
            
            <Input
              icon="building"
              placeholder="Ciudad"
              value={formData.city}
              onChangeText={(value) => updateField('city', value)}
              error={errors.city}
            />
            
            <Input
              icon="flag"
              placeholder="Estado/Provincia"
              value={formData.state}
              onChangeText={(value) => updateField('state', value)}
              error={errors.state}
            />
            
            <Input
              icon="lock"
              placeholder="Contraseña"
              value={formData.password}
              onChangeText={(value) => updateField('password', value)}
              secureTextEntry
              error={errors.password}
            />
            
            <Input
              icon="lock"
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword}
              onChangeText={(value) => updateField('confirmPassword', value)}
              secureTextEntry
              error={errors.confirmPassword}
            />
            
            <Button
              title="REGISTRARSE"
              onPress={handleRegister}
              style={styles.registerButton}
            />
            
            <TouchableOpacity onPress={onBackToLogin} style={styles.loginLink}>
              <Text style={styles.loginText}>
                ¿Ya tienes cuenta? <Text style={styles.loginLinkText}>Inicia sesión</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  formCard: {
    backgroundColor: colors.background,
    marginHorizontal: 20,
    marginTop: 40,
    marginBottom: 20,
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
  registerButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  loginLink: {
    alignItems: 'center',
  },
  loginText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  loginLinkText: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
});
