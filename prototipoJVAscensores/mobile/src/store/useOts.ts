// useOts.ts — estado de OTs (programada, en curso, etc.)

import { create } from 'zustand';
import { OT } from '../services/mockApi';

interface OtsState {
  ots: OT[];
  setOts: (ots: OT[]) => void;
  updateOt: (ot: OT) => void;
}

export const useOts = create<OtsState>((set) => ({
  ots: [],
  setOts: (ots) => set({ ots }),
  updateOt: (ot) => set((state) => ({
    ots: state.ots.map(o => o.id === ot.id ? ot : o)
  })),
}));