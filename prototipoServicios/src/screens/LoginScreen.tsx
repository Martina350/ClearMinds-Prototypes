import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Alert, Modal } from 'react-native';

type Props = {
  role: 'admin' | 'tecnico';
  onLoginSuccess: () => void;
  onBack: () => void;
};

export const LoginScreen: React.FC<Props> = ({ role, onLoginSuccess, onBack }) => {
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

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Campos requeridos', 'Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);
    
    // Simular proceso de login
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
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

  const getRoleInfo = () => {
    return role === 'admin' 
      ? { icon: '👨‍💼', title: 'Administrador', color: '#6F42C1' }
      : { icon: '🔧', title: 'Técnico', color: '#28A745' };
  };

  const roleInfo = getRoleInfo();

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
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8}>
            <Text style={styles.backIcon}>←</Text>
            <Text style={styles.backText}>Volver</Text>
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Iniciar sesión</Text>
            <View style={[styles.roleBadge, { backgroundColor: roleInfo.color }]}>
              <Text style={styles.roleIcon}>{roleInfo.icon}</Text>
              <Text style={styles.roleText}>{roleInfo.title}</Text>
            </View>
          </View>
          <View style={{ width: 80 }} />
        </View>

        <View style={styles.formContainer}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>¡Bienvenido de vuelta!</Text>
            <Text style={styles.welcomeSubtitle}>
              Accede a tu cuenta para continuar
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>📧 Correo electrónico</Text>
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
            <Text style={styles.label}>🔒 Contraseña</Text>
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
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? '⏳ Iniciando sesión...' : '🚀 Iniciar sesión'}
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
        </View>
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
              <Text style={styles.modalTitle}>🔐 Recuperar Contraseña</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowForgotPassword(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.modalDescription}>
                Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
              </Text>
              
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>📧 Correo electrónico</Text>
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
                <Text style={styles.modalSubmitText}>📤 Enviar enlace de recuperación</Text>
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
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6C757D',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
  },
  backIcon: {
    color: 'white',
    fontSize: 18,
    marginRight: 4,
  },
  backText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#212529',
    textAlign: 'center',
    marginBottom: 8,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  roleIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  roleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  formContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#212529',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  loginButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 18,
    borderRadius: 25,
    marginTop: 20,
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonDisabled: {
    backgroundColor: '#6C757D',
    shadowOpacity: 0.1,
  },
  loginButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 18,
  },
  helpSection: {
    alignItems: 'center',
    marginTop: 24,
  },
  helpButton: {
    paddingVertical: 8,
  },
  helpText: {
    color: '#007BFF',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#ADB5BD',
    textAlign: 'center',
    lineHeight: 16,
  },
  // Estilos del modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212529',
  },
  modalCloseButton: {
    backgroundColor: '#6C757D',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 20,
  },
  modalDescription: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  modalInputGroup: {
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 2,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  modalSubmitButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalSubmitText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
  },
});


