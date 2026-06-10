'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PredictionState, User } from '@/types';

interface PredictionStore extends PredictionState {
  setUser: (user: User) => void;
  setGroupPick: (groupName: string, teamName: string) => void;
  setThirdPick: (teamName: string) => void;
  setKnockoutPick: (round: 'r32Picks' | 'r16Picks' | 'qfPicks' | 'sfPicks', matchId: string, team: string) => void;
  setFinalPick: (team: string) => void;
  setFingerprint: (id: string) => void;
  setSubmitted: () => void;
  reset: () => void;
}

const initialState: PredictionState = {
  user: null,
  groupPicks: {},
  thirdPicks: [],
  r32Picks: {},
  r16Picks: {},
  qfPicks: {},
  sfPicks: {},
  finalPick: null,
  entryTime: null,
  submitted: false,
  fingerprint: null,
};

export const usePredictionStore = create<PredictionStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUser: (user) =>
        set({ user, entryTime: new Date().toISOString() }),

      setGroupPick: (groupName, teamName) => {
        const picks = [...(get().groupPicks[groupName] || [])];
        const idx = picks.indexOf(teamName);
        if (idx > -1) {
          picks.splice(idx, 1);
        } else if (picks.length < 3) {
          picks.push(teamName);
        } else {
          picks.shift();
          picks.push(teamName);
        }
        set({ groupPicks: { ...get().groupPicks, [groupName]: picks } });
      },

      setThirdPick: (teamName) => {
        const current = get().thirdPicks;
        const idx = current.indexOf(teamName);
        if (idx > -1) {
          set({ thirdPicks: current.filter((t) => t !== teamName) });
        } else if (current.length < 8) {
          set({ thirdPicks: [...current, teamName] });
        }
      },

      setKnockoutPick: (round, matchId, team) => {
        set({ [round]: { ...get()[round], [matchId]: team } });
      },

      setFinalPick: (team) => set({ finalPick: team }),

      setFingerprint: (id) => set({ fingerprint: id }),

      setSubmitted: () => set({ submitted: true }),

      reset: () => set(initialState),
    }),
    {
      name: 'pitchside-prediction',
    }
  )
);
