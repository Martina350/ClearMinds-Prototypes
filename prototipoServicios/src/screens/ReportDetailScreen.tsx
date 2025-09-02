import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Image, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ReportService, { Report } from '../services/ReportService';
import { colors, typography, spacing, borderRadius, shadows, baseStyles } from '../styles/theme';

interface Props {
  reportId: string;
  onBack: () => void;
  showStatusActions?: boolean;
  onEdit?: () => void;
}

export const ReportDetailScreen: React.FC<Props> = ({ reportId, onBack, showStatusActions = false, onEdit }) => {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');

  useEffect(() => {
    loadReport();
  }, [reportId]);

  const loadReport = async () => {
    try {
      setLoading(true);
      const reportService = ReportService.getInstance();
      const reportData = await reportService.getReportById(reportId);
      setReport(reportData);
    } catch (error) {
      console.error('Error loading report:', error);
      Alert.alert('Error', 'No se pudo cargar el informe');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: Report['status']) => {
    if (!report) return;

    try {
      const reportService = ReportService.getInstance();
      await reportService.updateReportStatus(reportId, newStatus);
      
      // Recargar el informe actualizado
      await loadReport();
      
      Alert.alert('Éxito', `Estado del informe actualizado a: ${getStatusText(newStatus)}`);
    } catch (error) {
      console.error('Error updating report status:', error);
      Alert.alert('Error', 'No se pudo actualizar el estado del informe');
    }
  };

  const handleImagePreview = (uri: string) => {
    setPreviewImage(uri);
    setShowImagePreview(true);
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

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
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
              <Image source={{ uri }} style={styles.photoThumbnail} />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando informe...</Text>
      </View>
    );
  }

  if (!report) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se encontró el informe</Text>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={baseStyles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="chevron-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalle del Informe</Text>
          <View style={styles.statusBadge}>
            <Text style={[styles.statusText, { color: getStatusColor(report.status) }]}>
              {getStatusText(report.status)}
            </Text>
          </View>
        </View>

        {/* Información básica */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{report.title}</Text>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.infoText}>Técnico: {report.technicianName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.infoText}>Creado: {formatDate(report.createdAt)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.infoText}>Actualizado: {formatDate(report.updatedAt)}</Text>
          </View>
        </View>

        {/* Horarios */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horarios de Trabajo</Text>
          <View style={styles.timeContainer}>
            <View style={styles.timeItem}>
              <Text style={styles.timeLabel}>Entrada</Text>
              <Text style={styles.timeValue}>{formatTime(report.checkInTime)}</Text>
            </View>
            <View style={styles.timeSeparator}>
              <Ionicons name="arrow-forward" size={20} color={colors.textSecondary} />
            </View>
            <View style={styles.timeItem}>
              <Text style={styles.timeLabel}>Salida</Text>
              <Text style={styles.timeValue}>{formatTime(report.checkOutTime)}</Text>
            </View>
          </View>
        </View>

        {/* Descripción */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción del Trabajo</Text>
          <Text style={styles.descriptionText}>{report.description}</Text>
        </View>

        {/* Fotos */}
        {renderPhotoSection('Fotos Antes', report.photoBeforeUris)}
        {renderPhotoSection('Fotos Después', report.photoAfterUris)}

        {/* Acciones del administrador */}
        {showStatusActions && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gestionar Estado</Text>
            <View style={styles.statusActions}>
              <TouchableOpacity
                style={[styles.statusButton, { backgroundColor: colors.warning }]}
                onPress={() => handleUpdateStatus('pending')}
                activeOpacity={0.8}
              >
                <Text style={styles.statusButtonText}>Pendiente</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.statusButton, { backgroundColor: colors.primary }]}
                onPress={() => handleUpdateStatus('in_review')}
                activeOpacity={0.8}
              >
                <Text style={styles.statusButtonText}>En Revisión</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.statusButton, { backgroundColor: colors.success }]}
                onPress={() => handleUpdateStatus('approved')}
                activeOpacity={0.8}
              >
                <Text style={styles.statusButtonText}>Aprobar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.statusButton, { backgroundColor: colors.error }]}
                onPress={() => handleUpdateStatus('rejected')}
                activeOpacity={0.8}
              >
                <Text style={styles.statusButtonText}>Rechazar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Modal de vista previa de imagen */}
      <Modal
        visible={showImagePreview}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImagePreview(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Vista previa</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowImagePreview(false)}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={24} color={colors.textInverse} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalImageContainer}>
              <Image source={{ uri: previewImage }} style={styles.modalImage} resizeMode="contain" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadows.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    color: colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceSecondary,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  section: {
    backgroundColor: colors.surface,
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    color: colors.textPrimary,
    marginBottom: spacing.md,
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
    backgroundColor: colors.surface,
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
  backButton: {
    padding: spacing.sm,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    width: '90%',
    height: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    color: colors.textPrimary,
  },
  modalCloseButton: {
    padding: spacing.sm,
  },
  modalImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: colors.error,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
