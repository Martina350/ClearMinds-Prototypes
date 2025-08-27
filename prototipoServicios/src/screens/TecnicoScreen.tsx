import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView, Modal, Alert } from 'react-native';

type Props = {
  onBack: () => void;
  onCreateReport: () => void;
};

export const TecnicoScreen: React.FC<Props> = ({ onBack, onCreateReport }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [showMenu, setShowMenu] = useState(false);
  const [showMyReports, setShowMyReports] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [taskStatus, setTaskStatus] = useState({
    task1: 'pending', // pending, in-progress, completed
    task2: 'completed',
    task3: 'pending'
  });

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
      case 'home':
        // Ya estamos en la pantalla principal
        break;
      case 'newReport':
        onCreateReport();
        break;
      case 'myReports':
        setShowMyReports(true);
        break;
      case 'calendar':
        setShowCalendar(true);
        break;
      case 'stats':
        setShowStats(true);
        break;
      case 'settings':
        setShowSettings(true);
        break;
      case 'support':
        setShowSupport(true);
        break;
    }
  };

  const handleActionButton = (action: string) => {
    switch (action) {
      case 'createReport':
        onCreateReport();
        break;
      case 'myReports':
        setShowMyReports(true);
        break;
      case 'calendar':
        setShowCalendar(true);
        break;
      case 'stats':
        setShowStats(true);
        break;
    }
  };

  const handleTaskAction = (taskId: string, action: string) => {
    switch (action) {
      case 'start':
        setTaskStatus(prev => ({ ...prev, [taskId]: 'in-progress' }));
        Alert.alert('Tarea iniciada', 'Has comenzado la tarea de mantenimiento');
        break;
      case 'view':
        Alert.alert('Detalles de tarea', 'Mostrando detalles completos de la tarea');
        break;
      case 'pending':
        Alert.alert('Tarea pendiente', 'Esta tarea está programada para más tarde');
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
            <Text style={styles.headerTitleText}>Panel de Técnico</Text>
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
            <Text style={styles.welcomeTitle}>🔧 Bienvenido, Técnico</Text>
            <Text style={styles.welcomeSubtitle}>Gestiona tus tareas de mantenimiento</Text>
          </View>

          <View style={styles.quickActions}>
            <Text style={styles.sectionTitle}>⚡ Acciones Principales</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.primaryAction]} 
                onPress={() => handleActionButton('createReport')}
                activeOpacity={0.8}
              >
                <Text style={styles.actionIcon}>📝</Text>
                <Text style={styles.actionText}>Crear Informe</Text>
                <Text style={styles.actionSubtext}>Nuevo mantenimiento</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => handleActionButton('myReports')}
                activeOpacity={0.8}
              >
                <Text style={styles.actionIcon}>📋</Text>
                <Text style={styles.actionText}>Mis Informes</Text>
                <Text style={styles.actionSubtext}>Ver historial</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => handleActionButton('calendar')}
                activeOpacity={0.8}
              >
                <Text style={styles.actionIcon}>📅</Text>
                <Text style={styles.actionText}>Calendario</Text>
                <Text style={styles.actionSubtext}>Tareas programadas</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => handleActionButton('stats')}
                activeOpacity={0.8}
              >
                <Text style={styles.actionIcon}>📊</Text>
                <Text style={styles.actionText}>Estadísticas</Text>
                <Text style={styles.actionSubtext}>Mi rendimiento</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.todayTasks}>
            <Text style={styles.sectionTitle}>📅 Tareas de Hoy</Text>
            <View style={styles.taskList}>
              <View style={styles.taskItem}>
                <View style={styles.taskStatus}>
                  <Text style={styles.taskStatusIcon}>⏳</Text>
                </View>
                <View style={styles.taskContent}>
                  <Text style={styles.taskTitle}>Mantenimiento A/C - Edificio A</Text>
                  <Text style={styles.taskLocation}>📍 Piso 3, Oficina 305</Text>
                  <Text style={styles.taskTime}>🕐 10:00 AM - 12:00 PM</Text>
                </View>
                <TouchableOpacity 
                  style={styles.taskButton} 
                  onPress={() => handleTaskAction('task1', 'start')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.taskButtonText}>Iniciar</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.taskItem}>
                <View style={styles.taskStatus}>
                  <Text style={styles.taskStatusIcon}>✅</Text>
                </View>
                <View style={styles.taskContent}>
                  <Text style={styles.taskTitle}>Revisión Eléctrica - Sótano</Text>
                  <Text style={styles.taskLocation}>📍 Sótano, Cuarto Eléctrico</Text>
                  <Text style={styles.taskTime}>🕐 2:00 PM - 3:30 PM</Text>
                </View>
                <TouchableOpacity 
                  style={styles.taskButton} 
                  onPress={() => handleTaskAction('task2', 'view')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.taskButtonText}>Ver</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.taskItem}>
                <View style={styles.taskStatus}>
                  <Text style={styles.taskStatusIcon}>📋</Text>
                </View>
                <View style={styles.taskContent}>
                  <Text style={styles.taskTitle}>Limpieza Filtros - HVAC</Text>
                  <Text style={styles.taskLocation}>📍 Azotea, Unidad 2</Text>
                  <Text style={styles.taskTime}>🕐 4:00 PM - 5:00 PM</Text>
                </View>
                <TouchableOpacity 
                  style={styles.taskButton} 
                  onPress={() => handleTaskAction('task3', 'pending')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.taskButtonText}>Pendiente</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.recentReports}>
            <Text style={styles.sectionTitle}>📋 Informes Recientes</Text>
            <View style={styles.reportList}>
              <View style={styles.reportItem}>
                <Text style={styles.reportIcon}>🔧</Text>
                <View style={styles.reportContent}>
                  <Text style={styles.reportTitle}>Mantenimiento Preventivo - Elevador 1</Text>
                  <Text style={styles.reportDate}>Hoy, 9:30 AM</Text>
                  <Text style={styles.reportStatus}>✅ Completado</Text>
                </View>
              </View>
              
              <View style={styles.reportItem}>
                <Text style={styles.reportIcon}>💡</Text>
                <View style={styles.reportContent}>
                  <Text style={styles.reportTitle}>Cambio de Lámparas - Pasillo Principal</Text>
                  <Text style={styles.reportDate}>Ayer, 3:45 PM</Text>
                  <Text style={styles.reportStatus}>✅ Completado</Text>
                </View>
              </View>
              
              <View style={styles.reportItem}>
                <Text style={styles.reportIcon}>🔌</Text>
                <View style={styles.reportContent}>
                  <Text style={styles.reportTitle}>Reparación Enchufe - Oficina 201</Text>
                  <Text style={styles.reportDate}>Hace 2 días, 11:20 AM</Text>
                  <Text style={styles.reportStatus}>✅ Completado</Text>
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
              <Text style={styles.menuTitle}>Menú Técnico</Text>
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
                onPress={() => handleMenuAction('home')}
                activeOpacity={0.7}
              >
                <Text style={styles.menuItemIcon}>🏠</Text>
                <Text style={styles.menuItemText}>Inicio</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => handleMenuAction('newReport')}
                activeOpacity={0.7}
              >
                <Text style={styles.menuItemIcon}>📝</Text>
                <Text style={styles.menuItemText}>Nuevo Informe</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => handleMenuAction('myReports')}
                activeOpacity={0.7}
              >
                <Text style={styles.menuItemIcon}>📋</Text>
                <Text style={styles.menuItemText}>Mis Informes</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => handleMenuAction('calendar')}
                activeOpacity={0.7}
              >
                <Text style={styles.menuItemIcon}>📅</Text>
                <Text style={styles.menuItemText}>Calendario</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => handleMenuAction('stats')}
                activeOpacity={0.7}
              >
                <Text style={styles.menuItemIcon}>📊</Text>
                <Text style={styles.menuItemText}>Estadísticas</Text>
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
              <Text style={styles.menuFooterText}>Técnico Panel v1.0.0</Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Mis Informes */}
      <Modal
        visible={showMyReports}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMyReports(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📋 Mis Informes</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowMyReports(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.reportsSection}>
                <Text style={styles.sectionDescription}>
                  Historial de tus informes de mantenimiento
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
                      <Text style={styles.reportTitle}>Mantenimiento Preventivo - Elevador 1</Text>
                      <Text style={styles.reportDate}>Hoy, 9:30 AM</Text>
                      <Text style={styles.reportStatus}>✅ Completado</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.reportAction}
                      onPress={() => Alert.alert('Informe', 'Mostrando detalles del informe...')}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.reportActionText}>Ver</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.reportItem}>
                    <Text style={styles.reportIcon}>💡</Text>
                    <View style={styles.reportContent}>
                      <Text style={styles.reportTitle}>Cambio de Lámparas - Pasillo Principal</Text>
                      <Text style={styles.reportDate}>Ayer, 3:45 PM</Text>
                      <Text style={styles.reportStatus}>✅ Completado</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.reportAction}
                      onPress={() => Alert.alert('Informe', 'Mostrando detalles del informe...')}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.reportActionText}>Ver</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.reportItem}>
                    <Text style={styles.reportIcon}>🔌</Text>
                    <View style={styles.reportContent}>
                      <Text style={styles.reportTitle}>Reparación Enchufe - Oficina 201</Text>
                      <Text style={styles.reportDate}>Hace 2 días, 11:20 AM</Text>
                      <Text style={styles.reportStatus}>✅ Completado</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.reportAction}
                      onPress={() => Alert.alert('Informe', 'Mostrando detalles del informe...')}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.reportActionText}>Ver</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de Calendario */}
      <Modal
        visible={showCalendar}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📅 Calendario de Tareas</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowCalendar(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.calendarSection}>
                <Text style={styles.sectionDescription}>
                  Tareas programadas para esta semana
                </Text>
                
                <View style={styles.calendarWeek}>
                  <View style={styles.calendarDay}>
                    <Text style={styles.dayHeader}>Lun</Text>
                    <View style={styles.dayTasks}>
                      <View style={styles.calendarTask}>
                        <Text style={styles.calendarTaskIcon}>🔧</Text>
                        <Text style={styles.calendarTaskText}>A/C Edificio A</Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.calendarDay}>
                    <Text style={styles.dayHeader}>Mar</Text>
                    <View style={styles.dayTasks}>
                      <View style={styles.calendarTask}>
                        <Text style={styles.calendarTaskIcon}>💡</Text>
                        <Text style={styles.calendarTaskText}>Lámparas Pasillo</Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.calendarDay}>
                    <Text style={styles.dayHeader}>Mié</Text>
                    <View style={styles.dayTasks}>
                      <View style={styles.calendarTask}>
                        <Text style={styles.calendarTaskIcon}>🔌</Text>
                        <Text style={styles.calendarTaskText}>Enchufe Oficina</Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.calendarDay}>
                    <Text style={styles.dayHeader}>Jue</Text>
                    <View style={styles.dayTasks}>
                      <View style={styles.calendarTask}>
                        <Text style={styles.calendarTaskIcon}>🌡️</Text>
                        <Text style={styles.calendarTaskText}>HVAC Filtros</Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.calendarDay}>
                    <Text style={styles.dayHeader}>Vie</Text>
                    <View style={styles.dayTasks}>
                      <Text style={styles.noTasks}>Sin tareas</Text>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de Estadísticas */}
      <Modal
        visible={showStats}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowStats(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📊 Mis Estadísticas</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowStats(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.statsSection}>
                <Text style={styles.sectionDescription}>
                  Tu rendimiento y métricas personales
                </Text>
                
                <View style={styles.statsGrid}>
                  <View style={styles.statCard}>
                    <Text style={styles.statIcon}>📋</Text>
                    <Text style={styles.statNumber}>45</Text>
                    <Text style={styles.statLabel}>Informes este mes</Text>
                  </View>
                  
                  <View style={styles.statCard}>
                    <Text style={styles.statIcon}>⏱️</Text>
                    <Text style={styles.statNumber}>2.1h</Text>
                    <Text style={styles.statLabel}>Tiempo promedio</Text>
                  </View>
                  
                  <View style={styles.statCard}>
                    <Text style={styles.statIcon}>⭐</Text>
                    <Text style={styles.statNumber}>4.9</Text>
                    <Text style={styles.statLabel}>Calificación</Text>
                  </View>
                  
                  <View style={styles.statCard}>
                    <Text style={styles.statIcon}>🎯</Text>
                    <Text style={styles.statNumber}>98%</Text>
                    <Text style={styles.statLabel}>Cumplimiento</Text>
                  </View>
                </View>
                
                <View style={styles.performanceChart}>
                  <Text style={styles.chartTitle}>📈 Rendimiento Semanal</Text>
                  <View style={styles.chartBars}>
                    <View style={styles.chartBar}>
                      <View style={[styles.barFill, { height: 60 }]} />
                      <Text style={styles.barLabel}>Lun</Text>
                    </View>
                    <View style={styles.chartBar}>
                      <View style={[styles.barFill, { height: 80 }]} />
                      <Text style={styles.barLabel}>Mar</Text>
                    </View>
                    <View style={styles.chartBar}>
                      <View style={[styles.barFill, { height: 45 }]} />
                      <Text style={styles.barLabel}>Mié</Text>
                    </View>
                    <View style={styles.chartBar}>
                      <View style={[styles.barFill, { height: 90 }]} />
                      <Text style={styles.barLabel}>Jue</Text>
                    </View>
                    <View style={styles.chartBar}>
                      <View style={[styles.barFill, { height: 70 }]} />
                      <Text style={styles.barLabel}>Vie</Text>
                    </View>
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
              <Text style={styles.modalTitle}>⚙️ Configuración Personal</Text>
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
                  Personaliza tu experiencia de trabajo
                </Text>
                
                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingTitle}>🔔 Notificaciones de tareas</Text>
                    <Text style={styles.settingSubtitle}>Alertas de nuevas asignaciones</Text>
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
                    <Text style={styles.settingTitle}>📱 Calidad de fotos</Text>
                    <Text style={styles.settingSubtitle}>Alta calidad en informes</Text>
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
                    <Text style={styles.settingTitle}>🌙 Modo oscuro</Text>
                    <Text style={styles.settingSubtitle}>Tema oscuro para la app</Text>
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
                    <Text style={styles.settingTitle}>🔄 Sincronización automática</Text>
                    <Text style={styles.settingSubtitle}>Guardar datos automáticamente</Text>
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
              <Text style={styles.modalTitle}>📞 Soporte Técnico</Text>
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
                  ¿Necesitas ayuda? Contacta al soporte técnico
                </Text>
                
                <View style={styles.contactMethods}>
                  <TouchableOpacity 
                    style={styles.contactMethod}
                    onPress={() => Alert.alert('Soporte', 'Conectando con soporte técnico...')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.contactIcon}>📞</Text>
                    <Text style={styles.contactTitle}>Llamar al soporte</Text>
                    <Text style={styles.contactSubtitle}>+1 (555) 123-4567</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.contactMethod}
                    onPress={() => Alert.alert('Soporte', 'Abriendo chat en vivo...')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.contactIcon}>💬</Text>
                    <Text style={styles.contactTitle}>Chat en vivo</Text>
                    <Text style={styles.contactSubtitle}>Disponible 24/7</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.contactMethod}
                    onPress={() => Alert.alert('Soporte', 'Abriendo manual de usuario...')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.contactIcon}>📚</Text>
                    <Text style={styles.contactTitle}>Manual de usuario</Text>
                    <Text style={styles.contactSubtitle}>Guías y tutoriales</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.faqSection}>
                  <Text style={styles.faqTitle}>❓ Preguntas Frecuentes</Text>
                  <TouchableOpacity style={styles.faqItem} activeOpacity={0.7}>
                    <Text style={styles.faqQuestion}>¿Cómo subo fotos en los informes?</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.faqItem} activeOpacity={0.7}>
                    <Text style={styles.faqQuestion}>¿Cómo cambio mi contraseña?</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.faqItem} activeOpacity={0.7}>
                    <Text style={styles.faqQuestion}>¿Cómo veo mi historial de tareas?</Text>
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
  quickActions: {
    marginBottom: 30,
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  primaryAction: {
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#495057',
    marginBottom: 4,
  },
  actionSubtext: {
    fontSize: 12,
    color: '#6C757D',
  },
  todayTasks: {
    marginBottom: 30,
  },
  taskList: {
    gap: 12,
  },
  taskItem: {
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
  taskStatus: {
    marginRight: 12,
  },
  taskStatusIcon: {
    fontSize: 20,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#495057',
    marginBottom: 4,
  },
  taskLocation: {
    fontSize: 12,
    color: '#6C757D',
    marginBottom: 2,
  },
  taskTime: {
    fontSize: 12,
    color: '#6C757D',
  },
  taskButton: {
    backgroundColor: '#28A745',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  taskButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  recentReports: {
    marginBottom: 20,
  },
  reportList: {
    gap: 12,
  },
  reportItem: {
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
  reportIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  reportContent: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 4,
  },
  reportDate: {
    fontSize: 12,
    color: '#6C757D',
    marginBottom: 2,
  },
  reportStatus: {
    fontSize: 12,
    color: '#28A745',
    fontWeight: '600',
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
  // Estilos para Mis Informes
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
  reportDate: {
    fontSize: 12,
    color: '#6C757D',
    marginBottom: 2,
  },
  reportStatus: {
    fontSize: 12,
    color: '#28A745',
    fontWeight: '600',
  },
  reportAction: {
    backgroundColor: '#007BFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  reportActionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  // Estilos para Calendario
  calendarSection: {
    gap: 20,
  },
  calendarWeek: {
    gap: 12,
  },
  calendarDay: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  dayHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#495057',
    marginBottom: 12,
    textAlign: 'center',
  },
  dayTasks: {
    gap: 8,
  },
  calendarTask: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
  },
  calendarTaskIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  calendarTaskText: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '600',
  },
  noTasks: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  // Estilos para Estadísticas
  statsSection: {
    gap: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
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
  performanceChart: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#495057',
    marginBottom: 16,
    textAlign: 'center',
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 100,
  },
  chartBar: {
    alignItems: 'center',
  },
  barFill: {
    width: 20,
    backgroundColor: '#007BFF',
    borderRadius: 10,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 12,
    color: '#6C757D',
    fontWeight: '600',
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
});
