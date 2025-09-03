import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ReportService, { Report } from '../services/ReportService';
import ScheduleService, { ScheduleItem } from '../services/ScheduleService';
import Calendar from '../components/Calendar';
import Checklist from '../components/Checklist';
import { colors, typography, spacing, borderRadius, shadows, baseStyles, componentStyles } from '../styles/theme';
import type { TecnicoDashboardProps } from '../navigation/types';

export const TecnicoScreen: React.FC<TecnicoDashboardProps> = ({ 
  navigation,
  route
}) => {
  const technicianId = route.params?.technicianId || '1';
  const technicianName = route.params?.technicianName || 'Técnico';
  const [fadeAnim] = useState(new Animated.Value(0));


  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0,10));
  const [daySchedules, setDaySchedules] = useState<ScheduleItem[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(null);
  
  // Estados para gestión de informes
  const [reports, setReports] = useState<Report[]>([]);
  const [reportsFilter, setReportsFilter] = useState<'all' | 'pending' | 'in_review' | 'approved' | 'rejected'>('all');

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Cargar informes del técnico y suscribirse a cambios
  useEffect(() => {
    const loadReports = async () => {
      const reportService = ReportService.getInstance();
      const technicianReports = await reportService.getReportsByTechnician(technicianId);
      setReports(technicianReports);
    };

    loadReports();

    // Suscribirse a cambios en los informes
    const reportService = ReportService.getInstance();
    const unsubscribe = reportService.subscribe((allReports) => {
      const technicianReports = allReports.filter(report => report.technicianId === technicianId);
      setReports(technicianReports);
    });

    return unsubscribe;
  }, [technicianId]);

  // Suscripción a cronogramas para el técnico y fecha
  useEffect(() => {
    const svc = ScheduleService.getInstance();
    const load = () => setDaySchedules(svc.getSchedulesByTechnicianAndDate(technicianId, selectedDate));
    load();
    const unsub = svc.subscribe(() => load());
    return unsub;
  }, [technicianId, selectedDate]);

  // Filtrar informes según el filtro seleccionado
  const filteredReports = reports.filter(report => {
    if (reportsFilter === 'all') return true;
    return report.status === reportsFilter;
  });



  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'reports':
        navigation.navigate('MyReports', {
          technicianId,
          technicianName,
        });
        break;
      case 'new_report':
        navigation.navigate('InformeForm', {
          technicianId,
          technicianName,
          localId: selectedSchedule?.location.id,
          localName: selectedSchedule?.location.name,
        });
        break;
    }
  };

  const handleViewReport = (report: Report) => {
    navigation.navigate('ReportDetail', {
      reportId: report.id,
      showStatusActions: false,
    });
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
      case 'pending': return colors.warning;
      case 'in_review': return colors.primary;
      case 'approved': return colors.success;
      case 'rejected': return colors.error;
      default: return colors.textTertiary;
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

  const getReportsCountByStatus = (status: Report['status']) => {
    return reports.filter(report => report.status === status).length;
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
            <Text style={styles.headerTitleText}>Panel de Técnico</Text>
          </View>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.replace('Login')}
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
            <View style={{ backgroundColor: '#10B981', padding: 8, borderRadius: 8, marginBottom: 16 }}>
              <Text style={{ color: 'white', textAlign: 'center', fontSize: 12, fontWeight: '600' }}>
                ✅ React Navigation Activo - Pantalla: TecnicoDashboard
              </Text>
            </View>
            <Text style={styles.welcomeTitle}>Bienvenido, {technicianName}</Text>
            <Text style={styles.welcomeSubtitle}>Gestiona tus informes de mantenimiento de forma eficiente</Text>
          </View>

          {/* Estadísticas movidas al menú hamburguesa */}

          {/* Calendario del técnico */}
          <View style={styles.actionsContainer}>
            <Text style={styles.sectionTitle}>Calendario</Text>
            <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
          </View>

          {/* Cronograma del día */}
          <View style={styles.actionsContainer}>
            <Text style={styles.sectionTitle}>Cronograma de {selectedDate}</Text>
            {daySchedules.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="calendar-outline" size={48} color={colors.textTertiary} />
                <Text style={styles.emptyStateText}>Sin asignaciones para este día</Text>
              </View>
            ) : (
              <View style={styles.activityList}>
                {daySchedules.map((s) => (
                  <View key={s.id} style={styles.activityItem}>
                    <Ionicons name="business-outline" size={20} color={colors.primary} style={{ marginRight: spacing.md }} />
                    <View style={styles.activityContent}>
                      <Text style={styles.activityText}>{s.location.name}</Text>
                      <Text style={styles.activityTime}>{s.location.address} · Cliente: {s.location.clientName}</Text>
                      <View style={{ marginTop: spacing.xs }}>
                        <Text style={styles.activityTime}>Tareas:</Text>
                        {s.tasks.map(t => (
                          <Text key={t.id} style={styles.activityTime}>• {t.description}</Text>
                        ))}
                      </View>
                      <View style={{ marginTop: spacing.sm }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Checklist
                            checked={ScheduleService.getInstance().getChecklistStatus(s.id, technicianId) === 'done'}
                            onChange={async (checked) => {
                              await ScheduleService.getInstance().setChecklistStatus(s.id, technicianId, checked ? 'done' : 'pending');
                              if (checked) {
                                setSelectedSchedule(s);
                              } else {
                                if (selectedSchedule?.id === s.id) setSelectedSchedule(null);
                              }
                            }}
                          />
                        </View>
                        {selectedSchedule?.id === s.id && (
                          <View style={{ marginTop: spacing.xs, alignItems: 'center' }}>
                            <TouchableOpacity 
                              style={styles.smallPrimaryButton}
                              onPress={() => navigation.navigate('InformeForm', {
                                technicianId,
                                technicianName,
                                localId: s.location.id,
                                localName: s.location.name,
                              })}
                              activeOpacity={0.8}
                            >
                              <Ionicons name="add-circle-outline" size={16} color={colors.textInverse} style={{ marginRight: spacing.xs }} />
                              <Text style={styles.smallButtonText}>Crear informe</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
              </View>
              </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.actionsContainer}>
            <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => handleQuickAction('reports')}
                activeOpacity={0.8}
              >
                <Ionicons name="document-text-outline" size={24} color={colors.success} style={{ marginRight: spacing.md }} />
                <Text style={styles.actionText}>Mis Informes</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.recentActivity}>
            <Text style={styles.sectionTitle}>Actividad Reciente</Text>
            {reports.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="document-text-outline" size={48} color={colors.textTertiary} />
                <Text style={styles.emptyStateText}>No tienes informes aún</Text>
                <TouchableOpacity 
                  style={styles.createFirstReportButton}
                  onPress={() => navigation.navigate('InformeForm', {
                    technicianId,
                    technicianName,
                  })}
                  activeOpacity={0.8}
                >
                  <Text style={styles.createFirstReportText}>Crear mi primer informe</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.activityList}>
                {reports.slice(0, 3).map((report) => (
                  <View key={report.id} style={styles.activityItem}>
                    <Ionicons name="document-text-outline" size={20} color={colors.primary} style={{ marginRight: spacing.md }} />
                    <View style={styles.activityContent}>
                      <Text style={styles.activityText}>{report.title}</Text>
                      <Text style={styles.activityTime}>{formatDate(report.createdAt)}</Text>
                </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) }]}>
                      <Text style={styles.statusText}>{getStatusText(report.status)}</Text>
                </View>
              </View>
                ))}
                </View>
            )}
          </View>
        </ScrollView>
      </Animated.View>




    </View>
  );
};

const styles = StyleSheet.create({
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
  welcomeTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    fontSize: 20,
    fontWeight: '600',
  },
  welcomeSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 18,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statsContainer: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.sm,
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
  smallPrimaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
  },
  smallButtonText: {
    color: colors.textInverse,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  recentActivity: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  emptyStateText: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  createFirstReportButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    marginTop: spacing.sm,
  },
  createFirstReportText: {
    color: colors.textInverse,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  activityList: {
    gap: spacing.sm,
  },
  activityItem: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
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
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  activityTime: {
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 16,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 14,
    color: colors.textInverse,
  },



  // Estilos para títulos de sección y tarjetas de estadísticas
  sectionTitle: {
    ...typography.h5,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    fontSize: 16,
    fontWeight: '600',
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
});
