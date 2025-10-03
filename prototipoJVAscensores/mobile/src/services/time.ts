// time.ts — utilidades de tiempo y formatos

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('es');
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
}

export function getCurrentISO(): string {
  return new Date().toISOString();
}