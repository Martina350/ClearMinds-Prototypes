import { getPreferences, getUser } from '@/storage/localDb';

export type Recommendation = { type: 'music'|'activity'|'quote'|'tip'; text: string };

// Mapeo de emociones a recomendaciones específicas
const EMOTION_RECOMMENDATIONS = {
  'Feliz': [
    { type: 'music' as const, text: 'Playlist de pop alegre, dance o reguetón ligero para mantener tu energía positiva' },
    { type: 'activity' as const, text: 'Comparte tu felicidad con amigos, escribe un recuerdo positivo' },
    { type: 'quote' as const, text: 'La felicidad no es algo que pospones para el futuro; es algo que diseñas para el presente' },
    { type: 'tip' as const, text: 'Haz algo que disfrutes y que potencie tu ánimo: baila, canta o sal a caminar' }
  ],
  'Triste': [
    { type: 'music' as const, text: 'Lo-fi, baladas suaves o indie acústico para acompañar tus emociones' },
    { type: 'activity' as const, text: 'Escribe lo que sientes, ve una película reconfortante o habla con alguien de confianza' },
    { type: 'quote' as const, text: 'Los días tristes son temporales, pero las lecciones que aprendemos son permanentes' },
    { type: 'tip' as const, text: 'Practica gratitud: piensa en 3 cosas buenas del día' }
  ],
  'Enojado': [
    { type: 'music' as const, text: 'Rock, rap o metal para liberar esa energía intensa' },
    { type: 'activity' as const, text: 'Ejercicio físico intenso: corre, salta o haz boxeo con sombra' },
    { type: 'quote' as const, text: 'La ira es una emoción válida, pero no dejes que controle tus acciones' },
    { type: 'tip' as const, text: 'Técnicas de respiración profunda o escribe lo que te molesta y luego rompe el papel' }
  ],
  'Tranquilo': [
    { type: 'music' as const, text: 'Instrumental relajante, jazz suave o sonidos de la naturaleza' },
    { type: 'activity' as const, text: 'Meditación guiada, lectura o yoga para mantener la calma' },
    { type: 'quote' as const, text: 'La tranquilidad es el estado natural de la mente cuando está en paz' },
    { type: 'tip' as const, text: 'Mantén este estado con una caminata lenta al aire libre' }
  ],
  'Neutral': [
    { type: 'music' as const, text: 'Playlists de "chill vibes" o "focus music" para el momento' },
    { type: 'activity' as const, text: 'Organiza tu día, escucha un podcast o prueba un hobby ligero' },
    { type: 'quote' as const, text: 'A veces el equilibrio es el mejor estado para tomar decisiones' },
    { type: 'tip' as const, text: 'Haz algo que pueda mejorar tu estado, como planear algo divertido' }
  ],
  'Cansado': [
    { type: 'music' as const, text: 'Acústico relajante o sonidos para dormir y descansar' },
    { type: 'activity' as const, text: 'Toma una siesta corta (20-30 min), bebe agua o haz estiramientos' },
    { type: 'quote' as const, text: 'El descanso no es un lujo, es una necesidad para tu bienestar' },
    { type: 'tip' as const, text: 'Prioriza el descanso y desconecta de pantallas por un rato' }
  ],
  'Cariñoso': [
    { type: 'music' as const, text: 'R&B suave, baladas románticas o acústico para el corazón' },
    { type: 'activity' as const, text: 'Envía un mensaje bonito a alguien, pasa tiempo con tu mascota o ve fotos familiares' },
    { type: 'quote' as const, text: 'El amor que das es el amor que recibes' },
    { type: 'tip' as const, text: 'Expresa cariño a alguien cercano o darte un pequeño auto-regalo' }
  ],
  'Estresado': [
    { type: 'music' as const, text: 'Música ambiental, clásica o binaural para relajación profunda' },
    { type: 'activity' as const, text: 'Técnicas de respiración, journaling o ejercicio ligero como yoga' },
    { type: 'quote' as const, text: 'El estrés es la respuesta del cuerpo a una demanda, no la demanda en sí' },
    { type: 'tip' as const, text: 'Divide tus pendientes en pasos pequeños y date pausas regulares' }
  ],
  'Confundido': [
    { type: 'music' as const, text: 'Lo-fi para concentración o sonidos instrumentales' },
    { type: 'activity' as const, text: 'Haz una lista de pros y contras, habla con alguien para aclarar dudas' },
    { type: 'quote' as const, text: 'La confusión es el primer paso hacia la claridad' },
    { type: 'tip' as const, text: 'Enfócate en una sola cosa a la vez y no te satures' }
  ]
};

export async function getRecommendationsForMood(mood: string): Promise<Recommendation[]> {
  // Buscar recomendaciones por el nombre de la emoción
  const emotionName = mood.replace(/[😀😺😿😾😌😐😴😻🙀❓]/g, '').trim();
  
  // Si encontramos recomendaciones específicas para esta emoción
  if (EMOTION_RECOMMENDATIONS[emotionName as keyof typeof EMOTION_RECOMMENDATIONS]) {
    return EMOTION_RECOMMENDATIONS[emotionName as keyof typeof EMOTION_RECOMMENDATIONS];
  }
  
  // Fallback: recomendaciones genéricas basadas en patrones de emojis
  if (/😀|😺|😊|😄/.test(mood)) {
    return EMOTION_RECOMMENDATIONS['Feliz'];
  }
  if (/😔|😢|😿|😞/.test(mood)) {
    return EMOTION_RECOMMENDATIONS['Triste'];
  }
  if (/😡|😾|🤬|😠/.test(mood)) {
    return EMOTION_RECOMMENDATIONS['Enojado'];
  }
  if (/😌|😌|😊/.test(mood)) {
    return EMOTION_RECOMMENDATIONS['Tranquilo'];
  }
  if (/😐|😑|😶/.test(mood)) {
    return EMOTION_RECOMMENDATIONS['Neutral'];
  }
  if (/😴|😪|😫/.test(mood)) {
    return EMOTION_RECOMMENDATIONS['Cansado'];
  }
  if (/😻|😍|🥰/.test(mood)) {
    return EMOTION_RECOMMENDATIONS['Cariñoso'];
  }
  if (/🙀|😰|😱/.test(mood)) {
    return EMOTION_RECOMMENDATIONS['Estresado'];
  }
  if (/❓|🤔|😕/.test(mood)) {
    return EMOTION_RECOMMENDATIONS['Confundido'];
  }
  
  // Recomendaciones por defecto
  return [
    { type: 'music' as const, text: 'Música relajante para acompañar tu momento' },
    { type: 'activity' as const, text: 'Toma un momento para respirar profundamente' },
    { type: 'quote' as const, text: 'Cada emoción es válida y temporal' },
    { type: 'tip' as const, text: 'Escucha a tu cuerpo y dale lo que necesita' }
  ];
}


