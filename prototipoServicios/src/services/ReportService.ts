import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Report {
  id: string;
  technicianId: string;
  technicianName: string;
  // Asociación con Local (opcional para compatibilidad retro)
  localId?: string;
  localName?: string;
  title: string;
  checkInTime: string;
  checkOutTime: string;
  description: string;
  photoBeforeUris: string[];
  photoAfterUris: string[];
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

class ReportService {
  private static instance: ReportService;
  private reports: Report[] = [];
  private subscribers: ((reports: Report[]) => void)[] = [];
  private readonly STORAGE_KEY = 'maintenance_reports';

  private constructor() {
    this.loadReportsFromStorage();
    
    // Agregar un informe de prueba si no hay informes
    setTimeout(async () => {
      if (this.reports.length === 0) {
        const testReport = {
          technicianId: '1',
          technicianName: 'Juan Pérez',
          title: 'Mantenimiento A/C - Edificio A',
          checkInTime: '08:00',
          checkOutTime: '10:00',
          description: 'Se realizó mantenimiento preventivo al sistema de aire acondicionado del edificio A. Se limpiaron filtros, se verificó el funcionamiento del compresor y se ajustaron los controles de temperatura.',
          photoBeforeUris: ['https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Antes'],
          photoAfterUris: ['https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Después'],
          status: 'pending' as const,
        };
        
        await this.createReport(testReport);
      }
    }, 1000);
  }

  public static getInstance(): ReportService {
    if (!ReportService.instance) {
      ReportService.instance = new ReportService();
    }
    return ReportService.instance;
  }

  private async loadReportsFromStorage() {
    try {
      const storedReports = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (storedReports) {
        this.reports = JSON.parse(storedReports);
        this.notifySubscribers();
      }
    } catch (error) {
      console.error('Error loading reports from storage:', error);
    }
  }

  private async saveReportsToStorage() {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.reports));
    } catch (error) {
      console.error('Error saving reports to storage:', error);
    }
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => callback([...this.reports]));
  }

  public subscribe(callback: (reports: Report[]) => void): () => void {
    this.subscribers.push(callback);
    // Ejecutar callback inmediatamente con los datos actuales
    callback([...this.reports]);
    
    // Retornar función para desuscribirse
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  public async createReport(reportData: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>): Promise<Report> {
    const newReport: Report = {
      ...reportData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.reports.push(newReport);
    await this.saveReportsToStorage();
    this.notifySubscribers();
    
    return newReport;
  }

  public async updateReport(reportId: string, updates: Partial<Report>): Promise<Report | null> {
    const index = this.reports.findIndex(report => report.id === reportId);
    if (index === -1) return null;

    this.reports[index] = {
      ...this.reports[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await this.saveReportsToStorage();
    this.notifySubscribers();
    
    return this.reports[index];
  }

  public async updateReportStatus(reportId: string, status: Report['status']): Promise<Report | null> {
    return this.updateReport(reportId, { status });
  }

  public async deleteReport(reportId: string): Promise<boolean> {
    const index = this.reports.findIndex(report => report.id === reportId);
    if (index === -1) return false;

    this.reports.splice(index, 1);
    await this.saveReportsToStorage();
    this.notifySubscribers();
    
    return true;
  }

  public async getReportById(reportId: string): Promise<Report | null> {
    return this.reports.find(report => report.id === reportId) || null;
  }

  public async getAllReports(): Promise<Report[]> {
    return [...this.reports];
  }

  public async getReportsByTechnician(technicianId: string): Promise<Report[]> {
    return this.reports.filter(report => report.technicianId === technicianId);
  }

  public async getReportsByStatus(status: Report['status']): Promise<Report[]> {
    return this.reports.filter(report => report.status === status);
  }

  public async getPendingReports(): Promise<Report[]> {
    return this.getReportsByStatus('pending');
  }

  public async getApprovedReports(): Promise<Report[]> {
    return this.getReportsByStatus('approved');
  }

  public async getRejectedReports(): Promise<Report[]> {
    return this.getReportsByStatus('rejected');
  }

  public async getReportsInReview(): Promise<Report[]> {
    return this.getReportsByStatus('in_review');
  }

  public async clearAllReports(): Promise<void> {
    this.reports = [];
    await AsyncStorage.removeItem(this.STORAGE_KEY);
    this.notifySubscribers();
  }

  public getReportsCount(): number {
    return this.reports.length;
  }

  public getReportsCountByStatus(status: Report['status']): number {
    return this.reports.filter(report => report.status === status).length;
  }

  public getReportsCountByTechnician(technicianId: string): number {
    return this.reports.filter(report => report.technicianId === technicianId).length;
  }
}

export default ReportService;
