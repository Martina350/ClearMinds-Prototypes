import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Alert, Modal, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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

  const getRoleInfo = (role: 'admin' | 'tecnico') => {
    return role === 'admin' 
      ? { icon: 'person-outline' as const, title: 'Administrador', color: '#6366F1', gradient: ['#6366F1', '#8B5CF6'] }
      : { icon: 'construct-outline' as const, title: 'Técnico', color: '#10B981', gradient: ['#10B981', '#059669'] };
  };

  const isFormValid = selectedRole && email.trim() && password.trim();

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* Header con logo */}
          <View style={styles.header}>
            <Image 
              source={require('../widgets/logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.subtitle}>Sistema de Mantenimiento</Text>
          </View>

          {/* Selección de rol */}
          <View style={styles.roleSelectionSection}>
            <Text style={styles.sectionTitle}>Selecciona tu rol</Text>
            <Text style={styles.sectionSubtitle}>¿Cómo vas a usar la aplicación hoy?</Text>
            
            <View style={styles.roleCards}>
              <TouchableOpacity 
                style={[
                  styles.roleCard,
                  selectedRole === 'admin' && styles.roleCardSelected
                ]}
                onPress={() => handleRoleSelect('admin')}
                activeOpacity={0.8}
              >
                <View style={[
                  styles.roleIconContainer,
                  selectedRole === 'admin' && styles.roleIconContainerSelected
                ]}>
                                     <Ionicons 
                     name="briefcase-outline" 
                     size={56} 
                     color={selectedRole === 'admin' ? '#6366F1' : '#94A3B8'} 
                   />
                </View>
                <Text style={[
                  styles.roleTitle,
                  selectedRole === 'admin' && styles.roleTitleSelected
                ]}>Administrador</Text>
                <View style={styles.roleFeatures}>
                  <Text style={styles.feature}>Gestión de usuarios</Text>
                  <Text style={styles.feature}>Revisión de informes</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.roleCard,
                  selectedRole === 'tecnico' && styles.roleCardSelected
                ]}
                onPress={() => handleRoleSelect('tecnico')}
                activeOpacity={0.8}
              >
                <View style={[
                  styles.roleIconContainer,
                  selectedRole === 'tecnico' && styles.roleIconContainerSelected
                ]}>
                                     <Ionicons 
                     name="construct-outline" 
                     size={56} 
                     color={selectedRole === 'tecnico' ? '#10B981' : '#94A3B8'} 
                   />
                </View>
                <Text style={[
                  styles.roleTitle,
                  selectedRole === 'tecnico' && styles.roleTitleSelected
                ]}>Técnico</Text>
                <View style={styles.roleFeatures}>
                  <Text style={styles.feature}>Captura de fotos</Text>
                  <Text style={styles.feature}>Informes detallados</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Formulario de login */}
          <View style={styles.loginSection}>
            <Text style={styles.sectionTitle}>Iniciar sesión</Text>
            <Text style={styles.sectionSubtitle}>
              {selectedRole 
                ? `Accede como ${getRoleInfo(selectedRole).title.toLowerCase()}`
                : 'Selecciona tu rol para continuar'
              }
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo electrónico</Text>
              <TextInput
                placeholder="correo@empresa.com"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor="#ADB5BD"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <TextInput
                placeholder="••••••••"
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#ADB5BD"
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
                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </Text>
            </TouchableOpacity>

            <View style={styles.helpSection}>
              <TouchableOpacity style={styles.helpButton} onPress={handleForgotPassword} activeOpacity={0.7}>
                <Text style={styles.helpText}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Al iniciar sesión, aceptas nuestros términos y condiciones
            </Text>
            <Text style={styles.versionText}>Versión 1.0.0</Text>
          </View>
        </ScrollView>
      </Animated.View>

      {/* Modal de recuperación de contraseña */}
      <Modal
        visible={showForgotPassword}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowForgotPassword(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Recuperar Contraseña</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowForgotPassword(false)}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.modalDescription}>
                Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
              </Text>
              
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Correo electrónico</Text>
                <TextInput
                  placeholder="correo@empresa.com"
                  style={styles.modalInput}
                  value={recoveryEmail}
                  onChangeText={setRecoveryEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholderTextColor="#ADB5BD"
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
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#64748B',
    fontWeight: '500',
  },
  roleSelectionSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  roleCards: {
    gap: 20,
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  roleCardSelected: {
    borderColor: '#6366F1',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  roleIconContainer: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    padding: 24,
    width: 100,
    height: 100,
    justifyContent: 'center',
  },
  roleIconContainerSelected: {
    backgroundColor: '#EEF2FF',
    borderWidth: 3,
    borderColor: '#6366F1',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  roleTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
  },
  roleTitleSelected: {
    color: '#1E293B',
  },
  roleFeatures: {
    gap: 8,
  },
  feature: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
    textAlign: 'center',
  },
  loginSection: {
    marginBottom: 40,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  loginButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 20,
    borderRadius: 16,
    marginTop: 32,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  loginButtonDisabled: {
    backgroundColor: '#94A3B8',
    shadowOpacity: 0.1,
  },
  loginButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '800',
    fontSize: 18,
  },
  helpSection: {
    alignItems: 'center',
    marginTop: 24,
  },
  helpButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  helpText: {
    color: '#6366F1',
    fontSize: 15,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 8,
  },
  versionText: {
    fontSize: 12,
    color: '#CBD5E1',
    fontWeight: '500',
  },
  // Estilos del modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
  },
  modalCloseButton: {
    backgroundColor: '#64748B',
    borderRadius: 12,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    padding: 24,
  },
  modalDescription: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  modalInputGroup: {
    marginBottom: 24,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
  },
  modalInput: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  modalSubmitButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  modalSubmitText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '800',
    fontSize: 16,
  },
});
