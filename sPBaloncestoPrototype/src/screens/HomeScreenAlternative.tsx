// Pantalla de Inicio Alternativa (Sin WebView)
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const HomeScreenAlternative: React.FC = () => {
  const websiteUrl = 'https://sanpedrobaloncesto.com';

  const handleOpenWebsite = async () => {
    try {
      const supported = await Linking.canOpenURL(websiteUrl);
      if (supported) {
        await Linking.openURL(websiteUrl);
      } else {
        Alert.alert('Error', 'No se puede abrir el sitio web');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al abrir el sitio web');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="globe-outline" size={80} color="#e74c3c" />
        </View>
        
        <Text style={styles.title}>Escuela de Baloncesto</Text>
        <Text style={styles.subtitle}>San Pedro</Text>
        
        <Text style={styles.description}>
          Accede al sitio web institucional para obtener información completa sobre:
        </Text>
        
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={20} color="#27ae60" />
            <Text style={styles.featureText}>Noticias y eventos</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={20} color="#27ae60" />
            <Text style={styles.featureText}>Información académica</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={20} color="#27ae60" />
            <Text style={styles.featureText}>Galería de fotos</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={20} color="#27ae60" />
            <Text style={styles.featureText}>Contacto y ubicación</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.button} onPress={handleOpenWebsite}>
          <Ionicons name="open-outline" size={20} color="white" />
          <Text style={styles.buttonText}>Abrir Sitio Web</Text>
        </TouchableOpacity>
        
        <View style={styles.appInfo}>
          <Text style={styles.appInfoTitle}>Funcionalidades de la App</Text>
          <Text style={styles.appInfoText}>
            • Consulta el estado de pagos de tus hijos
          </Text>
          <Text style={styles.appInfoText}>
            • Revisa resultados de campeonatos
          </Text>
          <Text style={styles.appInfoText}>
            • Realiza pagos desde tu teléfono
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 20,
    color: '#e74c3c',
    fontWeight: '600',
    marginBottom: 30,
  },
  description: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  featuresList: {
    width: '100%',
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  featureText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#2c3e50',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  appInfo: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  appInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  appInfoText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
    lineHeight: 20,
  },
});
