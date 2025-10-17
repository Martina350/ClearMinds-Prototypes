import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  Vibration,
  Dimensions,
  ActivityIndicator,
  PanResponder,
  Animated,
} from 'react-native';
import { theme } from '../theme/theme';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { AddressStorageService, AddressData } from '../../infrastructure/storage/AddressStorageService';

const { width, height } = Dimensions.get('window');

interface AddressPickerProps {
  label: string;
  placeholder?: string;
  value?: string;
  onAddressSelect: (addressData: AddressData) => void;
  required?: boolean;
}

// Datos reales de calles de Quito para simulación más realista
const REAL_STREETS = [
  { name: 'Av. Amazonas', type: 'principal', lat: -0.1807, lng: -78.4884 },
  { name: 'Av. 6 de Diciembre', type: 'principal', lat: -0.1750, lng: -78.4850 },
  { name: 'Av. Colón', type: 'principal', lat: -0.1850, lng: -78.4900 },
  { name: 'Av. 10 de Agosto', type: 'principal', lat: -0.1700, lng: -78.4800 },
  { name: 'Calle Juan León Mera', type: 'secundaria', lat: -0.1820, lng: -78.4860 },
  { name: 'Calle Reina Victoria', type: 'secundaria', lat: -0.1780, lng: -78.4840 },
  { name: 'Calle Jorge Washington', type: 'secundaria', lat: -0.1830, lng: -78.4870 },
  { name: 'Calle Mariscal Foch', type: 'secundaria', lat: -0.1770, lng: -78.4830 },
  { name: 'Calle Wilson', type: 'secundaria', lat: -0.1840, lng: -78.4880 },
  { name: 'Calle Tamayo', type: 'secundaria', lat: -0.1790, lng: -78.4850 },
];

const REAL_DISTRICTS = [
  { name: 'La Mariscal', lat: -0.1807, lng: -78.4884 },
  { name: 'Centro Histórico', lat: -0.2200, lng: -78.5120 },
  { name: 'La Floresta', lat: -0.1750, lng: -78.4850 },
  { name: 'Bellavista', lat: -0.1700, lng: -78.4800 },
  { name: 'San Juan', lat: -0.1900, lng: -78.4950 },
  { name: 'La Carolina', lat: -0.1650, lng: -78.4750 },
  { name: 'Quito Norte', lat: -0.1500, lng: -78.4700 },
  { name: 'Cumbayá', lat: -0.2000, lng: -78.4500 }
];

