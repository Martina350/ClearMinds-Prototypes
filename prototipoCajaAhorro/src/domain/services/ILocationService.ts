/**
 * Interfaz del servicio de localización GPS
 * La implementación concreta estará en la capa de infraestructura
 */
export interface Coordenadas {
  latitud: number;
  longitud: number;
}

export interface ILocationService {
  /**
   * Obtiene las coordenadas GPS actuales del dispositivo
   */
  obtenerCoordenadas(): Promise<Coordenadas>;

  /**
   * Solicita permisos de ubicación al usuario
   */
  solicitarPermisos(): Promise<boolean>;

  /**
   * Verifica si los permisos de ubicación están otorgados
   */
  verificarPermisos(): Promise<boolean>;
}

