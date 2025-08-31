import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, ScrollView, Modal, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

type Props = {
  onSelectRole: (role: 'admin' | 'tecnico') => void;
};

export const RoleSelectionScreen: React.FC<Props> = ({ onSelectRole }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [showMenu, setShowMenu] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRoleSelect = (role: 'admin' | 'tecnico') => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onSelectRole(role);
    });
  };

  const handleMenuAction = (action: string) => {
    setShowMenu(false);
    
    switch (action) {
      case 'home':
        // Ya estamos en la pantalla principal
        break;
      case 'settings':
        setShowSettings(true);
        break;
      case 'support':
        setShowSupport(true);
        break;
      case 'about':
        setShowAbout(true);
        break;
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          { 
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        {/* Header con botón hamburguesa */}
        <View style={styles.topHeader}>
          <TouchableOpacity 
            style={styles.hamburgerButton}
            onPress={() => setShowMenu(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="menu-outline" size={28} color="#374151" />
          </TouchableOpacity>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          <View style={styles.header}>
            <Image 
              source={require('../widgets/logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.subtitle}>Sistema de Mantenimiento</Text>
          </View>

          <View style={styles.selectionContainer}>
            <Text style={styles.selectionTitle}>Selecciona tu rol</Text>
            <Text style={styles.selectionSubtitle}>¿Cómo vas a usar la aplicación hoy?</Text>
            
            <View style={styles.roleCards}>
              <TouchableOpacity 
                style={styles.roleCard}
                onPress={() => handleRoleSelect('admin')}
                activeOpacity={0.8}
              >
                <View style={styles.roleIconContainer}>
                  <Ionicons name="briefcase-outline" size={48} color="#6366F1" />
                </View>
                <Text style={styles.roleTitle}>Administrador</Text>
                <View style={styles.roleFeatures}>
                  <Text style={styles.feature}>Gestión de usuarios</Text>
                  <Text style={styles.feature}>Revisión de informes</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.roleCard}
                onPress={() => handleRoleSelect('tecnico')}
                activeOpacity={0.8}
              >
                <View style={styles.roleIconContainer}>
                  <Ionicons name="construct-outline" size={48} color="#10B981" />
                </View>
                <Text style={styles.roleTitle}>Técnico</Text>
                <View style={styles.roleFeatures}>
                  <Text style={styles.feature}>Captura de fotos</Text>
                  <Text style={styles.feature}>Informes detallados</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Versión 1.0.0</Text>
          </View>
        </ScrollView>
      </Animated.View>

      {/* Modal del menú hamburguesa */}
      <Modal
        visible={showMenu}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMenu(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Menú</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowMenu(false)}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.menuItems}>
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => handleMenuAction('home')}
                activeOpacity={0.7}
              >
                <Ionicons name="home-outline" size={20} color="#495057" style={{ marginRight: 16 }} />
                <Text style={styles.menuItemText}>Inicio</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => handleMenuAction('settings')}
                activeOpacity={0.7}
              >
                <Ionicons name="settings-outline" size={20} color="#495057" style={{ marginRight: 16 }} />
                <Text style={styles.menuItemText}>Configuración</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => handleMenuAction('support')}
                activeOpacity={0.7}
              >
                <Ionicons name="call-outline" size={20} color="#495057" style={{ marginRight: 16 }} />
                <Text style={styles.menuItemText}>Soporte</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => handleMenuAction('about')}
                activeOpacity={0.7}
              >
                <Ionicons name="information-circle-outline" size={20} color="#495057" style={{ marginRight: 16 }} />
                <Text style={styles.menuItemText}>Acerca de</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.menuFooter}>
              <Text style={styles.menuFooterText}>ClearMinds v1.0.0</Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Acerca de */}
      <Modal
        visible={showAbout}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAbout(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="information-circle-outline" size={20} color="#212529" style={{ marginRight: 8 }} />
                <Text style={styles.modalTitle}>Acerca de ClearMinds</Text>
              </View>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowAbout(false)}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.aboutSection}>
                <Text style={styles.aboutTitle}>ClearMinds</Text>
                <Text style={styles.aboutSubtitle}>Sistema de Mantenimiento Inteligente</Text>
                
                <View style={styles.aboutInfo}>
                  <Text style={styles.aboutLabel}>Versión:</Text>
                  <Text style={styles.aboutValue}>1.0.0</Text>
                </View>
                
                <View style={styles.aboutInfo}>
                  <Text style={styles.aboutLabel}>Desarrollado por:</Text>
                  <Text style={styles.aboutValue}>Equipo ClearMinds</Text>
                </View>
                
                <View style={styles.aboutInfo}>
                  <Text style={styles.aboutLabel}>Contacto:</Text>
                  <Text style={styles.aboutValue}>info@clearminds.com</Text>
                </View>
                
                <Text style={styles.aboutDescription}>
                  ClearMinds es una plataforma integral diseñada para optimizar la gestión de mantenimiento 
                  en edificios y instalaciones. Nuestra solución combina tecnología avanzada con una 
                  interfaz intuitiva para maximizar la eficiencia operativa.
                </Text>
                
                <View style={styles.featureList}>
                  <Text style={styles.featureItem}>Gestión de usuarios y roles</Text>
                  <Text style={styles.featureItem}>Informes detallados con fotos</Text>
                  <Text style={styles.featureItem}>Dashboard en tiempo real</Text>
                  <Text style={styles.featureItem}>Notificaciones automáticas</Text>
                  <Text style={styles.featureItem}>Historial completo de actividades</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de Soporte */}
      <Modal
        visible={showSupport}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSupport(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="call-outline" size={20} color="#212529" style={{ marginRight: 8 }} />
                <Text style={styles.modalTitle}>Soporte Técnico</Text>
              </View>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowSupport(false)}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.supportSection}>
                <Text style={styles.supportDescription}>
                  ¿Necesitas ayuda? Nuestro equipo de soporte está disponible para asistirte.
                </Text>
                
                <View style={styles.contactMethods}>
                  <TouchableOpacity 
                    style={styles.contactMethod}
                    onPress={() => Alert.alert('Llamada', 'Iniciando llamada al soporte...')}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="call-outline" size={22} color="#495057" style={{ marginBottom: 8 }} />
                    <Text style={styles.contactTitle}>Llamar al soporte</Text>
                    <Text style={styles.contactSubtitle}>+1 (555) 123-4567</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.contactMethod}
                    onPress={() => Alert.alert('Email', 'Abriendo cliente de email...')}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="mail-outline" size={22} color="#495057" style={{ marginBottom: 8 }} />
                    <Text style={styles.contactTitle}>Enviar email</Text>
                    <Text style={styles.contactSubtitle}>soporte@clearminds.com</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.contactMethod}
                    onPress={() => Alert.alert('Chat', 'Iniciando chat en vivo...')}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="chatbubble-ellipses-outline" size={22} color="#495057" style={{ marginBottom: 8 }} />
                    <Text style={styles.contactTitle}>Chat en vivo</Text>
                    <Text style={styles.contactSubtitle}>Disponible 24/7</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.faqSection}>
                  <Text style={styles.faqTitle}>Preguntas Frecuentes</Text>
                  <TouchableOpacity style={styles.faqItem} activeOpacity={0.7}>
                    <Text style={styles.faqQuestion}>¿Cómo cambio mi contraseña?</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.faqItem} activeOpacity={0.7}>
                    <Text style={styles.faqQuestion}>¿Cómo subo fotos en los informes?</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.faqItem} activeOpacity={0.7}>
                    <Text style={styles.faqQuestion}>¿Cómo veo mi historial de informes?</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de Configuración */}
      <Modal
        visible={showSettings}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSettings(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="settings-outline" size={20} color="#212529" style={{ marginRight: 8 }} />
                <Text style={styles.modalTitle}>Configuración</Text>
              </View>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowSettings(false)}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.settingsSection}>
                <Text style={styles.settingsDescription}>
                  Personaliza tu experiencia en ClearMinds
                </Text>
                
                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <View style={styles.settingTitleContainer}>
                      <Ionicons name="notifications-outline" size={20} color="#FFD700" style={{ marginRight: 8 }} />
                      <Text style={styles.settingTitle}>Notificaciones</Text>
                    </View>
                    <Text style={styles.settingSubtitle}>Recibir alertas de nuevas tareas</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.toggleButton}
                    onPress={() => Alert.alert('Configuración', 'Notificaciones activadas')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.toggleText}>ON</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <View style={styles.settingTitleContainer}>
                      <Ionicons name="moon-outline" size={20} color="#FFD700" style={{ marginRight: 8 }} />
                      <Text style={styles.settingTitle}>Modo oscuro</Text>
                    </View>
                    <Text style={styles.settingSubtitle}>Cambiar tema de la aplicación</Text>
                  </View>
                  <TouchableOpacity 
                    style={[styles.toggleButton, styles.toggleOff]}
                    onPress={() => Alert.alert('Configuración', 'Modo oscuro desactivado')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.toggleTextOff}>OFF</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <View style={styles.settingTitleContainer}>
                      <Ionicons name="camera-outline" size={20} color="#000000" style={{ marginRight: 8 }} />
                      <Text style={styles.settingTitle}>Calidad de fotos</Text>
                    </View>
                    <Text style={styles.settingSubtitle}>Alta calidad (más espacio)</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.toggleButton}
                    onPress={() => Alert.alert('Configuración', 'Calidad alta activada')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.toggleText}>ON</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <View style={styles.settingTitleContainer}>
                      <Ionicons name="sync-outline" size={20} color="#007BFF" style={{ marginRight: 8 }} />
                      <Text style={styles.settingTitle}>Sincronización automática</Text>
                    </View>
                    <Text style={styles.settingSubtitle}>Sincronizar datos en segundo plano</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.toggleButton}
                    onPress={() => Alert.alert('Configuración', 'Sincronización activada')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.toggleText}>ON</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 32,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 32,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#212529',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#64748B',
    fontWeight: '500',
  },
  selectionContainer: {
    paddingHorizontal: 20,
    marginVertical: 32,
  },
  selectionTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 12,
  },
  selectionSubtitle: {
    fontSize: 18,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 24,
  },
  roleCards: {
    gap: 24,
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  roleIconContainer: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 20,
    width: 80,
    height: 80,
    justifyContent: 'center',
  },
  roleIcon: {
    fontSize: 48,
  },
  roleTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 16,
  },
  roleDescription: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  roleFeatures: {
    gap: 12,
  },
  feature: {
    fontSize: 15,
    color: '#475569',
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
  // Estilos del botón hamburguesa
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  hamburgerButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  hamburgerLine: {
    width: 24,
    height: 3,
    backgroundColor: '#495057',
    marginVertical: 2,
    borderRadius: 2,
  },
  headerSpacer: {
    width: 40,
  },
  // Estilos del modal del menú
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '80%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    backgroundColor: '#F8F9FA',
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212529',
  },
  closeButton: {
    backgroundColor: '#6C757D',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuItems: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  menuItemIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
  },
  menuFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    backgroundColor: '#F8F9FA',
  },
  menuFooterText: {
    fontSize: 12,
    color: '#6C757D',
    textAlign: 'center',
    fontWeight: '500',
  },
  // Estilos para los modales adicionales
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
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
  // Estilos para Acerca de
  aboutSection: {
    gap: 16,
  },
  aboutTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#212529',
    textAlign: 'center',
  },
  aboutSubtitle: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    marginBottom: 16,
  },
  aboutInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  aboutLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
  },
  aboutValue: {
    fontSize: 14,
    color: '#6C757D',
  },
  aboutDescription: {
    fontSize: 14,
    color: '#6C757D',
    lineHeight: 20,
    marginTop: 16,
  },
  featureList: {
    marginTop: 16,
    gap: 8,
  },
  featureItem: {
    fontSize: 14,
    color: '#495057',
  },
  // Estilos para Soporte
  supportSection: {
    gap: 20,
  },
  supportDescription: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 22,
  },
  contactMethods: {
    gap: 12,
  },
  contactMethod: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  contactIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#495057',
    marginBottom: 4,
  },
  contactSubtitle: {
    fontSize: 14,
    color: '#6C757D',
  },
  faqSection: {
    marginTop: 20,
  },
  faqTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 12,
  },
  faqItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  faqQuestion: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '600',
  },
  // Estilos para Configuración
  settingsSection: {
    gap: 16,
  },
  settingsDescription: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#495057',
    marginBottom: 4,
  },
  settingTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6C757D',
  },
  toggleButton: {
    backgroundColor: '#28A745',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  toggleOff: {
    backgroundColor: '#6C757D',
  },
  toggleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  toggleTextOff: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
});
