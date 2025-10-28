// Pantalla de Inicio con WebView del sitio institucional (Versión Mejorada)
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { WEBVIEW_CONFIG } from '../config/webviewConfig';

export const HomeScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [webViewKey, setWebViewKey] = useState(0);

  // URL del sitio web institucional
  const websiteUrl = WEBVIEW_CONFIG.INSTITUTIONAL_URL;

  const handleLoadStart = () => {
    setLoading(true);
    setError(false);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.log('WebView error: ', nativeEvent);
    setLoading(false);
    setError(true);
  };

  const handleRefresh = () => {
    setError(false);
    setLoading(true);
    setWebViewKey(prev => prev + 1); // Forzar re-render del WebView
  };

  const handleOpenInBrowser = () => {
    Linking.openURL(websiteUrl);
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="wifi-outline" size={80} color="#bdc3c7" />
        <Text style={styles.errorTitle}>Error de Conexión</Text>
        <Text style={styles.errorMessage}>
          No se pudo cargar el sitio web institucional.
        </Text>
        <Text style={styles.errorSubMessage}>
          Verifica tu conexión a internet e intenta nuevamente.
        </Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Ionicons name="refresh" size={20} color="white" />
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.browserButton} onPress={handleOpenInBrowser}>
            <Ionicons name="open-outline" size={20} color="#e74c3c" />
            <Text style={styles.browserButtonText}>Abrir en Navegador</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.offlineInfo}>
          <Text style={styles.offlineTitle}>Información Offline</Text>
          <Text style={styles.offlineText}>
            • Consulta el estado de pagos de tus hijos
          </Text>
          <Text style={styles.offlineText}>
            • Revisa resultados de campeonatos
          </Text>
          <Text style={styles.offlineText}>
            • Realiza pagos desde la app
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e74c3c" />
          <Text style={styles.loadingText}>Cargando sitio web...</Text>
        </View>
      )}
      
      <WebView
        key={webViewKey}
        source={{ uri: websiteUrl }}
        style={styles.webview}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        onHttpError={handleError}
        userAgent={WEBVIEW_CONFIG.USER_AGENT}
        {...WEBVIEW_CONFIG.WEBVIEW_PROPS}
        originWhitelist={['https://*', 'http://*']}
        setSupportMultipleWindows={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0D14', // Negro profundo/azul marino oscuro
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 13, 20, 0.9)', // Negro profundo con transparencia
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#FFFFFF', // Blanco neutro
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#0A0D14', // Negro profundo/azul marino oscuro
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF', // Blanco neutro
    marginTop: 20,
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: '#B3B3B3', // Gris medio
    textAlign: 'center',
    marginBottom: 5,
  },
  errorSubMessage: {
    fontSize: 14,
    color: '#B3B3B3', // Gris medio
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E62026', // Rojo competitivo
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#E62026',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  retryButtonText: {
    color: '#FFFFFF', // Blanco neutro
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  browserButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#E62026', // Rojo competitivo
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browserButtonText: {
    color: '#E62026', // Rojo competitivo
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  offlineInfo: {
    backgroundColor: '#1A1D24', // Card oscuro
    padding: 20,
    borderRadius: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  offlineTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF', // Blanco
    marginBottom: 15,
    textAlign: 'center',
  },
  offlineText: {
    fontSize: 14,
    color: '#B3B3B3', // Gris medio
    marginBottom: 8,
    lineHeight: 20,
  },
});