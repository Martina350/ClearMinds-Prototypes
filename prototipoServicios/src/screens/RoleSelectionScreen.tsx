import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
  onSelectRole: (role: 'admin' | 'tecnico') => void;
};

export const RoleSelectionScreen: React.FC<Props> = ({ onSelectRole }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona tu rol</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.admin]} onPress={() => onSelectRole('admin')}>
          <Text style={styles.buttonText}>Entrar como Admin</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.tech]} onPress={() => onSelectRole('tecnico')}>
          <Text style={styles.buttonText}>Entrar como Técnico</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FFFFFF', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 32, textAlign: 'center' },
  buttonContainer: { gap: 16 },
  button: { paddingVertical: 16, borderRadius: 8, alignItems: 'center' },
  admin: { backgroundColor: '#455A64' },
  tech: { backgroundColor: '#1976D2' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '700' },
});
