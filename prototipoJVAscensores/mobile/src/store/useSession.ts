// useSession.ts — técnico logueado simulado

import { create } from 'zustand';

interface SessionState {
  tecnicoId: string | null;
  setTecnico: (id: string) => void;
}

export const useSession = create<SessionState>((set) => ({
  tecnicoId: 'tec-1', // simulado
  setTecnico: (id) => set({ tecnicoId: id }),
}));