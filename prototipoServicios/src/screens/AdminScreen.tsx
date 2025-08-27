import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView, Modal, Alert } from 'react-native';

type Props = {
  onBack: () => void;
};

export const AdminScreen: React.FC<Props> = ({ onBack }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [showMenu, setShowMenu] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleMenuAction = (action: string) => {
    setShowMenu(false);
    
    switch (action) {
      case 'dashboard':
        // Ya estamos en el dashboard
        break;
      case 'users':
        setShowUserManagement(true);
        break;
      case 'reports':
        setShowReports(true);
        break;
      case 'analytics':
        setShowAnalytics(true);
        break;
      case 'settings':
        setShowSettings(true);
        break;
      case 'support':
        setShowSupport(true);
        break;
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'users':
        setShowUserManagement(true);
        break;
      case 'reports':
        setShowReports(true);
        break;
      case 'analytics':
        setShowAnalytics(true);
        break;
      case 'settings':
        setShowSettings(true);
        break;
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          { opacity: fadeAnim }
        ]}
      >
        {/* Header con botón hamburguesa */}
        <View style={styles.topHeader}>
          <TouchableOpacity 
            style={styles.hamburgerButton}
            onPress={() => setShowMenu(true)}
            activeOpacity={0.8}
          >
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <Text style={styles.headerTitleText}>Panel de Administración</Text>
          </View>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>Salir</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>👨‍💼 Bienvenido, Administrador</Text>
            <Text style={styles.welcomeSubtitle}>Gestiona tu sistema de mantenimiento</Text>
          </View>

          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>📊 Estadísticas Generales</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>24</Text>
                <Text style={styles.statLabel}>Técnicos Activos</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>156</Text>
                <Text style={styles.statLabel}>Informes Este Mes</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>89%</Text>
                <Text style={styles.statLabel}>Satisfacción</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Pendientes</Text>
              </View>
            </View>
          </View>

          <View style={styles.actionsContainer}>
            <Text style={styles.sectionTitle}>⚡ Acciones Rápidas</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => handleQuickAction('users')}
                activeOpacity={0.8}
              >
                <Text style={styles.actionIcon}>👥</Text>
                <Text style={styles.actionText}>Gestionar Usuarios</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => handleQuickAction('reports')}
                activeOpacity={0.8}
              >
                <Text style={styles.actionIcon}>📋</Text>
                <Text style={styles.actionText}>Revisar Informes</Text>
              </TouchableOpacity>
              
              
              
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => handleQuickAction('settings')}
                activeOpacity={0.8}
              >
                <Text style={styles.actionIcon}>⚙️</Text>
                <Text style={styles.actionText}>Configuración</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.recentActivity}>
            <Text style={styles.sectionTitle}>🕐 Actividad Reciente</Text>
            <View style={styles.activityList}>
              <View style={styles.activityItem}>
                <Text style={styles.activityIcon}>✅</Text>
                <View style={styles.activityContent}>
                  <Text style={styles.activityText}>Informe completado por Juan Pérez</Text>
                  <Text style={styles.activityTime}>Hace 5 minutos</Text>
                </View>
              </View>
              
              <View style={styles.activityItem}>
                <Text style={styles.activityIcon}>👤</Text>
                <View style={styles.activityContent}>
                  <Text style={styles.activityText}>Nuevo técnico registrado</Text>
                  <Text style={styles.activityTime}>Hace 1 hora</Text>
                </View>
              </View>
              
              <View style={styles.activityItem}>
                <Text style={styles.activityIcon}>📊</Text>
                <View style={styles.activityContent}>
                  <Text style={styles.activityText}>Reporte mensual generado</Text>
                  <Text style={styles.activityTime}>Hace 2 horas</Text>
                </View>
              </View>
            </View>
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
              <Text style={styles.menuTitle}>Menú Admin</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowMenu(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.menuItems}>
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => handleMenuAction('dashboard')}
                activeOpacity={0.7}
              >
                <Text style={styles.menuItemIcon}>🏠</Text>
                <Text style={styles.menuItemText}>Dashboard</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => handleMenuAction('users')}
                activeOpacity={0.7}
              >
                <Text style={styles.menuItemIcon}>👥</Text>
                <Text style={styles.menuItemText}>Usuarios</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => handleMenuAction('reports')}
                activeOpacity={0.7}
              >
                <Text style={styles.menuItemIcon}>📋</Text>
                <Text style={styles.menuItemText}>Informes</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => handleMenuAction('analytics')}
                activeOpacity={0.7}
              >
                <Text style={styles.menuItemIcon}>📈</Text>
                <Text style={styles.menuItemText}>Reportes</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => handleMenuAction('settings')}
                activeOpacity={0.7}
              >
                <Text style={styles.menuItemIcon}>⚙️</Text>
                <Text style={styles.menuItemText}>Configuración</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => handleMenuAction('support')}
                activeOpacity={0.7}
              >
                <Text style={styles.menuItemIcon}>📞</Text>
                <Text style={styles.menuItemText}>Soporte</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.menuFooter}>
              <Text style={styles.menuFooterText}>Admin Panel v1.0.0</Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Gestión de Usuarios */}
      <Modal
        visible={showUserManagement}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowUserManagement(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>👥 Gestión de Usuarios</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowUserManagement(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.userSection}>
                <Text style={styles.sectionDescription}>
                  Administra los usuarios del sistema
                </Text>
                
                <View style={styles.userStats}>
                  <View style={styles.userStat}>
                    <Text style={styles.userStatNumber}>24</Text>
                    <Text style={styles.userStatLabel}>Técnicos</Text>
                  </View>
                  <View style={styles.userStat}>
                    <Text style={styles.userStatNumber}>3</Text>
                    <Text style={styles.userStatLabel}>Administradores</Text>
                  </View>
                  <View style={styles.userStat}>
                    <Text style={styles.userStatNumber}>5</Text>
                    <Text style={styles.userStatLabel}>Pendientes</Text>
                  </View>
                </View>
                
                <View style={styles.userActions}>
                  <TouchableOpacity 
                    style={styles.userAction}
                    onPress={() => Alert.alert('Usuarios', 'Agregando nuevo usuario...')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.userActionIcon}>➕</Text>
                    <Text style={styles.userActionText}>Agregar Usuario</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.userAction}
                    onPress={() => Alert.alert('Usuarios', 'Mostrando lista de usuarios...')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.userActionIcon}>📋</Text>
                    <Text style={styles.userActionText}>Ver Lista</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.userAction}
                    onPress={() => Alert.alert('Usuarios', 'Mostrando permisos...')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.userActionIcon}>🔐</Text>
                    <Text style={styles.userActionText}>Permisos</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de Informes */}
      <Modal
        visible={showReports}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowReports(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📋 Gestión de Informes</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowReports(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.reportsSection}>
                <Text style={styles.sectionDescription}>
                  Revisa y gestiona los informes de mantenimiento
                </Text>
                
                <View style={styles.reportFilters}>
                  <TouchableOpacity style={styles.filterButton} activeOpacity={0.8}>
                    <Text style={styles.filterText}>📅 Hoy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.filterButton} activeOpacity={0.8}>
                    <Text style={styles.filterText}>📅 Esta semana</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.filterButton} activeOpacity={0.8}>
                    <Text style={styles.filterText}>📅 Este mes</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.reportList}>
                  <View style={styles.reportItem}>
                    <Text style={styles.reportIcon}>🔧</Text>
                    <View style={styles.reportContent}>
                      <Text style={styles.reportTitle}>Mantenimiento A/C - Edificio A</Text>
                      <Text style={styles.reportAuthor}>Por: Juan Pérez</Text>
                      <Text style={styles.reportDate}>Hoy, 10:30 AM</Text>
                    </View>
                    <TouchableOpacity style={styles.reportStatus}>
                      <Text style={styles.reportStatusText}>✅</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.reportItem}>
                    <Text style={styles.reportIcon}>💡</Text>
                    <View style={styles.reportContent}>
                      <Text style={styles.reportTitle}>Cambio de Lámparas - Pasillo</Text>
                      <Text style={styles.reportAuthor}>Por: María García</Text>
                      <Text style={styles.reportDate}>Ayer, 3:45 PM</Text>
                    </View>
                    <TouchableOpacity style={styles.reportStatus}>
                      <Text style={styles.reportStatusText}>✅</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.reportItem}>
                    <Text style={styles.reportIcon}>🔌</Text>
                    <View style={styles.reportContent}>
                      <Text style={styles.reportTitle}>Reparación Eléctrica - Oficina 201</Text>
                      <Text style={styles.reportAuthor}>Por: Carlos López</Text>
                      <Text style={styles.reportDate}>Hace 2 días</Text>
                    </View>
                    <TouchableOpacity style={styles.reportStatus}>
                      <Text style={styles.reportStatusText}>⏳</Text>
                    </TouchableOpacity>
                  </View>
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
              <Text style={styles.modalTitle}>⚙️ Configuración del Sistema</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowSettings(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.settingsSection}>
                <Text style={styles.sectionDescription}>
                  Configura los parámetros del sistema
                </Text>
                
                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingTitle}>🔔 Notificaciones automáticas</Text>
                    <Text style={styles.settingSubtitle}>Alertas para informes pendientes</Text>
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
                    <Text style={styles.settingTitle}>📧 Reportes automáticos</Text>
                    <Text style={styles.settingSubtitle}>Envío semanal de reportes</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.toggleButton}
                    onPress={() => Alert.alert('Configuración', 'Reportes automáticos activados')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.toggleText}>ON</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingTitle}>🔒 Modo de seguridad</Text>
                    <Text style={styles.settingSubtitle}>Autenticación de dos factores</Text>
                  </View>
                  <TouchableOpacity 
                    style={[styles.toggleButton, styles.toggleOff]}
                    onPress={() => Alert.alert('Configuración', 'Modo de seguridad desactivado')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.toggleTextOff}>OFF</Text>
                  </TouchableOpacity>
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
              <Text style={styles.modalTitle}>📞 Soporte Administrativo</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowSupport(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.supportSection}>
                <Text style={styles.sectionDescription}>
                  Soporte especializado para administradores
                </Text>
                
                <View style={styles.contactMethods}>
                  <TouchableOpacity 
                    style={styles.contactMethod}
                    onPress={() => Alert.alert('Soporte', 'Conectando con soporte premium...')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.contactIcon}>👨‍💼</Text>
                    <Text style={styles.contactTitle}>Soporte Premium</Text>
                    <Text style={styles.contactSubtitle}>Línea directa 24/7</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.contactMethod}
                    onPress={() => Alert.alert('Soporte', 'Abriendo documentación...')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.contactIcon}>📚</Text>
                    <Text style={styles.contactTitle}>Documentación</Text>
                    <Text style={styles.contactSubtitle}>Guías y manuales</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.contactMethod}
                    onPress={() => Alert.alert('Soporte', 'Programando capacitación...')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.contactIcon}>🎓</Text>
                    <Text style={styles.contactTitle}>Capacitación</Text>
                    <Text style={styles.contactSubtitle}>Sesiones de entrenamiento</Text>
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
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
  },
  // Header con botón hamburguesa
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hamburgerButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  hamburgerLine: {
    width: 24,
    height: 3,
    backgroundColor: '#495057',
    marginVertical: 2,
    borderRadius: 2,
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
  },
  backButton: {
    backgroundColor: '#DC3545',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  backButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 16,
  },
  statsContainer: {
    marginBottom: 30,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#007BFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6C757D',
    fontWeight: '600',
    textAlign: 'center',
  },
  actionsContainer: {
    marginBottom: 30,
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
  },
  recentActivity: {
    marginBottom: 20,
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  activityIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#6C757D',
  },
  // Estilos del modal del menú
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
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
  sectionDescription: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  // Estilos para Gestión de Usuarios
  userSection: {
    gap: 20,
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  userStat: {
    alignItems: 'center',
  },
  userStatNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#007BFF',
  },
  userStatLabel: {
    fontSize: 12,
    color: '#6C757D',
    fontWeight: '600',
  },
  userActions: {
    gap: 12,
  },
  userAction: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  userActionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  userActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
  },
  // Estilos para Informes
  reportsSection: {
    gap: 20,
  },
  reportFilters: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2196F3',
  },
  reportList: {
    gap: 12,
  },
  reportItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  reportIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  reportContent: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#495057',
    marginBottom: 4,
  },
  reportAuthor: {
    fontSize: 12,
    color: '#6C757D',
    marginBottom: 2,
  },
  reportDate: {
    fontSize: 12,
    color: '#6C757D',
  },
  reportStatus: {
    backgroundColor: '#28A745',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportStatusText: {
    fontSize: 12,
    color: 'white',
  },
  // Estilos para Analytics
  analyticsSection: {
    gap: 20,
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  analyticsCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  analyticsIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  analyticsNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#007BFF',
    marginBottom: 4,
  },
  analyticsLabel: {
    fontSize: 12,
    color: '#6C757D',
    fontWeight: '600',
    textAlign: 'center',
  },
  analyticsActions: {
    gap: 12,
  },
  analyticsAction: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  analyticsActionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  analyticsActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
  },
  // Estilos para Configuración
  settingsSection: {
    gap: 16,
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
  // Estilos para Soporte
  supportSection: {
    gap: 20,
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
});
