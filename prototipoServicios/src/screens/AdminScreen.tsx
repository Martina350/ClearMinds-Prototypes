import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView, Modal, Alert, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ReportService, { Report } from '../services/ReportService';
import ScheduleService, { ScheduleItem, LocalSite } from '../services/ScheduleService';
import AuthService, { User as AuthUser } from '../services/AuthService';
import Calendar from '../components/Calendar';
import { ReportDetailScreen } from './ReportDetailScreen';
import { colors, typography, spacing, borderRadius, shadows, baseStyles, componentStyles } from '../styles/theme';

type Props = {
  onBack: () => void;
};

// Usar la interfaz de AuthService
type User = AuthUser;

export const AdminScreen: React.FC<Props> = ({ onBack }) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  // Estado calendario/cronograma
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0,10));
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleItem | null>(null);
  const [formSchedule, setFormSchedule] = useState({
    teamName: '',
    localName: '',
    address: '',
    clientName: '',
    technicianIds: '' as string,
    tasks: '' as string,
  });
  const [showLocalReports, setShowLocalReports] = useState<null | { localId: string; localName: string }>(null);
  
  // Estados para gestión de informes
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showReportDetail, setShowReportDetail] = useState(false);
  const [reportsFilter, setReportsFilter] = useState<'all' | 'pending' | 'in_review' | 'approved' | 'rejected'>('all');
  
  // Estados para gestión de usuarios
  const [users, setUsers] = useState<AuthUser[]>([]);
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

  // Cargar cronogramas por fecha
  useEffect(() => {
    const svc = ScheduleService.getInstance();
    const load = () => {
      setSchedules(svc.getSchedulesByDate(selectedDate));
    };
    load();
    const unsub = svc.subscribe(() => load());
    return unsub;
  }, [selectedDate]);

  // Cargar usuarios del AuthService
  useEffect(() => {
    const authService = AuthService.getInstance();
    const allUsers = authService.getAllUsers();
    setUsers(allUsers);
  }, []);

  // Filtrar informes según el filtro seleccionado
  const filteredReports = reports.filter(report => {
    if (reportsFilter === 'all') return true;
    return report.status === reportsFilter;
  });



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

  // CRUD Cronograma
  const openNewSchedule = () => {
    setEditingSchedule(null);
    setFormSchedule({ teamName: '', localName: '', address: '', clientName: '', technicianIds: '', tasks: '' });
    setShowScheduleForm(true);
  };

  const openEditSchedule = (item: ScheduleItem) => {
    setEditingSchedule(item);
    setFormSchedule({
      teamName: item.teamName,
      localName: item.location.name,
      address: item.location.address,
      clientName: item.location.clientName,
      technicianIds: item.technicianIds.join(','),
      tasks: item.tasks.map(t => t.description).join(','),
    });
    setShowScheduleForm(true);
  };

  const saveSchedule = async () => {
    try {
      const svc = ScheduleService.getInstance();
      const local: LocalSite = {
        id: `${formSchedule.localName}-${formSchedule.address}`,
        name: formSchedule.localName.trim(),
        address: formSchedule.address.trim(),
        clientName: formSchedule.clientName.trim(),
      };
      const technicianIds = formSchedule.technicianIds.split(',').map(s => s.trim()).filter(Boolean);
      const tasks = formSchedule.tasks.split(',').map(s => s.trim()).filter(Boolean).map((d, i) => ({ id: `${Date.now()}-${i}` , description: d }));
      if (!local.name || !local.address || !local.clientName || technicianIds.length === 0 || tasks.length === 0) {
        Alert.alert('Error', 'Completa todos los campos y al menos 1 técnico y 1 tarea');
        return;
      }
      if (editingSchedule) {
        await svc.updateSchedule(editingSchedule.id, { teamName: formSchedule.teamName, location: local, technicianIds, tasks });
      } else {
        await svc.addSchedule({ date: selectedDate, teamName: formSchedule.teamName, location: local, technicianIds, tasks });
      }
      setShowScheduleForm(false);
      setEditingSchedule(null);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'No se pudo guardar el cronograma');
    }
  };

  const deleteSchedule = async (id: string) => {
    Alert.alert('Eliminar', '¿Deseas eliminar este cronograma?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => { await ScheduleService.getInstance().deleteSchedule(id); } },
    ]);
  };

  const sendSchedulesToTechnicians = () => {
    Alert.alert('Enviado', 'Cronograma enviado a los técnicos para la fecha seleccionada.');
  };

  const openLocalReports = (localId: string, localName: string) => {
    setShowLocalReports({ localId, localName });
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

    try {
      const authService = AuthService.getInstance();
      
      if (editingUser) {
        // Editar usuario existente
        const updatedUser = authService.updateUser(editingUser.id, {
          name: formData.name.trim(),
          email: formData.email.trim()
        });
        
        if (updatedUser) {
          setUsers(authService.getAllUsers());
          Alert.alert('Éxito', 'Usuario actualizado correctamente');
        }
      } else {
        // Solo permitir crear técnicos
        if (formData.role !== 'Técnico') {
          Alert.alert('Error', 'Solo puedes crear usuarios técnicos');
          return;
        }
        
        // Generar username y password únicos
        const baseUsername = formData.name.toLowerCase().replace(/\s+/g, '');
        let username = baseUsername;
        let counter = 1;
        
        while (authService.isUsernameTaken(username)) {
          username = `${baseUsername}${counter}`;
          counter++;
        }
        
        const password = 'tecnico123'; // Contraseña por defecto
        
        const newUser = authService.createTechnician(
          username,
          password,
          formData.name.trim(),
          formData.email.trim()
        );
        
        setUsers(authService.getAllUsers());
        Alert.alert(
          'Usuario creado exitosamente', 
          `Usuario: ${username}\nContraseña: ${password}\n\nGuarda estas credenciales.`
        );
      }
      
      setShowAddUser(false);
      setShowUserManagement(true);
      setEditingUser(null);
      setFormData({ name: '', email: '', role: 'Técnico' });
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el usuario');
    }
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

  const handleDeleteUser = (userId: string) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar este usuario?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => {
            try {
              const authService = AuthService.getInstance();
              const success = authService.deleteUser(userId);
              
              if (success) {
                setUsers(authService.getAllUsers());
                Alert.alert('Éxito', 'Usuario eliminado correctamente');
              } else {
                Alert.alert('Error', 'No se pudo eliminar el usuario');
              }
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el usuario');
            }
          }
        }
      ]
    );
  };

  const getUsersByRole = (role: 'admin' | 'tecnico') => {
    const authService = AuthService.getInstance();
    return authService.getUsersByRole(role).length;
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

  const handleDeleteReport = async (reportId: string) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar este informe? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              const reportService = ReportService.getInstance();
              const success = await reportService.deleteReport(reportId);
              
              if (success) {
                Alert.alert('Éxito', 'Informe eliminado correctamente');
                // Recargar informes
                const allReports = await reportService.getAllReports();
                setReports(allReports);
              } else {
                Alert.alert('Error', 'No se pudo eliminar el informe');
              }
            } catch (error) {
              console.error('Error al eliminar informe:', error);
              Alert.alert('Error', 'No se pudo eliminar el informe');
            }
          }
        }
      ]
    );
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
        {/* Header simplificado */}
        <View style={styles.topHeader}>
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

          {/* Estadísticas movidas al menú hamburguesa */}

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

          {/* Calendario */}
          <View style={styles.actionsContainer}>
            <Text style={styles.sectionTitle}>Calendario</Text>
            <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
          </View>

          {/* Cronograma del día */}
          <View style={styles.actionsContainer}>
            <Text style={styles.sectionTitle}>Cronograma de {selectedDate}</Text>
            <View style={{ gap: spacing.sm }}>
              <TouchableOpacity style={styles.actionButton} onPress={() => openNewSchedule()} activeOpacity={0.8}>
                <Ionicons name="add-circle-outline" size={20} color={colors.primary} style={{ marginRight: spacing.sm }} />
                <Text style={styles.actionText}>Agregar cronograma</Text>
              </TouchableOpacity>
              {schedules.length === 0 ? (
                <View style={styles.emptyReportsState}>
                  <Ionicons name="calendar-outline" size={48} color={colors.gray400} />
                  <Text style={styles.emptyReportsText}>No hay locales programados</Text>
                </View>
              ) : (
                schedules.map((s) => (
                  <View key={s.id} style={styles.reportItem}>
                    <Ionicons name="business-outline" size={20} color={colors.primary} style={{ marginRight: spacing.md }} />
                    <View style={styles.reportContent}>
                      <Text style={styles.reportTitle}>{s.location.name} · {s.teamName}</Text>
                      <Text style={styles.reportAuthor}>{s.location.address} · Cliente: {s.location.clientName}</Text>
                      <Text style={styles.reportDate}>Técnicos: {s.technicianIds.join(', ')}</Text>
                    </View>
                    <View style={styles.reportActions}>
                      <TouchableOpacity style={styles.viewReportButton} onPress={() => openLocalReports(s.location.id, s.location.name)} activeOpacity={0.8}>
                        <Ionicons name="folder-open-outline" size={16} color={colors.primary} />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.viewReportButton} onPress={() => openEditSchedule(s)} activeOpacity={0.8}>
                        <Ionicons name="create-outline" size={16} color={colors.warning} />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.viewReportButton} onPress={() => deleteSchedule(s.id)} activeOpacity={0.8}>
                        <Ionicons name="trash-outline" size={16} color={colors.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.success }]} onPress={sendSchedulesToTechnicians} activeOpacity={0.8}>
                <Ionicons name="send-outline" size={20} color={colors.textInverse} style={{ marginRight: spacing.sm }} />
                <Text style={[styles.actionText, { color: colors.textInverse }]}>Enviar cronograma a técnicos</Text>
              </TouchableOpacity>
            </View>
          </View>

          
        </ScrollView>
      </Animated.View>

      {/* Modal para agregar/editar cronograma */}
      <Modal
        visible={showScheduleForm}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowScheduleForm(false)}
      >
        <View style={styles.modalOverlayCentered}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingSchedule ? 'Editar Cronograma' : 'Agregar Cronograma'}</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowScheduleForm(false)}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <View style={styles.formInputGroup}>
                <Text style={styles.inputLabel}>Nombre del Local</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Local ABC"
                  placeholderTextColor="#ADB5BD"
                  value={formSchedule.localName}
                  onChangeText={(t) => setFormSchedule({ ...formSchedule, localName: t })}
                />
              </View>
              <View style={styles.formInputGroup}>
                <Text style={styles.inputLabel}>Dirección</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Calle 123, Ciudad"
                  placeholderTextColor="#ADB5BD"
                  value={formSchedule.address}
                  onChangeText={(t) => setFormSchedule({ ...formSchedule, address: t })}
                />
              </View>
              <View style={styles.formInputGroup}>
                <Text style={styles.inputLabel}>Cliente</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Empresa XYZ"
                  placeholderTextColor="#ADB5BD"
                  value={formSchedule.clientName}
                  onChangeText={(t) => setFormSchedule({ ...formSchedule, clientName: t })}
                />
              </View>
              <View style={styles.formInputGroup}>
                <Text style={styles.inputLabel}>Equipo</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Equipo Norte"
                  placeholderTextColor="#ADB5BD"
                  value={formSchedule.teamName}
                  onChangeText={(t) => setFormSchedule({ ...formSchedule, teamName: t })}
                />
              </View>
              <View style={styles.formInputGroup}>
                <Text style={styles.inputLabel}>IDs Técnicos (coma-separado)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="1,2,3"
                  placeholderTextColor="#ADB5BD"
                  value={formSchedule.technicianIds}
                  onChangeText={(t) => setFormSchedule({ ...formSchedule, technicianIds: t })}
                />
              </View>
              <View style={styles.formInputGroup}>
                <Text style={styles.inputLabel}>Tareas (coma-separado)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Revisión A/C, Cambio filtros, Limpieza"
                  placeholderTextColor="#ADB5BD"
                  value={formSchedule.tasks}
                  onChangeText={(t) => setFormSchedule({ ...formSchedule, tasks: t })}
                />
              </View>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={saveSchedule}
                activeOpacity={0.8}
              >
                <Text style={styles.saveButtonText}>{editingSchedule ? 'Actualizar' : 'Guardar'}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de informes por local */}
      {showLocalReports && (
        <Modal
          visible={!!showLocalReports}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowLocalReports(null)}
        >
          <View style={styles.modalOverlayCentered}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Informes de {showLocalReports.localName}</Text>
                <TouchableOpacity 
                  style={styles.modalCloseButton}
                  onPress={() => setShowLocalReports(null)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="close" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalBody}>
                <View style={styles.reportList}>
                  {reports.filter(r => r.localId === showLocalReports.localId).length === 0 ? (
                    <View style={styles.emptyReportsState}>
                      <Ionicons name="document-text-outline" size={48} color="#ADB5BD" />
                      <Text style={styles.emptyReportsText}>No hay informes para este local</Text>
                    </View>
                  ) : (
                    reports.filter(r => r.localId === showLocalReports.localId).map((report) => (
                      <View key={report.id} style={styles.reportItem}>
                        <Ionicons name="document-text-outline" size={20} color="#007BFF" style={{ marginRight: 12 }} />
                        <View style={styles.reportContent}>
                          <Text style={styles.reportTitle}>{report.title}</Text>
                          <Text style={styles.reportAuthor}>Por: {report.technicianName}</Text>
                          <Text style={styles.reportDate}>{formatDate(report.createdAt)}</Text>
                        </View>
                        <View style={styles.reportActions}>
                          <View style={styles.reportActionButtons}>
                            <TouchableOpacity 
                              style={styles.viewReportButton}
                              onPress={() => { setShowLocalReports(null); handleViewReport(report); }}
                              activeOpacity={0.8}
                              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                            >
                              <Ionicons name="eye-outline" size={16} color="#007BFF" />
                            </TouchableOpacity>
                            <TouchableOpacity 
                              style={styles.deleteReportButton}
                              onPress={() => handleDeleteReport(report.id)}
                              activeOpacity={0.8}
                              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                            >
                              <Ionicons name="trash-outline" size={16} color="#DC3545" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    ))
                  )}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
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
                    <Text style={styles.userStatNumber}>{getUsersByRole('tecnico')}</Text>
                    <Text style={styles.userStatLabel}>Técnicos</Text>
                  </View>
                  <View style={styles.userStat}>
                    <Text style={styles.userStatNumber}>{getUsersByRole('admin')}</Text>
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
                    <TouchableOpacity
                      style={[
                        styles.roleOption,
                        styles.roleOptionSelected
                      ]}
                      activeOpacity={0.8}
                    >
                      <Text style={[
                        styles.roleOptionText,
                        styles.roleOptionTextSelected
                      ]}>
                        Técnico
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.roleNote}>Solo puedes crear usuarios técnicos</Text>
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
                          <Text style={styles.userUsername}>Usuario: {user.username}</Text>
                          <View style={styles.userRoleBadge}>
                            <Text style={styles.userRoleText}>
                              {user.role === 'admin' ? 'Administrador' : 'Técnico'}
                            </Text>
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
                          <View style={styles.reportActionButtons}>
                            <TouchableOpacity 
                              style={styles.viewReportButton}
                              onPress={() => handleViewReport(report)}
                              activeOpacity={0.8}
                            >
                              <Ionicons name="eye-outline" size={16} color="#007BFF" />
                            </TouchableOpacity>
                            <TouchableOpacity 
                              style={styles.deleteReportButton}
                              onPress={() => handleDeleteReport(report.id)}
                              activeOpacity={0.8}
                            >
                              <Ionicons name="trash-outline" size={16} color="#DC3545" />
                            </TouchableOpacity>
                          </View>
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
                
                {/* Botón de Eliminar */}
                <View style={styles.reportDetailSection}>
                  <TouchableOpacity 
                    style={[styles.reportDetailDeleteButton]}
                    onPress={() => {
                      setShowReportDetail(false);
                      handleDeleteReport(selectedReport.id);
                    }}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="trash-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={styles.reportDetailDeleteButtonText}>Eliminar Informe</Text>
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
  reportActionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  deleteReportButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFEBEE',
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
  roleNote: {
    fontSize: 12,
    color: '#6C757D',
    fontStyle: 'italic',
    marginTop: spacing.xs,
    textAlign: 'center',
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
  userUsername: {
    fontSize: 12,
    color: '#007BFF',
    marginBottom: 8,
    fontFamily: 'monospace',
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
  reportDetailDeleteButton: {
    backgroundColor: '#DC3545',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  reportDetailDeleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },


});
