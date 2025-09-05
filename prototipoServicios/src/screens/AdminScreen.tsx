import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView, Modal, Alert, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ReportService, { Report } from '../services/ReportService';
import ScheduleService, { ScheduleItem, LocalSite } from '../services/ScheduleService';
import AuthService, { User as AuthUser } from '../services/AuthService';
import ClientService, { Client } from '../services/ClientService';
import TeamService, { Team } from '../services/TeamService';
import Calendar from '../components/Calendar';
import { ReportDetailScreen } from './ReportDetailScreen';
import { colors, typography, spacing, borderRadius, shadows, baseStyles, componentStyles } from '../styles/theme';
import type { AdminDashboardProps } from '../navigation/types';

// Usar la interfaz de AuthService
type User = AuthUser;

export const AdminScreen: React.FC<AdminDashboardProps> = ({ navigation }) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  // Estado calendario/cronograma
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleItem | null>(null);
  const [formSchedule, setFormSchedule] = useState({
    teamName: '',
    clientId: '',
    address: '',
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

  // Estados para gestión de clientes
  const [clients, setClients] = useState<Client[]>([]);
  const [showAddClient, setShowAddClient] = useState(false);
  const [showClientList, setShowClientList] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Estados para gestión de equipos
  const [teams, setTeams] = useState<Team[]>([]);
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [showTeamList, setShowTeamList] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  // Estados para el formulario de usuario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Técnico'
  });

  // Estados para el formulario de cliente
  const [formClient, setFormClient] = useState({
    name: '',
    cedulaRuc: '',
    address: '',
    local: '',
    parroquia: ''
  });

  // Estados para el formulario de equipo
  const [formTeam, setFormTeam] = useState({
    name: '',
    description: '',
    technicianIds: [] as string[]
  });

  // Estados para los selectores desplegables
  const [showClientSelector, setShowClientSelector] = useState(false);
  const [showTeamSelector, setShowTeamSelector] = useState(false);
  const [showTechnicianSelector, setShowTechnicianSelector] = useState(false);

  //
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');

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

  // Cargar clientes del ClientService
  useEffect(() => {
    const clientService = ClientService.getInstance();
    const allClients = clientService.getAllClients();
    setClients(allClients);

    const unsubscribe = clientService.subscribe((updatedClients) => {
      setClients(updatedClients);
    });

    return unsubscribe;
  }, []);

  // Cargar equipos del TeamService
  useEffect(() => {
    const teamService = TeamService.getInstance();
    const allTeams = teamService.getAllTeams();
    setTeams(allTeams);

    const unsubscribe = teamService.subscribe((updatedTeams) => {
      setTeams(updatedTeams);
    });

    return unsubscribe;
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
    setFormSchedule({ teamName: '', clientId: '', address: '', tasks: '' });
    setShowScheduleForm(true);
  };

  const openEditSchedule = (item: ScheduleItem) => {
    setEditingSchedule(item);
    // Buscar el cliente por nombre para obtener el ID
    const client = clients.find(c => c.name === item.location.clientName);
    setFormSchedule({
      teamName: item.teamName,
      clientId: client?.id || '',
      address: item.location.address,
      tasks: item.tasks.map(t => t.description).join(','),
    });
    setShowScheduleForm(true);
  };

  const saveSchedule = async () => {
    try {
      const svc = ScheduleService.getInstance();

      // Validar campos requeridos
      if (!formSchedule.teamName.trim() || !formSchedule.clientId || !formSchedule.address.trim() || !formSchedule.tasks.trim()) {
        Alert.alert('Error', 'Completa todos los campos requeridos');
        return;
      }

      // Obtener el cliente seleccionado
      const client = clients.find(c => c.id === formSchedule.clientId);
      if (!client) {
        Alert.alert('Error', 'Cliente no encontrado');
        return;
      }

      // Obtener el equipo seleccionado
      const team = teams.find(t => t.name === formSchedule.teamName);
      if (!team) {
        Alert.alert('Error', 'Equipo no encontrado');
        return;
      }

      const local: LocalSite = {
        id: `${client.local}-${formSchedule.address}`,
        name: client.local,
        address: formSchedule.address.trim(),
        clientName: client.name,
      };

      const tasks = formSchedule.tasks.split(',').map(s => s.trim()).filter(Boolean).map((d, i) => ({ id: `${Date.now()}-${i}`, description: d }));

      if (tasks.length === 0) {
        Alert.alert('Error', 'Debe haber al menos 1 tarea');
        return;
      }

      if (editingSchedule) {
        await svc.updateSchedule(editingSchedule.id, {
          teamName: formSchedule.teamName,
          location: local,
          technicianIds: team.technicianIds,
          tasks
        });
      } else {
        await svc.addSchedule({
          date: selectedDate,
          teamName: formSchedule.teamName,
          location: local,
          technicianIds: team.technicianIds,
          tasks
        });
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

  // Funciones para gestión de clientes
  const handleAddClient = () => {
    setShowUserManagement(false);
    setShowAddClient(true);
    setEditingClient(null);
    setFormClient({ name: '', cedulaRuc: '', address: '', local: '', parroquia: '' });
  };

  const handleViewClientList = () => {
    setShowUserManagement(false);
    setShowClientList(true);
  };

  const handleSaveClient = async () => {
    if (!formClient.name.trim() || !formClient.cedulaRuc.trim() || !formClient.address.trim() || !formClient.local.trim() || !formClient.parroquia.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      const clientService = ClientService.getInstance();

      if (editingClient) {
        // Editar cliente existente
        const updatedClient = await clientService.updateClient(editingClient.id, {
          name: formClient.name.trim(),
          cedulaRuc: formClient.cedulaRuc.trim(),
          address: formClient.address.trim(),
          local: formClient.local.trim(),
          parroquia: formClient.parroquia.trim()
        });

        if (updatedClient) {
          Alert.alert('Éxito', 'Cliente actualizado correctamente');
        }
      } else {
        // Crear nuevo cliente
        const newClient = await clientService.createClient({
          name: formClient.name.trim(),
          cedulaRuc: formClient.cedulaRuc.trim(),
          address: formClient.address.trim(),
          local: formClient.local.trim(),
          parroquia: formClient.parroquia.trim()
        });

        Alert.alert('Éxito', 'Cliente creado correctamente');
      }

      setShowAddClient(false);
      setShowUserManagement(true);
      setEditingClient(null);
      setFormClient({ name: '', cedulaRuc: '', address: '', local: '', parroquia: '' });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo guardar el cliente');
    }
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setFormClient({
      name: client.name,
      cedulaRuc: client.cedulaRuc,
      address: client.address,
      local: client.local,
      parroquia: client.parroquia
    });
    setShowAddClient(true);
  };

  const handleDeleteClient = (clientId: string) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar este cliente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const clientService = ClientService.getInstance();
              const success = await clientService.deleteClient(clientId);

              if (success) {
                Alert.alert('Éxito', 'Cliente eliminado correctamente');
              } else {
                Alert.alert('Error', 'No se pudo eliminar el cliente');
              }
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el cliente');
            }
          }
        }
      ]
    );
  };

  // Funciones para gestión de equipos
  const handleAddTeam = () => {
    setShowUserManagement(false);
    setShowAddTeam(true);
    setEditingTeam(null);
    setFormTeam({ name: '', description: '', technicianIds: [] });
  };

  const handleViewTeamList = () => {
    setShowUserManagement(false);
    setShowTeamList(true);
  };

  const handleSaveTeam = async () => {
    if (!formTeam.name.trim()) {
      Alert.alert('Error', 'Por favor ingresa el nombre del equipo');
      return;
    }

    if (formTeam.technicianIds.length === 0) {
      Alert.alert('Error', 'Por favor selecciona al menos un técnico para el equipo');
      return;
    }

    try {
      const teamService = TeamService.getInstance();

      if (editingTeam) {
        // Editar equipo existente
        const updatedTeam = await teamService.updateTeam(editingTeam.id, {
          name: formTeam.name.trim(),
          technicianIds: formTeam.technicianIds
        });

        if (updatedTeam) {
          Alert.alert('Éxito', 'Equipo actualizado correctamente');
        }
      } else {
        // Crear nuevo equipo
        const newTeam = await teamService.createTeam({
          name: formTeam.name.trim(),
          technicianIds: formTeam.technicianIds
        });

        Alert.alert('Éxito', 'Equipo creado correctamente');
      }

      setShowAddTeam(false);
      setShowUserManagement(true);
      setEditingTeam(null);
      setFormTeam({ name: '', description: '', technicianIds: [] });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo guardar el equipo');
    }
  };

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
    setFormTeam({
      name: team.name,
      description: team.description || '',
      technicianIds: team.technicianIds
    });
    setShowAddTeam(true);
  };

  const handleDeleteTeam = (teamId: string) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar este equipo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const teamService = TeamService.getInstance();
              const success = await teamService.deleteTeam(teamId);

              if (success) {
                Alert.alert('Éxito', 'Equipo eliminado correctamente');
              } else {
                Alert.alert('Error', 'No se pudo eliminar el equipo');
              }
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el equipo');
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

  const handleImagePreview = (uri: string) => {
    if (!uri || uri.trim() === '') {
      return;
    }
    setPreviewImage(uri);
    setShowImagePreview(true);
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

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const renderPhotoSection = (title: string, photos: string[]) => (
    <View style={styles.photoSection}>
      <Text style={styles.photoSectionTitle}>{title}</Text>
      {photos.length === 0 ? (
        <Text style={styles.noPhotosText}>No hay fotos</Text>
      ) : (
        <View style={styles.photoGrid}>
          {photos.map((uri, index) => (
            <TouchableOpacity
              key={index}
              style={styles.photoItem}
              onPress={() => handleImagePreview(uri)}
              activeOpacity={0.9}
            >
              <Image 
                source={{ uri }} 
                style={styles.photoThumbnail}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <ScrollView style={baseStyles.container}>
      <Animated.View
        style={[
          baseStyles.content,
          { opacity: fadeAnim }
        ]}
      >
        <ScrollView
          contentContainerStyle={baseStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          <View style={styles.welcomeSection}>
            <View style={styles.welcomeSpacer} />
            <Text style={styles.welcomeTitle}>Bienvenido, Administrador</Text>
            <Text style={styles.welcomeSubtitle}>Gestiona tu sistema de informes de forma eficiente</Text>

            {/* Botón de gestión de usuarios */}
            <TouchableOpacity
              style={styles.managementButton}
              onPress={() => setShowUserManagement(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="people-outline" size={24} color={colors.textInverse} style={{ marginRight: spacing.sm }} />
              <Text style={styles.managementButtonText}>Gestionar Usuarios, Clientes y Equipos</Text>
            </TouchableOpacity>
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
                  <Ionicons name="calendar-outline" size={48} color={colors.textTertiary} />
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
                <Text style={styles.inputLabel}>Cliente</Text>
                <View style={styles.pickerContainer}>
                  <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => {
                      if (clients.length === 0) {
                        Alert.alert('Info', 'No hay clientes registrados. Primero debes crear un cliente.');
                        return;
                      }
                      setShowClientSelector(true);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.pickerButtonText}>
                      {formSchedule.clientId ?
                        clients.find(c => c.id === formSchedule.clientId)?.name || 'Seleccionar Cliente' :
                        'Seleccionar Cliente'
                      }
                    </Text>
                    <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formInputGroup}>
                <Text style={styles.inputLabel}>Dirección</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Calle 123"
                  placeholderTextColor="#ADB5BD"
                  value={formSchedule.address}
                  onChangeText={(t) => setFormSchedule({ ...formSchedule, address: t })}
                />
              </View>

              <View style={styles.formInputGroup}>
                <Text style={styles.inputLabel}>Equipo</Text>
                <View style={styles.pickerContainer}>
                  <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => {
                      if (teams.length === 0) {
                        Alert.alert('Info', 'No hay equipos registrados. Primero debes crear un equipo.');
                        return;
                      }
                      setShowTeamSelector(true);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.pickerButtonText}>
                      {formSchedule.teamName || 'Seleccionar Equipo'}
                    </Text>
                    <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formInputGroup}>
                <Text style={styles.inputLabel}>Actividades por realizar</Text>
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

      {/* Modal Selector de Clientes */}
      <Modal
        visible={showClientSelector}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowClientSelector(false)}
      >
        <View style={styles.modalOverlayCentered}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Cliente</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowClientSelector(false)}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {clients.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="business-outline" size={48} color="#ADB5BD" />
                  <Text style={styles.emptyStateText}>No hay clientes registrados</Text>
                </View>
              ) : (
                <View style={styles.selectorList}>
                  {clients.map((client) => (
                    <TouchableOpacity
                      key={client.id}
                      style={styles.selectorItem}
                      onPress={() => {
                        setFormSchedule({ ...formSchedule, clientId: client.id });
                        setShowClientSelector(false);
                      }}
                      activeOpacity={0.8}
                    >
                      <View style={styles.selectorItemContent}>
                        <Text style={styles.selectorItemTitle}>{client.name}</Text>
                        <Text style={styles.selectorItemSubtitle}>Local: {client.local}</Text>
                        <Text style={styles.selectorItemDetail}>Cédula/RUC: {client.cedulaRuc}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal Selector de Equipos */}
      <Modal
        visible={showTeamSelector}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTeamSelector(false)}
      >
        <View style={styles.modalOverlayCentered}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Equipo</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowTeamSelector(false)}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {teams.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="people-outline" size={48} color="#ADB5BD" />
                  <Text style={styles.emptyStateText}>No hay equipos registrados</Text>
                </View>
              ) : (
                <View style={styles.selectorList}>
                  {teams.map((team) => (
                    <TouchableOpacity
                      key={team.id}
                      style={styles.selectorItem}
                      onPress={() => {
                        setFormSchedule({ ...formSchedule, teamName: team.name });
                        setShowTeamSelector(false);
                      }}
                      activeOpacity={0.8}
                    >
                      <View style={styles.selectorItemContent}>
                        <Text style={styles.selectorItemTitle}>{team.name}</Text>
                        <Text style={styles.selectorItemSubtitle}>
                          {team.description || 'Sin descripción'}
                        </Text>
                        <Text style={styles.selectorItemDetail}>
                          Técnicos: {team.technicianIds.length}
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
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
                    <Text style={styles.userActionText}>Ver Usuarios</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.userActions}>
                  <TouchableOpacity
                    style={styles.userAction}
                    onPress={handleAddClient}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="business-outline" size={20} color="#495057" style={{ marginRight: 12 }} />
                    <Text style={styles.userActionText}>Agregar Cliente</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.userAction}
                    onPress={handleViewClientList}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="list-outline" size={20} color="#495057" style={{ marginRight: 12 }} />
                    <Text style={styles.userActionText}>Ver Clientes</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.userActions}>
                  <TouchableOpacity
                    style={styles.userAction}
                    onPress={handleAddTeam}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="people-outline" size={20} color="#495057" style={{ marginRight: 12 }} />
                    <Text style={styles.userActionText}>Agregar Equipo</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.userAction}
                    onPress={handleViewTeamList}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="list-outline" size={20} color="#495057" style={{ marginRight: 12 }} />
                    <Text style={styles.userActionText}>Ver Equipos</Text>
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
                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                    placeholder="Ingresa el nombre completo"
                    placeholderTextColor="#ADB5BD"
                  />
                </View>

                <View style={styles.formInputGroup}>
                  <Text style={styles.inputLabel}>Correo electrónico</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
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

      {/* Modal de Agregar/Editar Cliente */}
      <Modal
        visible={showAddClient}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddClient(false)}
      >
        <View style={styles.modalOverlayCentered}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="business-outline" size={20} color="#212529" style={{ marginRight: 8 }} />
                <Text style={styles.modalTitle}>
                  {editingClient ? 'Editar Cliente' : 'Agregar Cliente'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => {
                  setShowAddClient(false);
                  setShowUserManagement(true);
                }}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.formSection}>
                <View style={styles.formInputGroup}>
                  <Text style={styles.inputLabel}>Nombre de la Empresa</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formClient.name}
                    onChangeText={(text) => setFormClient({ ...formClient, name: text })}
                    placeholder="Empresa XYZ S.A."
                    placeholderTextColor="#ADB5BD"
                  />
                </View>

                <View style={styles.formInputGroup}>
                  <Text style={styles.inputLabel}>Cédula/RUC</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formClient.cedulaRuc}
                    onChangeText={(text) => setFormClient({ ...formClient, cedulaRuc: text })}
                    placeholder="1234567890001"
                    placeholderTextColor="#ADB5BD"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.formInputGroup}>
                  <Text style={styles.inputLabel}>Dirección</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formClient.address}
                    onChangeText={(text) => setFormClient({ ...formClient, address: text })}
                    placeholder="Av. Principal 123, Ciudad"
                    placeholderTextColor="#ADB5BD"
                  />
                </View>

                <View style={styles.formInputGroup}>
                  <Text style={styles.inputLabel}>Local</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formClient.local}
                    onChangeText={(text) => setFormClient({ ...formClient, local: text })}
                    placeholder="Sucursal Centro"
                    placeholderTextColor="#ADB5BD"
                  />
                </View>

                <View style={styles.formInputGroup}>
                  <Text style={styles.inputLabel}>Parroquia</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formClient.parroquia}
                    onChangeText={(text) => setFormClient({ ...formClient, parroquia: text })}
                    placeholder="San Blas"
                    placeholderTextColor="#ADB5BD"
                  />
                </View>

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveClient}
                  activeOpacity={0.8}
                >
                  <Text style={styles.saveButtonText}>
                    {editingClient ? 'Actualizar Cliente' : 'Guardar Cliente'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de Lista de Clientes */}
      <Modal
        visible={showClientList}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowClientList(false)}
      >
        <View style={styles.modalOverlayCentered}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="business-outline" size={20} color="#212529" style={{ marginRight: 8 }} />
                <Text style={styles.modalTitle}>Lista de Clientes</Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => {
                  setShowClientList(false);
                  setShowUserManagement(true);
                }}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.userListSection}>
                {clients.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Ionicons name="business-outline" size={48} color="#ADB5BD" />
                    <Text style={styles.emptyStateText}>No hay clientes registrados</Text>
                  </View>
                ) : (
                  <View style={styles.userList}>
                    {clients.map((client) => (
                      <View key={client.id} style={styles.userListItem}>
                        <View style={styles.userInfo}>
                          <Text style={styles.userName}>{client.name}</Text>
                          <Text style={styles.userEmail}>Cédula/RUC: {client.cedulaRuc}</Text>
                          <Text style={styles.userUsername}>Local: {client.local}</Text>
                          <View style={styles.userRoleBadge}>
                            <Text style={styles.userRoleText}>
                              {client.parroquia}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.userItemActions}>
                          <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => handleEditClient(client)}
                            activeOpacity={0.8}
                          >
                            <Ionicons name="create-outline" size={16} color="#007BFF" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => handleDeleteClient(client.id)}
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

      {/* Modal de Agregar/Editar Equipo */}
      <Modal
        visible={showAddTeam}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddTeam(false)}
      >
        <View style={styles.modalOverlayCentered}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="people-outline" size={20} color="#212529" style={{ marginRight: 8 }} />
                <Text style={styles.modalTitle}>
                  {editingTeam ? 'Editar Equipo' : 'Agregar Equipo'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => {
                  setShowAddTeam(false);
                  setShowUserManagement(true);
                }}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.formSection}>
                <View style={styles.formInputGroup}>
                  <Text style={styles.inputLabel}>Nombre del Equipo</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formTeam.name}
                    onChangeText={(text) => setFormTeam({ ...formTeam, name: text })}
                    placeholder="Equipo Norte"
                    placeholderTextColor="#ADB5BD"
                  />
                </View>

                <View style={styles.formInputGroup}>
                  <Text style={styles.inputLabel}>Técnicos del Equipo</Text>
                  <View style={styles.pickerContainer}>
                    <TouchableOpacity
                      style={styles.pickerButton}
                      onPress={() => {
                        if (users.filter(u => u.role === 'tecnico').length === 0) {
                          Alert.alert('Info', 'No hay técnicos registrados. Primero debes crear técnicos.');
                          return;
                        }
                        setShowTechnicianSelector(true);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.pickerButtonText}>
                        {formTeam.technicianIds.length > 0 ?
                          `${formTeam.technicianIds.length} técnico(s) seleccionado(s)` :
                          'Seleccionar Técnicos'
                        }
                      </Text>
                      <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
                    </TouchableOpacity>
                  </View>

                  {/* Lista de técnicos seleccionados */}
                  {formTeam.technicianIds.length > 0 && (
                    <View style={styles.selectedTechniciansList}>
                      {formTeam.technicianIds.map((technicianId) => {
                        const technician = users.find(u => u.id === technicianId);
                        return technician ? (
                          <View key={technicianId} style={styles.selectedTechnicianItem}>
                            <Text style={styles.selectedTechnicianText}>{technician.name}</Text>
                            <TouchableOpacity
                              style={styles.removeTechnicianButton}
                              onPress={() => {
                                setFormTeam({
                                  ...formTeam,
                                  technicianIds: formTeam.technicianIds.filter(id => id !== technicianId)
                                });
                              }}
                              activeOpacity={0.8}
                            >
                              <Ionicons name="close" size={16} color={colors.error} />
                            </TouchableOpacity>
                          </View>
                        ) : null;
                      })}
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveTeam}
                  activeOpacity={0.8}
                >
                  <Text style={styles.saveButtonText}>
                    {editingTeam ? 'Actualizar Equipo' : 'Guardar Equipo'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de Lista de Equipos */}
      <Modal
        visible={showTeamList}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTeamList(false)}
      >
        <View style={styles.modalOverlayCentered}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="people-outline" size={20} color="#212529" style={{ marginRight: 8 }} />
                <Text style={styles.modalTitle}>Lista de Equipos</Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => {
                  setShowTeamList(false);
                  setShowUserManagement(true);
                }}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.userListSection}>
                {teams.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Ionicons name="people-outline" size={48} color="#ADB5BD" />
                    <Text style={styles.emptyStateText}>No hay equipos registrados</Text>
                  </View>
                ) : (
                  <View style={styles.userList}>
                    {teams.map((team) => (
                      <View key={team.id} style={styles.userListItem}>
                        <View style={styles.userInfo}>
                          <Text style={styles.userName}>{team.name}</Text>
                          <Text style={styles.userEmail}>{team.description || 'Sin descripción'}</Text>
                          <Text style={styles.userUsername}>Técnicos: {team.technicianIds.length}</Text>
                        </View>
                        <View style={styles.userItemActions}>
                          <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => handleEditTeam(team)}
                            activeOpacity={0.8}
                          >
                            <Ionicons name="create-outline" size={16} color="#007BFF" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => handleDeleteTeam(team.id)}
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

      {/* Modal Selector de Técnicos */}
      <Modal
        visible={showTechnicianSelector}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTechnicianSelector(false)}
      >
        <View style={styles.modalOverlayCentered}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Técnicos</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowTechnicianSelector(false)}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {users.filter(u => u.role === 'tecnico').length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="person-outline" size={48} color="#ADB5BD" />
                  <Text style={styles.emptyStateText}>No hay técnicos registrados</Text>
                </View>
              ) : (
                <View style={styles.selectorList}>
                  {users.filter(u => u.role === 'tecnico').map((technician) => (
                    <TouchableOpacity
                      key={technician.id}
                      style={[
                        styles.selectorItem,
                        formTeam.technicianIds.includes(technician.id) && styles.selectorItemSelected
                      ]}
                      onPress={() => {
                        const isSelected = formTeam.technicianIds.includes(technician.id);
                        if (isSelected) {
                          // Remover técnico
                          setFormTeam({
                            ...formTeam,
                            technicianIds: formTeam.technicianIds.filter(id => id !== technician.id)
                          });
                        } else {
                          // Agregar técnico
                          setFormTeam({
                            ...formTeam,
                            technicianIds: [...formTeam.technicianIds, technician.id]
                          });
                        }
                      }}
                      activeOpacity={0.8}
                    >
                      <View style={styles.selectorItemContent}>
                        <Text style={styles.selectorItemTitle}>{technician.name}</Text>
                        <Text style={styles.selectorItemSubtitle}>{technician.email}</Text>
                        <Text style={styles.selectorItemDetail}>Usuario: {technician.username}</Text>
                      </View>
                      <View style={styles.selectorItemCheckbox}>
                        {formTeam.technicianIds.includes(technician.id) ? (
                          <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                        ) : (
                          <Ionicons name="ellipse-outline" size={24} color={colors.textSecondary} />
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
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
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>{selectedReport.title}</Text>
                  <View style={styles.infoRow}>
                    <Ionicons name="person-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.infoText}>Técnico: {selectedReport.technicianName}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.infoText}>Creado: {formatDate(selectedReport.createdAt)}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.infoText}>Actualizado: {formatDate(selectedReport.updatedAt)}</Text>
                  </View>
                </View>

                {/* Horarios */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Horarios de Trabajo</Text>
                  <View style={styles.timeContainer}>
                    <View style={styles.timeItem}>
                      <Text style={styles.timeLabel}>Entrada</Text>
                      <Text style={styles.timeValue}>{formatTime(selectedReport.checkInTime)}</Text>
                    </View>
                    <View style={styles.timeSeparator}>
                      <Ionicons name="arrow-forward" size={20} color={colors.textSecondary} />
                    </View>
                    <View style={styles.timeItem}>
                      <Text style={styles.timeLabel}>Salida</Text>
                      <Text style={styles.timeValue}>{formatTime(selectedReport.checkOutTime)}</Text>
                    </View>
                  </View>
                </View>

                {/* Descripción */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Descripción del Trabajo</Text>
                  <Text style={styles.descriptionText}>{selectedReport.description}</Text>
                </View>

                {/* Fotos */}
                {renderPhotoSection('Fotos Antes', selectedReport.photoBeforeUris)}
                {renderPhotoSection('Fotos Después', selectedReport.photoAfterUris)}

                {/* Gestión de Estado */}
                <View style={styles.reportDetailSection}>
                  <View style={styles.reportDetailStatusActions}>
                    <TouchableOpacity
                      style={[styles.reportDetailStatusButton, { backgroundColor: colors.success }]}
                      onPress={() => {
                        setShowReportDetail(false);
                        handleUpdateReportStatus(selectedReport.id, 'approved');
                      }}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="checkmark" size={24} color={colors.textInverse} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.reportDetailStatusButton, { backgroundColor: colors.error }]}
                      onPress={() => {
                        setShowReportDetail(false);
                        handleDeleteReport(selectedReport.id);
                      }}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="close" size={24} color={colors.textInverse} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Acción inferior: Descargar PDF */}
                <View style={styles.reportDetailSection}>
                  <TouchableOpacity
                    style={[styles.reportDetailDeleteButton, { backgroundColor: colors.primary }]}
                    onPress={() => {
                      Alert.alert('PDF descargado');
                    }}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="download-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={styles.reportDetailDeleteButtonText}>Descargar como PDF</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      {/* Modal de vista previa de imagen */}
      <Modal
        visible={showImagePreview}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImagePreview(false)}
      >
        <View style={styles.imagePreviewOverlay}>
          <View style={styles.imagePreviewContainer}>
            <View style={styles.imagePreviewHeader}>
              <Text style={styles.imagePreviewTitle}>Vista previa</Text>
              <TouchableOpacity
                style={styles.imagePreviewCloseButton}
                onPress={() => setShowImagePreview(false)}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={24} color={colors.textInverse} />
              </TouchableOpacity>
            </View>
            <View style={styles.imagePreviewContent}>
              <Image 
                source={{ uri: previewImage }} 
                style={styles.imagePreviewImage} 
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({

  // Header moderno y atractivo
  // Header moderno y atractivo
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.primary,
    borderBottomWidth: 0,
    ...shadows.lg,
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

  // Sección de bienvenida moderna y atractiva
  welcomeSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    marginHorizontal: spacing.md,
    ...shadows.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  welcomeSpacer: {
    height: spacing.md,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  welcomeSubtitle: {
    fontSize: 18,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing.md,
  },

  statsContainer: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 26,
    color: colors.textPrimary,
    marginBottom: spacing.md,
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
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    lineHeight: 30,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 16,
  },
  // Contenedor de acciones moderno
  actionsContainer: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  actionButtons: {
    gap: spacing.md,
  },
  // Botones de acción modernos y atractivos
  actionButton: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    ...shadows.md,
    borderWidth: 2,
    borderColor: colors.borderLight,
    minHeight: 70,
    position: 'relative',
    overflow: 'hidden',
  },
  actionText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: spacing.md,
    flex: 1,
    lineHeight: 22,
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
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 18,
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
  // Modal moderno y atractivo
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    width: '90%',
    maxWidth: 450,
    maxHeight: '85%',
    ...shadows.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
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
    color: colors.textSecondary,
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
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
    position: 'relative',
    overflow: 'hidden',
  },
  userActionIcon: {
    fontSize: 20,
    marginRight: 12,
    color: colors.primary,
  },
  userActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textInverse,
    letterSpacing: 0.2,
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
  // Elementos de cronograma modernos
  reportItem: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.borderLight,
    marginBottom: spacing.md,
    ...shadows.md,
    position: 'relative',
    overflow: 'hidden',
  },
  reportIcon: {
    fontSize: 24,
    marginRight: spacing.md,
    color: colors.primary,
  },
  reportContent: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    letterSpacing: -0.2,
  },
  reportAuthor: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  reportDate: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.textTertiary,
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
    color: colors.textSecondary,
    marginTop: 12,
    textAlign: 'center',
  },
  // Acciones del cronograma modernas
  reportActions: {
    alignItems: 'center',
    gap: spacing.sm,
    flexDirection: 'column',
  },
  reportStatusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    ...shadows.xs,
  },
  viewReportButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  reportActionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  deleteReportButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
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
  // Sección de formulario moderna
  formSection: {
    gap: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  formInputGroup: {
    marginBottom: spacing.md,
  },
  // Label de input moderno
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    letterSpacing: -0.1,
  },
  // Input de texto moderno
  textInput: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    fontSize: 16,
    color: colors.textPrimary,
    ...shadows.sm,
    marginBottom: spacing.sm,
  },
  // Selector de rol moderno
  roleSelector: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  roleOption: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    ...shadows.xs,
  },
  roleOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
    ...shadows.sm,
  },
  roleOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  roleOptionTextSelected: {
    color: colors.textInverse,
    fontWeight: '700',
  },
  // Nota del rol moderna
  roleNote: {
    fontSize: 13,
    color: colors.textTertiary,
    fontStyle: 'italic',
    marginTop: spacing.sm,
    textAlign: 'center',
    paddingHorizontal: spacing.sm,
    lineHeight: 18,
  },
  // Botón de guardar moderno y atractivo
  saveButton: {
    backgroundColor: colors.success,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    marginTop: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
    borderWidth: 2,
    borderColor: colors.successDark,
    minHeight: 40,
    alignSelf: 'center',
    minWidth: 120,
  },
  saveButtonText: {
    color: colors.textInverse,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  // Estilos para la lista de usuarios
  // Sección de lista de usuarios moderna
  userListSection: {
    gap: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  // Estado vacío moderno
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: spacing.md,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  // Lista de usuarios moderna
  userList: {
    gap: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  // Elementos de usuario modernos
  userListItem: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.borderLight,
    marginBottom: spacing.md,
    ...shadows.md,
    position: 'relative',
    overflow: 'hidden',
  },
  userInfo: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    letterSpacing: -0.2,
  },
  userEmail: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  userUsername: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: spacing.sm,
    fontFamily: 'monospace',
    backgroundColor: colors.primaryLight,
    color: colors.textInverse,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  userRoleBadge: {
    backgroundColor: colors.infoLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    ...shadows.xs,
    borderWidth: 1,
    borderColor: colors.info,
  },
  userRoleText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.infoDark,
  },
  userItemActions: {
    flexDirection: 'column',
    gap: 8,
    alignItems: 'center',
  },
  // Botones de acción de usuario modernos
  editButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.infoLight,
    borderWidth: 1,
    borderColor: colors.info,
    ...shadows.sm,
  },
  deleteButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.errorLight,
    borderWidth: 1,
    borderColor: colors.error,
    ...shadows.sm,
  },
  reportDetailModal: {
    width: '95%',
    maxWidth: 600,
    maxHeight: '90%',
  },

  // Estilos para el modal de detalle del informe
  reportDetailSection: {
    backgroundColor: '',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,

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
    justifyContent: 'center',
    gap: 16,
  },
  reportDetailStatusButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
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

  // Estilos para pickers
  pickerContainer: {
    marginBottom: spacing.sm,
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  pickerButtonText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
  },

  // Estilos para los selectores desplegables
  selectorList: {
    gap: spacing.sm,
  },
  selectorItem: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  selectorItemContent: {
    flex: 1,
  },
  selectorItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  selectorItemSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  selectorItemDetail: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.textTertiary,
  },
  selectorItemSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  selectorItemCheckbox: {
    marginLeft: spacing.sm,
  },
  selectedTechniciansList: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  selectedTechnicianItem: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedTechnicianText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textInverse,
    flex: 1,
  },
  removeTechnicianButton: {
    padding: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.errorLight,
  },
  section: {
    backgroundColor: colors.background,
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeItem: {
    flex: 1,
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    color: colors.textPrimary,
  },
  timeSeparator: {
    paddingHorizontal: spacing.lg,
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 20,
    color: colors.textPrimary,
  },
  photoSection: {
    backgroundColor: colors.background,
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  photoSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  noPhotosText: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  photoItem: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
  },
  photoThumbnail: {
    width: '100%',
    height: '100%',
  },
  statusActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statusButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    minWidth: 80,
    alignItems: 'center',
  },
  statusButtonText: {
    color: colors.textInverse,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },

  // Estilos para el botón de gestión
  managementButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    ...shadows.md,
    borderWidth: 2,
    borderColor: colors.primaryDark,
  },
  managementButtonText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Estilos para el modal de vista previa de imagen
  imagePreviewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreviewContainer: {
    width: '95%',
    height: '90%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  imagePreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surfaceSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  imagePreviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  imagePreviewCloseButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.error,
  },
  imagePreviewContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  imagePreviewImage: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.md,
  },

});
