'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PredictionState, User } from '@/types';

interface PredictionStore extends PredictionState {
  setUser: (user: User) => void;
  setGroupPick: (groupName: string, teamName: string) => void;
  setKnockoutPick: (round: 'r32Picks' | 'r16Picks' | 'qfPicks' | 'sfPicks', matchId: string, team: string) => void;
  setFinalPick: (team: string) => void;
  setSubmitted: () => void;
  reset: () => void;
}

const initialState: PredictionState = {
  user: null,
  groupPicks: {},
  r32Picks: {},
  r16Picks: {},
  qfPicks: {},
  sfPicks: {},
  finalPick: null,
  entryTime: null,
  submitted: false,
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
        } else if (picks.length < 2) {
          picks.push(teamName);
        } else {
          picks.shift();
          picks.push(teamName);
        }
        set({ groupPicks: { ...get().groupPicks, [groupName]: picks } });
      },

      setKnockoutPick: (round, matchId, team) => {
        set({ [round]: { ...get()[round], [matchId]: team } });
      },

      setFinalPick: (team) => set({ finalPick: team }),

      setSubmitted: () => set({ submitted: true }),

      reset: () => set(initialState),
    }),
    {
      name: 'pitchside-prediction',
    }
  )
);
