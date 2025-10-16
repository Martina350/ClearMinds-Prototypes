import * as Location from 'expo-location';
import { ILocationService, Coordenadas } from '../../domain/services/ILocationService';

/**
 * Implementación del servicio de localización usando Expo Location
 */
export class ExpoLocationService implements ILocationService {
  async obtenerCoordenadas(): Promise<Coordenadas> {
    // Verificar permisos
    const tienePermisos = await this.verificarPermisos();
    if (!tienePermisos) {
      throw new Error('No se tienen permisos de ubicación');
    }

    try {
      // Obtener ubicación actual
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return {
        latitud: location.coords.latitude,
        longitud: location.coords.longitude,
      };
    } catch (error) {
      console.error('Error al obtener coordenadas:', error);
      throw new Error('No se pudo obtener la ubicación');
    }
  }

  async solicitarPermisos(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error al solicitar permisos:', error);
      return false;
    }
  }

  async verificarPermisos(): Promise<boolean> {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error al verificar permisos:', error);
      return false;
    }
  }
}

