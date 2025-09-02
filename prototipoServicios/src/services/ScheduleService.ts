import AsyncStorage from '@react-native-async-storage/async-storage';

export type ChecklistState = 'pending' | 'done' | 'not_done';

export interface LocalSite {
  id: string;
  name: string;
  address: string;
  clientName: string;
}

export interface ScheduleTask {
  id: string;
  description: string;
}

export interface ScheduleItem {
  id: string;
  date: string; // YYYY-MM-DD
  teamName: string;
  location: LocalSite;
  technicianIds: string[]; // equipo asignado
  tasks: ScheduleTask[]; // actividades a realizar en el local
}

export interface TechnicianChecklistEntry {
  scheduleItemId: string;
  technicianId: string;
  status: ChecklistState;
  updatedAt: string;
}

type SubscriberFn = (data: {
  schedules: ScheduleItem[];
  checklist: TechnicianChecklistEntry[];
}) => void;

class ScheduleService {
  private static instance: ScheduleService;
  private schedules: ScheduleItem[] = [];
  private checklist: TechnicianChecklistEntry[] = [];
  private subscribers: SubscriberFn[] = [];
  private readonly SCHEDULES_KEY = 'maintenance_schedules_v1';
  private readonly CHECKLIST_KEY = 'maintenance_checklist_v1';

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): ScheduleService {
    if (!ScheduleService.instance) {
      ScheduleService.instance = new ScheduleService();
    }
    return ScheduleService.instance;
  }

  private async loadFromStorage() {
    try {
      const [s, c] = await Promise.all([
        AsyncStorage.getItem(this.SCHEDULES_KEY),
        AsyncStorage.getItem(this.CHECKLIST_KEY),
      ]);
      if (s) this.schedules = JSON.parse(s);
      if (c) this.checklist = JSON.parse(c);
      this.notifySubscribers();
    } catch (e) {
      // noop
    }
  }

  private async saveSchedules() {
    await AsyncStorage.setItem(this.SCHEDULES_KEY, JSON.stringify(this.schedules));
  }

  private async saveChecklist() {
    await AsyncStorage.setItem(this.CHECKLIST_KEY, JSON.stringify(this.checklist));
  }

  private notifySubscribers() {
    const snapshot = { schedules: [...this.schedules], checklist: [...this.checklist] };
    this.subscribers.forEach(cb => cb(snapshot));
  }

  public subscribe(callback: SubscriberFn): () => void {
    this.subscribers.push(callback);
    callback({ schedules: [...this.schedules], checklist: [...this.checklist] });
    return () => {
      const idx = this.subscribers.indexOf(callback);
      if (idx >= 0) this.subscribers.splice(idx, 1);
    };
  }

  // CRUD de cronogramas
  public async addSchedule(item: Omit<ScheduleItem, 'id'>): Promise<ScheduleItem> {
    const newItem: ScheduleItem = { ...item, id: Date.now().toString() };
    // Regla: máximo 4 locales por día
    const countForDay = this.schedules.filter(s => s.date === newItem.date).length;
    if (countForDay >= 4) {
      throw new Error('Máximo de 4 locales por día.');
    }
    this.schedules.push(newItem);
    await this.saveSchedules();
    this.notifySubscribers();
    return newItem;
  }

  public async updateSchedule(id: string, updates: Partial<ScheduleItem>): Promise<ScheduleItem | null> {
    const idx = this.schedules.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.schedules[idx] = { ...this.schedules[idx], ...updates };
    await this.saveSchedules();
    this.notifySubscribers();
    return this.schedules[idx];
  }

  public async deleteSchedule(id: string): Promise<boolean> {
    const idx = this.schedules.findIndex(s => s.id === id);
    if (idx === -1) return false;
    this.schedules.splice(idx, 1);
    await this.saveSchedules();
    this.notifySubscribers();
    return true;
  }

  public getSchedulesByDate(date: string): ScheduleItem[] {
    return this.schedules.filter(s => s.date === date);
  }

  public getSchedulesByTechnicianAndDate(technicianId: string, date: string): ScheduleItem[] {
    return this.schedules.filter(s => s.date === date && s.technicianIds.includes(technicianId));
  }

  public getAllLocales(): LocalSite[] {
    const map: { [id: string]: LocalSite } = {};
    this.schedules.forEach(s => { map[s.location.id] = s.location; });
    return Object.values(map);
  }

  public getSchedulesByLocal(localId: string): ScheduleItem[] {
    return this.schedules.filter(s => s.location.id === localId);
  }

  // Checklist por técnico
  public async setChecklistStatus(scheduleItemId: string, technicianId: string, status: ChecklistState) {
    const existingIdx = this.checklist.findIndex(c => c.scheduleItemId === scheduleItemId && c.technicianId === technicianId);
    const entry: TechnicianChecklistEntry = {
      scheduleItemId,
      technicianId,
      status,
      updatedAt: new Date().toISOString(),
    };
    if (existingIdx >= 0) this.checklist[existingIdx] = entry; else this.checklist.push(entry);
    await this.saveChecklist();
    this.notifySubscribers();
  }

  public getChecklistStatus(scheduleItemId: string, technicianId: string): ChecklistState {
    const entry = this.checklist.find(c => c.scheduleItemId === scheduleItemId && c.technicianId === technicianId);
    return entry?.status ?? 'pending';
  }

  public async clearAll() {
    this.schedules = [];
    this.checklist = [];
    await Promise.all([
      AsyncStorage.removeItem(this.SCHEDULES_KEY),
      AsyncStorage.removeItem(this.CHECKLIST_KEY),
    ]);
    this.notifySubscribers();
  }
}

export default ScheduleService;


