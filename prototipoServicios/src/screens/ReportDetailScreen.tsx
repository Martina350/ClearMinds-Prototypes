import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Image, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ReportService, { Report } from '../services/ReportService';

interface Props {
  reportId: string;
  onBack: () => void;
  canEdit?: boolean;
  onEdit?: () => void;
}

export const ReportDetailScreen: React.FC<Props> = ({ reportId, onBack, canEdit = false, onEdit }) => {
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
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="chevron-back" size={24} color="#007BFF" />
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
            <Ionicons name="person-outline" size={16} color="#6C757D" />
            <Text style={styles.infoText}>Técnico: {report.technicianName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color="#6C757D" />
            <Text style={styles.infoText}>Creado: {formatDate(report.createdAt)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={16} color="#6C757D" />
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
              <Ionicons name="arrow-forward" size={20} color="#6C757D" />
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
        {!canEdit && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gestionar Estado</Text>
            <View style={styles.statusActions}>
              <TouchableOpacity
                style={[styles.statusButton, { backgroundColor: '#FFA500' }]}
                onPress={() => handleUpdateStatus('pending')}
                activeOpacity={0.8}
              >
                <Text style={styles.statusButtonText}>Pendiente</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.statusButton, { backgroundColor: '#007BFF' }]}
                onPress={() => handleUpdateStatus('in_review')}
                activeOpacity={0.8}
              >
                <Text style={styles.statusButtonText}>En Revisión</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.statusButton, { backgroundColor: '#28A745' }]}
                onPress={() => handleUpdateStatus('approved')}
                activeOpacity={0.8}
              >
                <Text style={styles.statusButtonText}>Aprobar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.statusButton, { backgroundColor: '#DC3545' }]}
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
                <Ionicons name="close" size={24} color="#fff" />
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
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6C757D',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#DC3545',
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6C757D',
    marginLeft: 8,
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
    color: '#6C757D',
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212529',
  },
  timeSeparator: {
    paddingHorizontal: 20,
  },
  descriptionText: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
  },
  photoSection: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  photoSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 12,
  },
  noPhotosText: {
    fontSize: 14,
    color: '#6C757D',
    fontStyle: 'italic',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  photoItem: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
  },
  photoThumbnail: {
    width: '100%',
    height: '100%',
  },
  statusActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  statusButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#007BFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '90%',
    height: '80%',
    overflow: 'hidden',
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
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
  },
  modalCloseButton: {
    padding: 8,
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
});
