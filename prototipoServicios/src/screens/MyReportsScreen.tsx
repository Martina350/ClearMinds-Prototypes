import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ReportService, { Report } from '../services/ReportService';
import { ReportDetailScreen } from './ReportDetailScreen';
import { InformeForm } from './InformeForm';
import { colors, typography, spacing, borderRadius, shadows, baseStyles, componentStyles } from '../styles/theme';

type Props = {
  technicianId: string;
  technicianName: string;
  onBack: () => void;
};

export const MyReportsScreen: React.FC<Props> = ({ 
  technicianId, 
  technicianName, 
  onBack 
}) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showReportDetail, setShowReportDetail] = useState(false);
  const [showNewReport, setShowNewReport] = useState(false);
  const [editingReport, setEditingReport] = useState<Report | null>(null);

  useEffect(() => {
    loadReports();

    // Suscribirse a cambios en los informes
    const reportService = ReportService.getInstance();
    const unsubscribe = reportService.subscribe((allReports) => {
      const myReports = allReports.filter(report => report.technicianId === technicianId);
      setReports(myReports);
    });

    return unsubscribe;
  }, [technicianId]);

  const loadReports = async () => {
    try {
      const reportService = ReportService.getInstance();
      const myReports = await reportService.getReportsByTechnician(technicianId);
      setReports(myReports);
    } catch (error) {
      console.error('Error al cargar informes:', error);
      Alert.alert('Error', 'No se pudieron cargar los informes');
    }
  };

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setShowReportDetail(true);
  };

  const handleEditReport = (report: Report) => {
    if (report.status === 'approved' || report.status === 'rejected') {
      Alert.alert(
        'No se puede editar', 
        'No puedes editar un informe que ya ha sido aprobado o rechazado'
      );
      return;
    }
    setEditingReport(report);
    setShowNewReport(true);
  };

  const handleNewReport = () => {
    setEditingReport(null);
    setShowNewReport(true);
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
      default: return colors.gray500;
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

  const canEditReport = (report: Report) => {
    return report.status === 'pending' || report.status === 'in_review';
  };

  return (
    <View style={baseStyles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8}>
          <Ionicons name="chevron-back" size={18} color={colors.textPrimary} style={{ marginRight: spacing.xs }} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Mis Informes</Text>
          <Text style={styles.subtitle}>{technicianName}</Text>
        </View>
        <TouchableOpacity style={styles.newReportButton} onPress={handleNewReport} activeOpacity={0.8}>
          <Ionicons name="add" size={20} color={colors.textInverse} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.reportsSection}>
          <Text style={baseStyles.sectionTitle}>Informes Recientes</Text>
          
          {reports.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={48} color={colors.gray400} />
              <Text style={styles.emptyStateText}>No tienes informes aún</Text>
              <TouchableOpacity 
                style={styles.createFirstReportButton}
                onPress={handleNewReport}
                activeOpacity={0.8}
              >
                <Text style={styles.createFirstReportText}>Crear mi primer informe</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.reportsList}>
              {reports.map((report) => (
                <View key={report.id} style={styles.reportItem}>
                  <View style={styles.reportHeader}>
                    <View style={styles.reportInfo}>
                      <Text style={styles.reportTitle}>{report.title}</Text>
                      <Text style={styles.reportDate}>{formatDate(report.createdAt)}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) }]}>
                      <Text style={styles.statusText}>{getStatusText(report.status)}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.reportActions}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleViewReport(report)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="eye-outline" size={16} color={colors.primary} />
                      <Text style={styles.actionButtonText}>Ver</Text>
                    </TouchableOpacity>
                    
                    {canEditReport(report) && (
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handleEditReport(report)}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="create-outline" size={16} color={colors.warning} />
                        <Text style={[styles.actionButtonText, { color: colors.warning }]}>Editar</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal de Detalle de Informe */}
      {showReportDetail && selectedReport && (
        <Modal
          visible={showReportDetail}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowReportDetail(false)}
        >
          <View style={baseStyles.modalOverlay}>
            <View style={styles.modalContent}>
              <ReportDetailScreen
                reportId={selectedReport.id}
                onBack={() => setShowReportDetail(false)}
                onEdit={() => {
                  setShowReportDetail(false);
                  handleEditReport(selectedReport);
                }}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Modal de Nuevo/Editar Informe */}
      {showNewReport && (
        <Modal
          visible={showNewReport}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowNewReport(false)}
        >
          <View style={baseStyles.modalOverlay}>
            <View style={styles.modalContent}>
              <InformeForm
                onBack={() => setShowNewReport(false)}
                technicianId={technicianId}
                technicianName={technicianName}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadows.sm,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.bodyXSmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  newReportButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.full,
    ...shadows.md,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  reportsSection: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyStateText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  createFirstReportButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    marginTop: spacing.lg,
    ...shadows.md,
  },
  createFirstReportText: {
    color: colors.textInverse,
    ...typography.buttonSmall,
  },
  reportsList: {
    gap: spacing.md,
  },
  reportItem: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.sm,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  reportInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  reportTitle: {
    ...typography.h6,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  reportDate: {
    ...typography.bodyXSmall,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.lg,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: colors.textInverse,
    ...typography.labelSmall,
    fontWeight: '600',
  },
  reportActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray50,
    gap: spacing.xs,
  },
  actionButtonText: {
    ...typography.labelSmall,
    fontWeight: '600',
    color: colors.primary,
  },
  modalContent: {
    flex: 1,
    backgroundColor: colors.surface,
  },
});
