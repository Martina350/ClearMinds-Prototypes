import React, { createContext, useContext, useMemo, useReducer, useState } from 'react';
import { InMemoryQueue, QueueItem } from '../../application/sync/queue';
import { createEmergencyOt, reorderRouteByIdFirst } from '../../infra/mock/mockApi';

export type AppEvent =
  | { type: 'CHECK_IN'; otId: string; lat: number; lon: number; accuracy?: number; overrideReason?: string }
  | { type: 'CHECK_OUT'; otId: string; lat: number; lon: number; accuracy?: number }
  | { type: 'CHECKLIST_SAVE'; otId: string; values: Record<string, any> }
  | { type: 'SIGNATURE_SAVE'; otId: string; name: string; dataUrl: string }
  | { type: 'CLOSE_OT'; otId: string }
  | { type: 'EMERGENCIA'; otId: string };

interface AppStateValue {
  queue: InMemoryQueue;
  dispatchEvent: (e: AppEvent) => void;
  getQueue: () => QueueItem[];
  // emergencias y reprogramaciones
  banner: { type: 'EMERGENCIA' | 'REPROG'; message: string } | null;
  clearBanner: () => void;
  triggerEmergency: () => string; // devuelve otId de emergencia
  triggerReprogram: (otId: string) => void;
  // tema
  isDark: boolean;
  toggleTheme: () => void;
}

const AppStateCtx = createContext<AppStateValue | undefined>(undefined);

function reducer(queue: InMemoryQueue, e: AppEvent): InMemoryQueue {
  switch (e.type) {
    case 'CHECK_IN':
      queue.enqueue({ id: `qin-${Date.now()}`, kind: 'CHECK_IN_OUT', payload: e });
      return queue;
    case 'CHECK_OUT':
      queue.enqueue({ id: `qout-${Date.now()}`, kind: 'CHECK_IN_OUT', payload: e });
      return queue;
    case 'CHECKLIST_SAVE':
      queue.enqueue({ id: `qlist-${Date.now()}`, kind: 'CHECKLIST', payload: e });
      return queue;
    case 'SIGNATURE_SAVE':
      queue.enqueue({ id: `qsig-${Date.now()}`, kind: 'FIRMAS_FOTOS', payload: e });
      return queue;
    case 'CLOSE_OT':
      queue.enqueue({ id: `qclose-${Date.now()}`, kind: 'CIERRE_OT', payload: e });
      return queue;
    case 'EMERGENCIA':
      queue.enqueue({ id: `qeme-${Date.now()}`, kind: 'EMERGENCIA', payload: e });
      return queue;
    default:
      return queue;
  }
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const queue = useMemo(() => new InMemoryQueue(), []);
  const [_, force] = useReducer((x: number) => x + 1, 0);
  const [banner, setBanner] = useState<AppStateValue['banner']>(null);
  const [isDark, setIsDark] = useState(false);

  const dispatchEvent = (e: AppEvent) => {
    reducer(queue, e);
    force(0);
  };

  const triggerEmergency = () => {
    const ot = createEmergencyOt();
    setBanner({ type: 'EMERGENCIA', message: `EMERGENCIA asignada: ${ot.id}` });
    dispatchEvent({ type: 'EMERGENCIA', otId: ot.id });
    return ot.id;
  };

  const triggerReprogram = (otId: string) => {
    reorderRouteByIdFirst(otId);
    setBanner({ type: 'REPROG', message: `OT reprogramada priorizada: ${otId}` });
  };

  const value: AppStateValue = {
    queue,
    dispatchEvent,
    getQueue: () => queue.snapshot(),
    banner,
    clearBanner: () => setBanner(null),
    triggerEmergency,
    triggerReprogram,
    isDark,
    toggleTheme: () => setIsDark((v) => !v)
  };

  return <AppStateCtx.Provider value={value}>{children}</AppStateCtx.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateCtx);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
