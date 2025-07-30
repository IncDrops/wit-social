
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AccessState {
  credits: number;
  passToken: string | null;
  passExpiresAt: string | null;
  accessType: 'pass' | 'credits' | null;
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
      accessType: null,

      hasAccess: () => {
        const { credits, passToken, passExpiresAt } = get();
        if (credits > 0) return true;
        if (passToken && passExpiresAt) {
          const now = new Date();
          const expiry = new Date(passExpiresAt);
          if (now < expiry) {
            return true;
          } else {
            // Pass has expired, clear it
            set({ passToken: null, passExpiresAt: null, accessType: get().credits > 0 ? 'credits' : null });
            return false;
          }
        }
        return false;
      },

      useCredit: () => {
        const { accessType, credits } = get();
        if (accessType === 'credits' && credits > 0) {
            set({ credits: credits - 1 });
            if (credits - 1 <= 0) {
                set({ accessType: null });
            }
        }
      },

      addCredits: (amount: number) => {
        set((state) => ({ 
            credits: state.credits + amount,
            accessType: 'credits',
            passToken: null, // Clear pass when buying credits
            passExpiresAt: null,
        }));
      },

      setAccessPass: (token: string, expiresAt: string) => {
        set({ 
            passToken: token, 
            passExpiresAt: expiresAt, 
            accessType: 'pass',
            credits: 0 // Clear credits when buying a pass
        });
      },
    }),
    {
      name: 'wit-access-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
