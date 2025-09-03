import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Client {
  id: string;
  name: string;
  cedulaRuc: string;
  address: string;
  local: string;
  parroquia: string;
  createdAt: string;
  updatedAt: string;
}

type SubscriberFn = (clients: Client[]) => void;

class ClientService {
  private static instance: ClientService;
  private clients: Client[] = [];
  private subscribers: SubscriberFn[] = [];
  private readonly CLIENTS_KEY = 'maintenance_clients_v1';

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): ClientService {
    if (!ClientService.instance) {
      ClientService.instance = new ClientService();
    }
    return ClientService.instance;
  }

  private async loadFromStorage() {
    try {
      const stored = await AsyncStorage.getItem(this.CLIENTS_KEY);
      if (stored) {
        this.clients = JSON.parse(stored);
      }
      this.notifySubscribers();
    } catch (e) {
      console.error('Error loading clients:', e);
    }
  }

  private async saveToStorage() {
    try {
      await AsyncStorage.setItem(this.CLIENTS_KEY, JSON.stringify(this.clients));
    } catch (e) {
      console.error('Error saving clients:', e);
    }
  }

  private notifySubscribers() {
    const snapshot = [...this.clients];
    this.subscribers.forEach(cb => cb(snapshot));
  }

  public subscribe(callback: SubscriberFn): () => void {
    this.subscribers.push(callback);
    callback([...this.clients]);
    return () => {
      const idx = this.subscribers.indexOf(callback);
      if (idx >= 0) this.subscribers.splice(idx, 1);
    };
  }

  // CRUD operations
  public async createClient(clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
    const now = new Date().toISOString();
    const newClient: Client = {
      ...clientData,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
    };

    // Check if cedula/RUC already exists
    if (this.clients.some(c => c.cedulaRuc === clientData.cedulaRuc)) {
      throw new Error('Ya existe un cliente con esta cédula/RUC');
    }

    this.clients.push(newClient);
    await this.saveToStorage();
    this.notifySubscribers();
    return newClient;
  }

  public async updateClient(id: string, updates: Partial<Omit<Client, 'id' | 'createdAt'>>): Promise<Client | null> {
    const idx = this.clients.findIndex(c => c.id === id);
    if (idx === -1) return null;

    // Check if cedula/RUC already exists for another client
    if (updates.cedulaRuc && this.clients.some(c => c.cedulaRuc === updates.cedulaRuc && c.id !== id)) {
      throw new Error('Ya existe otro cliente con esta cédula/RUC');
    }

    this.clients[idx] = {
      ...this.clients[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await this.saveToStorage();
    this.notifySubscribers();
    return this.clients[idx];
  }

  public async deleteClient(id: string): Promise<boolean> {
    const idx = this.clients.findIndex(c => c.id === id);
    if (idx === -1) return false;

    this.clients.splice(idx, 1);
    await this.saveToStorage();
    this.notifySubscribers();
    return true;
  }

  public getClientById(id: string): Client | null {
    return this.clients.find(c => c.id === id) || null;
  }

  public getClientByCedulaRuc(cedulaRuc: string): Client | null {
    return this.clients.find(c => c.cedulaRuc === cedulaRuc) || null;
  }

  public getAllClients(): Client[] {
    return [...this.clients];
  }

  public searchClients(query: string): Client[] {
    const lowerQuery = query.toLowerCase();
    return this.clients.filter(client => 
      client.name.toLowerCase().includes(lowerQuery) ||
      client.cedulaRuc.includes(query) ||
      client.local.toLowerCase().includes(lowerQuery)
    );
  }

  public async clearAll(): Promise<void> {
    this.clients = [];
    await AsyncStorage.removeItem(this.CLIENTS_KEY);
    this.notifySubscribers();
  }
}

export default ClientService;
