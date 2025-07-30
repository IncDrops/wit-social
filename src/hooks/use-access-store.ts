
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AccessState {
  credits: number;
  passToken: string | null;
  passExpiresAt: string | null;
  hasAccess: () => boolean;
  useCredit: () => void;
  addCredits: (amount: number) => void;
  setAccessPass: (token: string, expiresAt: string) => void;
}

export const useAccessStore = create<AccessState>()(
  persist(
    (set, get) => ({
      credits: 0,
      passToken: null,
      passExpiresAt: null,

      hasAccess: () => {
        const { credits, passToken, passExpiresAt } = get();
        if (credits > 0) return true;
        if (passToken && passExpiresAt) {
          const now = new Date();
          const expiry = new Date(passExpiresAt);
          return now < expiry;
        }
        return false;
      },

      useCredit: () => {
        set((state) => ({ credits: Math.max(0, state.credits - 1) }));
      },

      addCredits: (amount: number) => {
        set((state) => ({ credits: state.credits + amount }));
      },

      setAccessPass: (token: string, expiresAt: string) => {
        set({ passToken: token, passExpiresAt: expiresAt, credits: 0 });
      },
    }),
    {
      name: 'wit-access-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
