import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView, Modal, Alert, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ReportService, { Report } from '../services/ReportService';
import { ReportDetailScreen } from './ReportDetailScreen';
import { colors, typography, spacing, borderRadius, shadows, baseStyles, componentStyles } from '../styles/theme';

type Props = {
  onBack: () => void;
};

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export const AdminScreen: React.FC<Props> = ({ onBack }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [showMenu, setShowMenu] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  
  // Estados para gestión de informes
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showReportDetail, setShowReportDetail] = useState(false);
  const [reportsFilter, setReportsFilter] = useState<'all' | 'pending' | 'in_review' | 'approved' | 'rejected'>('all');
  
  // Estados para gestión de usuarios
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'Juan Pérez', email: 'juan.perez@empresa.com', role: 'Técnico' },
    { id: 2, name: 'María García', email: 'maria.garcia@empresa.com', role: 'Administrador' },
    { id: 3, name: 'Carlos López', email: 'carlos.lopez@empresa.com', role: 'Técnico' },
  ]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // Estados para el formulario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Técnico'
  });

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Cargar informes y suscribirse a cambios
  useEffect(() => {
    const loadReports = async () => {
      const reportService = ReportService.getInstance();
      const allReports = await reportService.getAllReports();
      setReports(allReports);
    };

    loadReports();

    // Suscribirse a cambios en los informes
    const reportService = ReportService.getInstance();
    const unsubscribe = reportService.subscribe((updatedReports) => {
      setReports(updatedReports);
    });

    return unsubscribe;
  }, []);

  // Filtrar informes según el filtro seleccionado
  const filteredReports = reports.filter(report => {
    if (reportsFilter === 'all') return true;
    return report.status === reportsFilter;
  });

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

  // Funciones para gestión de usuarios
  const handleAddUser = () => {
    setShowUserManagement(false); // Cerrar el modal de gestión
    setShowAddUser(true);
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'Técnico' });
  };

  const handleViewUserList = () => {
    setShowUserManagement(false); // Cerrar el modal de gestión
    setShowUserList(true);
  };

  const handleSaveUser = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (editingUser) {
      // Editar usuario existente
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...formData }
          : user
      ));
    } else {
      // Agregar nuevo usuario
      const newUser = {
        id: Date.now(),
        ...formData
      };
      setUsers([...users, newUser]);
    }

    setShowAddUser(false);
    setShowUserManagement(true); // Volver al modal de gestión
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'Técnico' });
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role
    });
    setShowAddUser(true);
  };

  const handleDeleteUser = (userId: number) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar este usuario?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => {
            setUsers(users.filter(user => user.id !== userId));
          }
        }
      ]
    );
  };

  const getUsersByRole = (role: string) => {
    return users.filter(user => user.role === role).length;
  };

  // Funciones para gestión de informes
  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setShowReportDetail(true);
  };

  const handleUpdateReportStatus = async (reportId: string, newStatus: Report['status']) => {
    try {
      const reportService = ReportService.getInstance();
      await reportService.updateReportStatus(reportId, newStatus);
      Alert.alert('Éxito', 'Estado del informe actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      Alert.alert('Error', 'No se pudo actualizar el estado del informe');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'pending': return '#FFA500';
      case 'in_review': return '#007BFF';
      case 'approved': return '#28A745';
      case 'rejected': return '#DC3545';
      default: return '#6C757D';
    }
  };

  const getStatusText = (status: Report['status']) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'in_review': return 'En Revisión';
      case 'approved': return 'Aprobado';
      case 'rejected': return 'Rechazado';
      default: return 'Desconocido';
    }
  };

  return (
    <View style={baseStyles.container}>
      <Animated.View 
        style={[
          baseStyles.content,
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
            <Ionicons name="menu-outline" size={28} color={colors.textPrimary} />
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
          contentContainerStyle={baseStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          <View style={styles.welcomeSection}>
            <View style={styles.welcomeSpacer} />
            <Text style={styles.welcomeTitle}>Bienvenido, Administrador</Text>
            <Text style={styles.welcomeSubtitle}>Gestiona tu sistema de informes de forma eficiente</Text>
          </View>

          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Estadísticas Generales</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Ionicons name="people-outline" size={20} color={colors.primary} style={{ marginBottom: spacing.xs }} />
                <Text style={styles.statValue}>24</Text>
                <Text style={styles.statLabel}>Técnicos Activos</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="document-text-outline" size={20} color={colors.success} style={{ marginBottom: spacing.xs }} />
                <Text style={styles.statValue}>156</Text>
                <Text style={styles.statLabel}>Informes Este Mes</Text>
              </View>
            </View>
          </View>

          <View style={styles.actionsContainer}>
            <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => handleQuickAction('users')}
                activeOpacity={0.8}
              >
                <Ionicons name="people-outline" size={20} color={colors.primary} style={{ marginRight: spacing.sm }} />
                <Text style={styles.actionText}>Gestionar Usuarios</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => handleQuickAction('reports')}
                activeOpacity={0.8}
              >
                <Ionicons name="document-text-outline" size={20} color={colors.success} style={{ marginRight: spacing.sm }} />
                <Text style={styles.actionText}>Revisar Informes</Text>
              </TouchableOpacity>
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
        <View style={styles.modalOverlaySidebar}>
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Menú Admin</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowMenu(false)}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={16} color={colors.textInverse} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.menuItems}>
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => handleMenuAction('dashboard')}
                activeOpacity={0.7}
              >
                <Ionicons name="grid-outline" size={20} color={colors.textSecondary} style={{ marginRight: spacing.md }} />
                <Text style={styles.menuItemText}>Dashboard</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => handleMenuAction('users')}
                activeOpacity={0.7}
              >
                <Ionicons name="people-outline" size={20} color={colors.textSecondary} style={{ marginRight: spacing.md }} />
                <Text style={styles.menuItemText}>Usuarios</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => handleMenuAction('reports')}
                activeOpacity={0.7}
              >
                <Ionicons name="document-text-outline" size={20} color={colors.textSecondary} style={{ marginRight: spacing.md }} />
                <Text style={styles.menuItemText}>Informes</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => handleMenuAction('analytics')}
                activeOpacity={0.7}
              >
                <Ionicons name="stats-chart-outline" size={20} color={colors.textSecondary} style={{ marginRight: spacing.md }} />
                <Text style={styles.menuItemText}>Reportes</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => handleMenuAction('settings')}
                activeOpacity={0.7}
              >
                <Ionicons name="settings-outline" size={20} color={colors.textSecondary} style={{ marginRight: 16 }} />
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
        <View style={styles.modalOverlayCentered}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="people-outline" size={20} color="#212529" style={{ marginRight: 8 }} />
                <Text style={styles.modalTitle}>Gestión de Usuarios</Text>
              </View>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowUserManagement(false)}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.userSection}>
                <Text style={styles.sectionDescription}>
                  Administra los usuarios del sistema
                </Text>
                
                <View style={styles.userStats}>
                  <View style={styles.userStat}>
                    <Text style={styles.userStatNumber}>{getUsersByRole('Técnico')}</Text>
                    <Text style={styles.userStatLabel}>Técnicos</Text>
                  </View>
                  <View style={styles.userStat}>
                    <Text style={styles.userStatNumber}>{getUsersByRole('Administrador')}</Text>
                    <Text style={styles.userStatLabel}>Administradores</Text>
                  </View>
                  <View style={styles.userStat}>
                    <Text style={styles.userStatNumber}>{users.length}</Text>
                    <Text style={styles.userStatLabel}>Total</Text>
                  </View>
                </View>
                
                <View style={styles.userActions}>
                  <TouchableOpacity 
                    style={styles.userAction}
                    onPress={handleAddUser}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="person-add-outline" size={20} color="#495057" style={{ marginRight: 12 }} />
                    <Text style={styles.userActionText}>Agregar Usuario</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.userAction}
                    onPress={handleViewUserList}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="list-outline" size={20} color="#495057" style={{ marginRight: 12 }} />
                    <Text style={styles.userActionText}>Ver Lista</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de Agregar/Editar Usuario */}
      <Modal
        visible={showAddUser}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddUser(false)}
      >
        <View style={styles.modalOverlayCentered}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="person-outline" size={20} color="#212529" style={{ marginRight: 8 }} />
                <Text style={styles.modalTitle}>
                  {editingUser ? 'Editar Usuario' : 'Agregar Usuario'}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => {
                  setShowAddUser(false);
                  setShowUserManagement(true); // Volver al modal de gestión
                }}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.formSection}>
                <View style={styles.formInputGroup}>
                  <Text style={styles.inputLabel}>Nombre</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.name}
                    onChangeText={(text) => setFormData({...formData, name: text})}
                    placeholder="Ingresa el nombre completo"
                    placeholderTextColor="#ADB5BD"
                  />
                </View>
                
                <View style={styles.formInputGroup}>
                  <Text style={styles.inputLabel}>Correo electrónico</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.email}
                    onChangeText={(text) => setFormData({...formData, email: text})}
                    placeholder="correo@empresa.com"
                    placeholderTextColor="#ADB5BD"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                
                <View style={styles.formInputGroup}>
                  <Text style={styles.inputLabel}>Rol</Text>
                  <View style={styles.roleSelector}>
                    {['Técnico', 'Administrador'].map((role) => (
                      <TouchableOpacity
                        key={role}
                        style={[
                          styles.roleOption,
                          formData.role === role && styles.roleOptionSelected
                        ]}
                        onPress={() => setFormData({...formData, role})}
                        activeOpacity={0.8}
                      >
                        <Text style={[
                          styles.roleOptionText,
                          formData.role === role && styles.roleOptionTextSelected
                        ]}>
                          {role}
                        </Text>
                      </TouchableOpacity>
                    ))}
                    </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={handleSaveUser}
                  activeOpacity={0.8}
                >
                  <Text style={styles.saveButtonText}>
                    {editingUser ? 'Actualizar Usuario' : 'Guardar Usuario'}
                  </Text>
                    </TouchableOpacity>
                  </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de Lista de Usuarios */}
      <Modal
        visible={showUserList}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowUserList(false)}
      >
        <View style={styles.modalOverlayCentered}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="people-outline" size={20} color="#212529" style={{ marginRight: 8 }} />
                <Text style={styles.modalTitle}>Lista de Usuarios</Text>
                    </View>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => {
                  setShowUserList(false);
                  setShowUserManagement(true); // Volver al modal de gestión
                }}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                  
            <ScrollView style={styles.modalBody}>
              <View style={styles.userListSection}>
                {users.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Ionicons name="people-outline" size={48} color="#ADB5BD" />
                    <Text style={styles.emptyStateText}>No hay usuarios registrados</Text>
                    </View>
                ) : (
                  <View style={styles.userList}>
                    {users.map((user) => (
                      <View key={user.id} style={styles.userListItem}>
                        <View style={styles.userInfo}>
                          <Text style={styles.userName}>{user.name}</Text>
                          <Text style={styles.userEmail}>{user.email}</Text>
                          <View style={styles.userRoleBadge}>
                            <Text style={styles.userRoleText}>{user.role}</Text>
                          </View>
                        </View>
                                                 <View style={styles.userItemActions}>
                           <TouchableOpacity 
                             style={styles.editButton}
                             onPress={() => handleEditUser(user)}
                             activeOpacity={0.8}
                           >
                             <Ionicons name="create-outline" size={16} color="#007BFF" />
                           </TouchableOpacity>
                           <TouchableOpacity 
                             style={styles.deleteButton}
                             onPress={() => handleDeleteUser(user.id)}
                             activeOpacity={0.8}
                           >
                             <Ionicons name="trash-outline" size={16} color="#DC3545" />
                    </TouchableOpacity>
                  </View>
                </View>
                    ))}
                  </View>
                )}
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
        <View style={styles.modalOverlayCentered}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="document-text-outline" size={20} color="#212529" style={{ marginRight: 8 }} />
                <Text style={styles.modalTitle}>Gestión de Informes</Text>
              </View>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowReports(false)}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.reportsSection}>
                <Text style={styles.sectionDescription}>
                  Revisa y gestiona los informes de mantenimiento
                </Text>
                
                <View style={styles.reportFilters}>
                  <TouchableOpacity 
                    style={[styles.filterButton, reportsFilter === 'all' && styles.filterButtonActive]} 
                    onPress={() => setReportsFilter('all')}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.filterText, reportsFilter === 'all' && styles.filterTextActive]}>Todos</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.filterButton, reportsFilter === 'pending' && styles.filterButtonActive]} 
                    onPress={() => setReportsFilter('pending')}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.filterText, reportsFilter === 'pending' && styles.filterTextActive]}>Pendientes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.filterButton, reportsFilter === 'in_review' && styles.filterButtonActive]} 
                    onPress={() => setReportsFilter('in_review')}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.filterText, reportsFilter === 'in_review' && styles.filterTextActive]}>En Revisión</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.filterButton, reportsFilter === 'approved' && styles.filterButtonActive]} 
                    onPress={() => setReportsFilter('approved')}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.filterText, reportsFilter === 'approved' && styles.filterTextActive]}>Aprobados</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.reportList}>
                  {filteredReports.length === 0 ? (
                    <View style={styles.emptyReportsState}>
                      <Ionicons name="document-text-outline" size={48} color="#ADB5BD" />
                      <Text style={styles.emptyReportsText}>
                        {reports.length === 0 ? 'No hay informes disponibles' : 'No hay informes con el filtro seleccionado'}
                      </Text>
                    </View>
                  ) : (
                    filteredReports.map((report) => (
                      <View key={report.id} style={styles.reportItem}>
                        <Ionicons name="document-text-outline" size={20} color="#007BFF" style={{ marginRight: 12 }} />
                        <View style={styles.reportContent}>
                          <Text style={styles.reportTitle}>{report.title}</Text>
                          <Text style={styles.reportAuthor}>Por: {report.technicianName}</Text>
                          <Text style={styles.reportDate}>{formatDate(report.createdAt)}</Text>
                        </View>
                        <View style={styles.reportActions}>
                          <View style={[styles.reportStatusBadge, { backgroundColor: getStatusColor(report.status) }]}>
                            <Text style={styles.reportStatusText}>{getStatusText(report.status)}</Text>
                  </View>
                  <TouchableOpacity 
                            style={styles.viewReportButton}
                            onPress={() => handleViewReport(report)}
                    activeOpacity={0.8}
                  >
                            <Ionicons name="eye-outline" size={16} color="#007BFF" />
                  </TouchableOpacity>
                        </View>
                      </View>
                    ))
                  )}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>


      {/* Modal de Detalle de Informe */}
      {showReportDetail && selectedReport && (
      <Modal
          visible={showReportDetail}
        transparent={true}
        animationType="slide"
          onRequestClose={() => setShowReportDetail(false)}
      >

          <View style={styles.modalOverlayCentered}>
            <View style={[styles.modalContent, styles.reportDetailModal]}>
            <View style={styles.modalHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="document-text-outline" size={20} color="#212529" style={{ marginRight: 8 }} />
                  <Text style={styles.modalTitle}>Detalle del Informe</Text>
                </View>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                  onPress={() => setShowReportDetail(false)}
                activeOpacity={0.8}
              >
                  <Ionicons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            
              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                {/* Información básica del informe */}
                <View style={styles.reportDetailSection}>
                  <Text style={styles.reportDetailTitle}>{selectedReport.title}</Text>
                  <View style={styles.reportDetailInfo}>
                    <View style={styles.reportDetailRow}>
                      <Ionicons name="person-outline" size={16} color="#6C757D" />
                      <Text style={styles.reportDetailText}>Técnico: {selectedReport.technicianName}</Text>
                    </View>
                    <View style={styles.reportDetailRow}>
                      <Ionicons name="calendar-outline" size={16} color="#6C757D" />
                      <Text style={styles.reportDetailText}>Creado: {formatDate(selectedReport.createdAt)}</Text>
                    </View>
                    <View style={styles.reportDetailRow}>
                      <Ionicons name="time-outline" size={16} color="#6C757D" />
                      <Text style={styles.reportDetailText}>Entrada: {selectedReport.checkInTime}</Text>
                    </View>
                    <View style={styles.reportDetailRow}>
                      <Ionicons name="time-outline" size={16} color="#6C757D" />
                      <Text style={styles.reportDetailText}>Salida: {selectedReport.checkOutTime}</Text>
                    </View>
                  </View>
                </View>

                {/* Descripción */}
                <View style={styles.reportDetailSection}>
                  <Text style={styles.reportDetailSectionTitle}>Descripción del Trabajo</Text>
                  <Text style={styles.reportDetailDescription}>{selectedReport.description}</Text>
                </View>

                {/* Fotos Antes */}
                {selectedReport.photoBeforeUris.length > 0 && (
                  <View style={styles.reportDetailSection}>
                    <Text style={styles.reportDetailSectionTitle}>Fotos Antes</Text>
                    <View style={styles.reportDetailPhotoGrid}>
                      {selectedReport.photoBeforeUris.map((uri, index) => (
                        <View key={index} style={styles.reportDetailPhotoItem}>
                          <Image source={{ uri }} style={styles.reportDetailPhoto} resizeMode="cover" />
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Fotos Después */}
                {selectedReport.photoAfterUris.length > 0 && (
                  <View style={styles.reportDetailSection}>
                    <Text style={styles.reportDetailSectionTitle}>Fotos Después</Text>
                    <View style={styles.reportDetailPhotoGrid}>
                      {selectedReport.photoAfterUris.map((uri, index) => (
                        <View key={index} style={styles.reportDetailPhotoItem}>
                          <Image source={{ uri }} style={styles.reportDetailPhoto} resizeMode="cover" />
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Gestión de Estado */}
                <View style={styles.reportDetailSection}>
                  <Text style={styles.reportDetailSectionTitle}>Gestionar Estado</Text>
                  <View style={styles.reportDetailStatusActions}>
                  <TouchableOpacity 
                      style={[styles.reportDetailStatusButton, { backgroundColor: '#FFA500' }]}
                      onPress={() => handleUpdateReportStatus(selectedReport.id, 'pending')}
                    activeOpacity={0.8}
                  >
                      <Text style={styles.reportDetailStatusButtonText}>Pendiente</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                      style={[styles.reportDetailStatusButton, { backgroundColor: '#007BFF' }]}
                      onPress={() => handleUpdateReportStatus(selectedReport.id, 'in_review')}
                    activeOpacity={0.8}
                  >
                      <Text style={styles.reportDetailStatusButtonText}>En Revisión</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                      style={[styles.reportDetailStatusButton, { backgroundColor: '#28A745' }]}
                      onPress={() => handleUpdateReportStatus(selectedReport.id, 'approved')}
                    activeOpacity={0.8}
                  >
                      <Text style={styles.reportDetailStatusButtonText}>Aprobar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.reportDetailStatusButton, { backgroundColor: '#DC3545' }]}
                      onPress={() => handleUpdateReportStatus(selectedReport.id, 'rejected')}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.reportDetailStatusButtonText}>Rechazar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({

  // Header con botón hamburguesa
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadows.sm,
  },
  hamburgerButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray100,
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
    ...typography.h5,
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: colors.error,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  backButtonText: {
    color: colors.textInverse,
    ...typography.buttonSmall,
    fontSize: 12,
    fontWeight: '500',
  },

  welcomeSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  welcomeSpacer: {
    height: spacing.md,
  },
  welcomeTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    fontSize: 20,
    fontWeight: '600',
  },
  welcomeSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 18,
  },

  statsContainer: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  sectionTitle: {
    ...typography.h5,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    fontSize: 16,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  statCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },
  actionsContainer: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  actionButtons: {
    gap: spacing.sm,
  },
  actionButton: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  recentActivity: {
    marginBottom: spacing.lg,
  },
  activityList: {
    gap: spacing.md,
  },
  activityItem: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 2,
  },
  activityTime: {
    ...typography.bodyXSmall,
    color: colors.textSecondary,
  },
  // Estilos del modal del menú
  modalOverlaySidebar: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '80%',
    height: '100%',
    backgroundColor: colors.surface,
    ...shadows.lg,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.gray50,
  },
  menuTitle: {
    ...typography.h5,
    color: colors.textPrimary,
  },
  closeButton: {
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.full,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItems: {
    flex: 1,
    paddingTop: spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemText: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  menuFooter: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.gray50,
  },
  menuFooterText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  // Estilos para los modales adicionales
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalOverlayCentered: {
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
  filterButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#1976D2',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2196F3',
  },
  filterTextActive: {
    color: '#FFFFFF',
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
  emptyReportsState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyReportsText: {
    fontSize: 16,
    color: '#6C757D',
    marginTop: 12,
    textAlign: 'center',
  },
  reportActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  reportStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  viewReportButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#E3F2FD',
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
  // Estilos para el formulario de usuarios
  formSection: {
    gap: 20,
  },
  formInputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  roleSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  roleOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  roleOptionSelected: {
    borderColor: '#007BFF',
    backgroundColor: '#E3F2FD',
  },
  roleOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
  },
  roleOptionTextSelected: {
    color: '#007BFF',
  },
  saveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 16,
    borderRadius: 25,
    marginTop: 20,
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
  },
  // Estilos para la lista de usuarios
  userListSection: {
    gap: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6C757D',
    marginTop: 12,
    textAlign: 'center',
  },
  userList: {
    gap: 12,
  },
  userListItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#495057',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 8,
  },
  userRoleBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  userRoleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007BFF',
  },
  userItemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#E3F2FD',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFEBEE',
  },
  reportDetailModal: {
    width: '95%',
    maxWidth: 600,
    maxHeight: '90%',
  },

  // Estilos para el modal de detalle del informe
  reportDetailSection: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  reportDetailTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#495057',
    marginBottom: 12,
  },
  reportDetailInfo: {
    gap: 8,
  },
  reportDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportDetailText: {
    fontSize: 14,
    color: '#6C757D',
    marginLeft: 8,
  },
  reportDetailSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 12,
  },
  reportDetailDescription: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
  },
  reportDetailPhotoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  reportDetailPhotoItem: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
  },
  reportDetailPhoto: {
    width: '100%',
    height: '100%',
  },
  reportDetailStatusActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  reportDetailStatusButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  reportDetailStatusButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },


});
