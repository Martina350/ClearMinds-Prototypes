import { getPreferences, getUser } from '@/storage/localDb';

export type Recommendation = { type: 'music'|'exercise'|'quote'|'tip'; text: string };

export async function getRecommendationsForMood(mood: string): Promise<Recommendation[]> {
  const user = await getUser();
  const prefs = await getPreferences();

  const base: Recommendation[] = [
    { type: 'music', text: 'Playlist relajante para calmarte 🎧' },
    { type: 'exercise', text: '3 min de respiración profunda 🧘' },
    { type: 'quote', text: '“Esto también pasará.”' },
    { type: 'tip', text: 'Toma agua y estírate 💧' }
  ];

  if (user?.personality?.music === 'Clásica' || prefs?.music?.toLowerCase().includes('clásica')) {
    base[0] = { type:'music', text: 'Clásicos que reconfortan 🎼' };
  }
  if (/😡|🤬/.test(mood)) base.push({ type:'tip', text: 'Camina 5 minutos para descargar energía 🚶' });
  if (/😔|😢/.test(mood)) base.push({ type:'quote', text: 'Eres más fuerte de lo que crees 💪' });
  if (/🌈/.test(mood)) base.push({ type:'tip', text: 'Comparte tu ánimo con alguien 😊' });

  return base;
}


