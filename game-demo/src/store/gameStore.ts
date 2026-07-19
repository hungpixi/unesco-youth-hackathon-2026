import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { db } from './db';

interface GameState {
  trust: number;
  stress: number;
  viral: number;
  currentChapter: string;
  currentNode: string;
  choiceHistory: string[];
  isEvidenceSaved: boolean;
  
  updateStat: (stat: 'trust' | 'stress' | 'viral', amount: number) => void;
  makeChoice: (choiceId: string, nextNode: string) => void;
  setChapter: (chapterId: string, startNode: string) => void;
  saveEvidence: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      trust: 50,
      stress: 20,
      viral: 20,
      currentChapter: 'prologue',
      currentNode: 'start',
      choiceHistory: [],
      isEvidenceSaved: false,

      updateStat: (stat, amount) => 
        set((state) => ({ [stat]: Math.max(0, Math.min(100, state[stat] + amount)) })),
      
      makeChoice: (choiceId, nextNode) =>
        set((state) => ({
          choiceHistory: [...state.choiceHistory, choiceId],
          currentNode: nextNode
        })),

      setChapter: (chapterId, startNode) =>
        set({ currentChapter: chapterId, currentNode: startNode }),

      saveEvidence: () => set({ isEvidenceSaved: true }),

      resetGame: () => set({
        trust: 50,
        stress: 20,
        viral: 20,
        currentChapter: 'prologue',
        currentNode: 'start',
        choiceHistory: [],
        isEvidenceSaved: false
      })
    }),
    {
      name: 'echoshield-state-store',
      storage: createJSONStorage(() => ({
        getItem: async (name) => {
          try {
            const record = await db.store.get(name);
            return record?.value ?? null;
          } catch {
            return null;
          }
        },
        setItem: async (name, value) => {
          try {
            await db.store.put({ key: name, value });
          } catch (e) {
            console.error(e);
          }
        },
        removeItem: async (name) => {
          try {
            await db.store.delete(name);
          } catch (e) {
            console.error(e);
          }
        }
      }))
    }
  )
);
