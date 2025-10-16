import { Agente } from '../entities/Agente';

/**
 * Interfaz del servicio de autenticación
 */
export interface CredencialesLogin {
  usuario: string;
  password: string;
}

export interface IAuthService {
  /**
   * Autentica a un agente con sus credenciales
   */
  login(credenciales: CredencialesLogin): Promise<Agente>;

  /**
   * Cierra la sesión del agente actual
   */
  logout(): Promise<void>;

  /**
   * Obtiene el agente actualmente autenticado
   */
  obtenerAgenteActual(): Promise<Agente | null>;

  /**
   * Verifica si hay una sesión activa
   */
  verificarSesion(): Promise<boolean>;
}

