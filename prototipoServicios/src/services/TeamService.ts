import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Team {
  id: string;
  name: string;
  description?: string;
  technicianIds: string[];
  createdAt: string;
  updatedAt: string;
}

type SubscriberFn = (teams: Team[]) => void;

class TeamService {
  private static instance: TeamService;
  private teams: Team[] = [];
  private subscribers: SubscriberFn[] = [];
  private readonly TEAMS_KEY = 'maintenance_teams_v1';

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): TeamService {
    if (!TeamService.instance) {
      TeamService.instance = new TeamService();
    }
    return TeamService.instance;
  }

  private async loadFromStorage() {
    try {
      const stored = await AsyncStorage.getItem(this.TEAMS_KEY);
      if (stored) {
        this.teams = JSON.parse(stored);
      }
      this.notifySubscribers();
    } catch (e) {
      console.error('Error loading teams:', e);
    }
  }

  private async saveToStorage() {
    try {
      await AsyncStorage.setItem(this.TEAMS_KEY, JSON.stringify(this.teams));
    } catch (e) {
      console.error('Error saving teams:', e);
    }
  }

  private notifySubscribers() {
    const snapshot = [...this.teams];
    this.subscribers.forEach(cb => cb(snapshot));
  }

  public subscribe(callback: SubscriberFn): () => void {
    this.subscribers.push(callback);
    callback([...this.teams]);
    return () => {
      const idx = this.subscribers.indexOf(callback);
      if (idx >= 0) this.subscribers.splice(idx, 1);
    };
  }

  // CRUD operations
  public async createTeam(teamData: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>): Promise<Team> {
    const now = new Date().toISOString();
    const newTeam: Team = {
      ...teamData,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
    };

    // Check if team name already exists
    if (this.teams.some(t => t.name.toLowerCase() === teamData.name.toLowerCase())) {
      throw new Error('Ya existe un equipo con este nombre');
    }

    this.teams.push(newTeam);
    await this.saveToStorage();
    this.notifySubscribers();
    return newTeam;
  }

  public async updateTeam(id: string, updates: Partial<Omit<Team, 'id' | 'createdAt'>>): Promise<Team | null> {
    const idx = this.teams.findIndex(t => t.id === id);
    if (idx === -1) return null;

    // Check if team name already exists for another team
    if (updates.name && this.teams.some(t => t.name.toLowerCase() === updates.name.toLowerCase() && t.id !== id)) {
      throw new Error('Ya existe otro equipo con este nombre');
    }

    this.teams[idx] = {
      ...this.teams[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await this.saveToStorage();
    this.notifySubscribers();
    return this.teams[idx];
  }

  public async deleteTeam(id: string): Promise<boolean> {
    const idx = this.teams.findIndex(t => t.id === id);
    if (idx === -1) return false;

    this.teams.splice(idx, 1);
    await this.saveToStorage();
    this.notifySubscribers();
    return true;
  }

  public getTeamById(id: string): Team | null {
    return this.teams.find(t => t.id === id) || null;
  }

  public getTeamByName(name: string): Team | null {
    return this.teams.find(t => t.name.toLowerCase() === name.toLowerCase()) || null;
  }

  public getAllTeams(): Team[] {
    return [...this.teams];
  }

  public getTeamsByTechnician(technicianId: string): Team[] {
    return this.teams.filter(t => t.technicianIds.includes(technicianId));
  }

  public async addTechnicianToTeam(teamId: string, technicianId: string): Promise<boolean> {
    const team = this.getTeamById(teamId);
    if (!team) return false;

    if (!team.technicianIds.includes(technicianId)) {
      team.technicianIds.push(technicianId);
      team.updatedAt = new Date().toISOString();
      await this.saveToStorage();
      this.notifySubscribers();
    }

    return true;
  }

  public async removeTechnicianFromTeam(teamId: string, technicianId: string): Promise<boolean> {
    const team = this.getTeamById(teamId);
    if (!team) return false;

    const idx = team.technicianIds.indexOf(technicianId);
    if (idx >= 0) {
      team.technicianIds.splice(idx, 1);
      team.updatedAt = new Date().toISOString();
      await this.saveToStorage();
      this.notifySubscribers();
    }

    return true;
  }

  public async clearAll(): Promise<void> {
    this.teams = [];
    await AsyncStorage.removeItem(this.TEAMS_KEY);
    this.notifySubscribers();
  }
}

export default TeamService;
