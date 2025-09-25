import AsyncStorage from '@react-native-async-storage/async-storage';

export type User = {
  email: string;
  name: string;
  age: number;
  password: string;
  personality: Record<string, string>;
};

export type MoodEntry = { date: number; mood: string; action?: string };

const KEYS = {
  user: 'user',
  history: 'history',
  preferences: 'preferences'
} as const;

export async function saveUser(user: User): Promise<void> {
  await AsyncStorage.setItem(KEYS.user, JSON.stringify(user));
}

export async function getUser(): Promise<User | null> {
  const raw = await AsyncStorage.getItem(KEYS.user);
  return raw ? JSON.parse(raw) : null;
}

export async function appendMood(entry: MoodEntry): Promise<void> {
  const raw = await AsyncStorage.getItem(KEYS.history);
  const arr: MoodEntry[] = raw ? JSON.parse(raw) : [];
  arr.push(entry);
  await AsyncStorage.setItem(KEYS.history, JSON.stringify(arr));
}

export async function getHistory(): Promise<MoodEntry[]> {
  const raw = await AsyncStorage.getItem(KEYS.history);
  return raw ? JSON.parse(raw) : [];
}

export async function savePreferences(prefs: Record<string, any>): Promise<void> {
  await AsyncStorage.setItem(KEYS.preferences, JSON.stringify(prefs));
}

export async function getPreferences<T = Record<string, any>>(): Promise<T | null> {
  const raw = await AsyncStorage.getItem(KEYS.preferences);
  return raw ? JSON.parse(raw) : null;
}