export const AddressPicker: React.FC<AddressPickerProps> = ({
  label,
  placeholder = 'Seleccionar ubicación',
  value,
  onAddressSelect,
  required = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [formattedAddress, setFormattedAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [markerPosition, setMarkerPosition] = useState({ x: width/2 - 16, y: height/3 - 16 });
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  
  const pan = new Animated.ValueXY();
  const scaleValue = new Animated.Value(1);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permisos de ubicación',
          'Se requieren permisos de ubicación para usar esta función. Puedes seleccionar manualmente en el mapa.',
          [{ text: 'Entendido' }]
        );
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    } catch (error) {
      console.log('Error obteniendo ubicación:', error);
    }
  };

  // Geocodificación real usando Expo Location
  const getRealGeocoding = async (lat: number, lng: number) => {
    try {
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lng,
      });
      
      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        return {
          street: address.street || 'Calle sin nombre',
          streetNumber: address.streetNumber || '',
          district: address.district || address.subregion || '',
          city: address.city || address.region || 'Quito',
          region: address.region || 'Pichincha',
          country: address.country || 'Ecuador'
        };
      }
    } catch (error) {
      console.log('Error en geocodificación:', error);
    }
    
    // Fallback con datos simulados más realistas
    return getSimulatedGeocoding(lat, lng);
  };

  // Geocodificación simulada más realista
  const getSimulatedGeocoding = (lat: number, lng: number) => {
    // Encontrar la calle más cercana
    let closestStreet = REAL_STREETS[0];
    let minDistance = Number.MAX_VALUE;
    
    REAL_STREETS.forEach(street => {
      const distance = Math.sqrt(
        Math.pow(street.lat - lat, 2) + Math.pow(street.lng - lng, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestStreet = street;
      }
    });
    
    // Encontrar el distrito más cercano
    let closestDistrict = REAL_DISTRICTS[0];
    let minDistrictDistance = Number.MAX_VALUE;
    
    REAL_DISTRICTS.forEach(district => {
      const distance = Math.sqrt(
        Math.pow(district.lat - lat, 2) + Math.pow(district.lng - lng, 2)
      );
      if (distance < minDistrictDistance) {
        minDistrictDistance = distance;
        closestDistrict = district;
      }
    });
    
    // Generar número de casa basado en coordenadas
    const streetNumber = Math.abs(Math.floor(lat * lng * 1000)) % 9999 + 1;
    
    return {
      street: closestStreet.name,
      streetType: closestStreet.type,
      streetNumber: streetNumber,
      district: closestDistrict.name,
      city: 'Quito',
      region: 'Pichincha',
      country: 'Ecuador'
    };
  };

  const handleMapPress = async (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    
    // Calcular coordenadas basadas en la posición del tap y el offset del mapa
    const adjustedX = locationX - mapOffset.x;
    const adjustedY = locationY - mapOffset.y;
    
    // Convertir posición de pantalla a coordenadas geográficas
    const lat = -0.1807 + (adjustedY - height/3) * 0.0001;
    const lng = -78.4884 + (adjustedX - width/2) * 0.0001;
    
    setSelectedLocation({ lat, lng });
    setMarkerPosition({ x: adjustedX - 16, y: adjustedY - 16 });
    
    // Feedback háptico
    Vibration.vibrate(50);
    
    // Geocodificación real
    setLoading(true);
    try {
      const addressData = await getRealGeocoding(lat, lng);
      
      // Formatear dirección
      const streetNumber = addressData.streetNumber ? ` #${addressData.streetNumber}` : '';
      const district = addressData.district ? `, ${addressData.district}` : '';
      const formatted = `${addressData.street}${streetNumber}${district}, ${addressData.city}`;
      
      setFormattedAddress(formatted);
    } catch (error) {
      console.log('Error en geocodificación:', error);
      setFormattedAddress(`Ubicación: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    if (!location) {
      Alert.alert('Error', 'No se pudo obtener la ubicación actual');
      return;
    }
    
    const { latitude, longitude } = location.coords;
    setSelectedLocation({ lat: latitude, lng: longitude });
    
    // Centrar marcador en ubicación actual
    setMarkerPosition({ x: width/2 - 16, y: height/3 - 16 });
    
    // Geocodificación real para ubicación actual
    setLoading(true);
    try {
      const addressData = await getRealGeocoding(latitude, longitude);
      const streetNumber = addressData.streetNumber ? ` #${addressData.streetNumber}` : '';
      const district = addressData.district ? `, ${addressData.district}` : '';
      const formatted = `${addressData.street}${streetNumber}${district}, ${addressData.city}`;
      setFormattedAddress(formatted);
    } catch (error) {
      console.log('Error en geocodificación:', error);
      setFormattedAddress(`Ubicación: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUseLocation = async () => {
    if (!selectedLocation) {
      Alert.alert('Error', 'Por favor selecciona una ubicación en el mapa');
      return;
    }

    // Obtener datos de la calle real
    const addressData = await getRealGeocoding(selectedLocation.lat, selectedLocation.lng);
    
    const addressDataToSave: AddressData = {
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
      formattedAddress: formattedAddress || `Ubicación: ${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`,
      source: location ? 'gps' : 'manual',
      capturedAt: new Date().toISOString(),
    };

    try {
      // Guardar offline para sincronización posterior
      await AddressStorageService.saveAddressOffline(addressDataToSave);
      
      onAddressSelect(addressDataToSave);
      setModalVisible(false);
      
      // Feedback háptico
      Vibration.vibrate(100);
      
      // Mostrar confirmación
      Alert.alert(
        'Ubicación guardada',
        `Calle Principal: ${addressData.streetType === 'principal' ? addressData.street : 'Calle Principal'}\nCalle Secundaria: ${addressData.streetType === 'secundaria' ? addressData.street : 'Calle Secundaria'}\nDirección: ${addressData.street}${addressData.streetNumber ? ` #${addressData.streetNumber}` : ''}, ${addressData.district}`,
        [{ text: 'Entendido' }]
      );
    } catch (error) {
      console.error('Error guardando dirección:', error);
      Alert.alert(
        'Error',
        'No se pudo guardar la ubicación. Inténtalo de nuevo.',
        [{ text: 'Aceptar' }]
      );
    }
  };

  const openMapModal = () => {
    setModalVisible(true);
    // Resetear marcador al centro
    setMarkerPosition({ x: width/2 - 16, y: height/3 - 16 });
  };

  // PanResponder para el mapa
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      pan.setOffset({
        x: pan.x._value,
        y: pan.y._value,
      });
      pan.setValue({ x: 0, y: 0 });
    },
    onPanResponderMove: Animated.event(
      [null, { dx: pan.x, dy: pan.y }],
      { useNativeDriver: false }
    ),
    onPanResponderRelease: () => {
      pan.flattenOffset();
      setMapOffset({ x: pan.x._value, y: pan.y._value });
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      
      <TouchableOpacity
        style={[styles.input, value && styles.inputFilled]}
        onPress={openMapModal}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`${label}. ${value || placeholder}`}
        accessibilityHint="Toca para abrir el mapa y seleccionar ubicación"
      >
        <Text style={[styles.inputText, value && styles.inputTextFilled]}>
          {value || placeholder}
        </Text>
        <MaterialIcons name="location-on" size={24} color={theme.colors.primary} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
              accessibilityRole="button"
              accessibilityLabel="Cerrar mapa"
            >
              <MaterialIcons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Seleccionar Ubicación</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.mapContainer}>
            <Animated.View
              style={[
                styles.map,
                {
                  transform: [
                    { translateX: pan.x },
                    { translateY: pan.y },
                    { scale: scaleValue },
                  ],
                },
              ]}
              {...panResponder.panHandlers}
            >
              <TouchableOpacity
                style={styles.mapContent}
                activeOpacity={1}
                onPress={handleMapPress}
              >
                {/* Grid del mapa más realista */}
                <View style={styles.mapGrid}>
                  {/* Líneas de calles principales (horizontales) */}
                  <View style={[styles.streetLine, styles.principalStreet, { top: '20%' }]} />
                  <View style={[styles.streetLine, styles.principalStreet, { top: '40%' }]} />
                  <View style={[styles.streetLine, styles.principalStreet, { top: '60%' }]} />
                  <View style={[styles.streetLine, styles.principalStreet, { top: '80%' }]} />
                  
                  {/* Líneas de calles secundarias (verticales) */}
                  <View style={[styles.streetLine, styles.secundariaStreet, { left: '20%', top: 0, width: 2, height: '100%' }]} />
                  <View style={[styles.streetLine, styles.secundariaStreet, { left: '40%', top: 0, width: 2, height: '100%' }]} />
                  <View style={[styles.streetLine, styles.secundariaStreet, { left: '60%', top: 0, width: 2, height: '100%' }]} />
                  <View style={[styles.streetLine, styles.secundariaStreet, { left: '80%', top: 0, width: 2, height: '100%' }]} />
                  
                  {/* Etiquetas de calles reales */}
                  <Text style={[styles.streetLabel, { top: '18%', left: 10 }]}>Av. Amazonas</Text>
                  <Text style={[styles.streetLabel, { top: '38%', left: 10 }]}>Av. 6 de Diciembre</Text>
                  <Text style={[styles.streetLabel, { top: '58%', left: 10 }]}>Av. Colón</Text>
                  <Text style={[styles.streetLabel, { top: '78%', left: 10 }]}>Av. 10 de Agosto</Text>
                  
                  <Text style={[styles.streetLabel, styles.verticalLabel, { left: '18%', top: 10 }]}>Calle Mera</Text>
                  <Text style={[styles.streetLabel, styles.verticalLabel, { left: '38%', top: 10 }]}>Calle Victoria</Text>
                  <Text style={[styles.streetLabel, styles.verticalLabel, { left: '58%', top: 10 }]}>Calle Washington</Text>
                  <Text style={[styles.streetLabel, styles.verticalLabel, { left: '78%', top: 10 }]}>Calle Foch</Text>
                  
                  {/* Puntos de referencia */}
                  <View style={[styles.landmark, { top: '25%', left: '30%' }]}>
                    <MaterialIcons name="place" size={16} color={theme.colors.primary} />
                  </View>
                  <View style={[styles.landmark, { top: '45%', left: '70%' }]}>
                    <MaterialIcons name="place" size={16} color={theme.colors.primary} />
                  </View>
                  <View style={[styles.landmark, { top: '65%', left: '25%' }]}>
                    <MaterialIcons name="place" size={16} color={theme.colors.primary} />
                  </View>
                </View>
                
                {/* Marcador */}
                <Animated.View style={[styles.marker, { left: markerPosition.x, top: markerPosition.y }]}>
                  <MaterialIcons name="place" size={32} color={theme.colors.primary} />
                </Animated.View>
                
                {/* Instrucciones */}
                <View style={styles.instructions}>
                  <Text style={styles.instructionsText}>
                    Toca en el mapa para colocar el marcador
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
            
            {selectedLocation && (
              <View style={styles.locationInfo}>
                <View style={styles.coordinatesDisplay}>
                  <View style={styles.coordinateItem}>
                    <Text style={styles.coordinateLabel}>Principal</Text>
                    <Text style={styles.coordinateValue}>
                      {selectedLocation.lat.toFixed(6)}
                    </Text>
                  </View>
                  <View style={styles.coordinateItem}>
                    <Text style={styles.coordinateLabel}>Secundaria</Text>
                    <Text style={styles.coordinateValue}>
                      {selectedLocation.lng.toFixed(6)}
                    </Text>
                  </View>
                </View>
                {formattedAddress && (
                  <Text style={styles.addressText}>
                    {formattedAddress}
                  </Text>
                )}
                {loading && (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator color={theme.colors.primary} size="small" />
                    <Text style={styles.loadingText}>
                      Obteniendo dirección...
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.actionButton, styles.currentLocationButton]}
              onPress={handleUseCurrentLocation}
              disabled={!location}
              accessibilityRole="button"
              accessibilityLabel="Usar ubicación actual"
            >
              <MaterialIcons 
                name="my-location" 
                size={20} 
                color={location ? theme.colors.primary : theme.colors.subtitle} 
              />
              <Text style={[
                styles.currentLocationButtonText,
                !location && styles.disabledText
              ]}>
                Mi ubicación
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.confirmButton,
                !selectedLocation && styles.disabledButton
              ]}
              onPress={handleUseLocation}
              disabled={!selectedLocation}
              accessibilityRole="button"
              accessibilityLabel="Usar esta ubicación"
            >
              <Text style={[
                styles.confirmButtonText,
                !selectedLocation && styles.disabledButtonText
              ]}>
                Usar ubicación
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 6,
  },
  required: {
    color: theme.colors.primaryDark,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: theme.colors.background,
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputFilled: {
    borderColor: theme.colors.primary,
  },
  inputText: {
    fontSize: 16,
    color: theme.colors.subtitle,
    flex: 1,
  },
  inputTextFilled: {
    color: theme.colors.text,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.altBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text,
  },
  mapContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: theme.colors.altBackground,
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  mapContent: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  mapGrid: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: '#f0f8ff',
  },
  streetLine: {
    position: 'absolute',
    backgroundColor: '#666',
  },
  principalStreet: {
    width: '100%',
    height: 4,
    backgroundColor: '#333',
  },
  secundariaStreet: {
    width: 2,
    height: '100%',
    backgroundColor: '#666',
  },
  streetLabel: {
    position: 'absolute',
    fontSize: 10,
    color: theme.colors.subtitle,
    fontWeight: '600',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verticalLabel: {
    transform: [{ rotate: '90deg' }],
    transformOrigin: 'left center',
  },
  landmark: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.card,
  },
  marker: {
    position: 'absolute',
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  instructions: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    ...theme.shadows.card,
  },
  instructionsText: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  locationInfo: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: theme.colors.background,
    padding: 16,
    borderRadius: 12,
    ...theme.shadows.card,
  },
  coordinatesDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  coordinateItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  coordinateLabel: {
    fontSize: 12,
    color: theme.colors.subtitle,
    fontWeight: '600',
    marginBottom: 4,
  },
  coordinateValue: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '800',
    textAlign: 'center',
  },
  addressText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  loadingText: {
    fontSize: 12,
    color: theme.colors.subtitle,
    marginLeft: 8,
    fontStyle: 'italic',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    flexDirection: 'row',
  },
  currentLocationButton: {
    backgroundColor: theme.colors.altBackground,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  currentLocationButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
    marginLeft: 8,
  },
  confirmButton: {
    backgroundColor: theme.colors.primary,
  },
  disabledButton: {
    backgroundColor: theme.colors.border,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  disabledButtonText: {
    color: theme.colors.subtitle,
  },
  disabledText: {
    color: theme.colors.subtitle,
  },
});