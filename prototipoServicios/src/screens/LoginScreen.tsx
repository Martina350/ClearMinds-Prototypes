import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
  role: 'admin' | 'tecnico';
  onLoginSuccess: () => void;
  onBack: () => void;
};

export const LoginScreen: React.FC<Props> = ({ role, onLoginSuccess, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    onLoginSuccess();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Iniciar sesión</Text>
        <View style={{ width: 72 }} />
      </View>
      <Text style={styles.roleText}>Rol: {role === 'admin' ? 'Administrador' : 'Técnico'}</Text>
      <View style={styles.formRow}>
        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          placeholder="correo@empresa.com"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>
      <View style={styles.formRow}>
        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          placeholder="••••••••"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  backButton: { backgroundColor: '#757575', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 },
  backText: { color: 'white', fontWeight: '600' },
  title: { fontSize: 22, fontWeight: '700', textAlign: 'center' },
  roleText: { fontSize: 16, color: '#616161', marginBottom: 24, textAlign: 'center' },
  formRow: { marginBottom: 12 },
  label: { marginBottom: 6, color: '#424242' },
  input: {
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FAFAFA',
  },
  button: {
    backgroundColor: '#1976D2',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: { color: 'white', textAlign: 'center', fontWeight: '700' },
});


