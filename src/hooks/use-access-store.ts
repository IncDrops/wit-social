
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AccessState {
  credits: number;
  passExpiresAt: string | null;
  accessType: 'pass' | 'credits' | null;
  hasAccess: () => boolean;
  useCredit: () => void;
  addCredits: (amount: number) => void;
  setAccessPass: (expiresAt: string, credits: number) => void;
}

export const useAccessStore = create<AccessState>()(
  persist(
    (set, get) => ({
      credits: 0,
      passExpiresAt: null,
      accessType: null,

      hasAccess: () => {
        const { credits, passExpiresAt, accessType } = get();
        if (accessType === 'pass') {
            if (passExpiresAt) {
                const now = new Date();
                const expiry = new Date(passExpiresAt);
                if (now < expiry) {
                    return credits > 0;
                } else {
                    // Pass has expired, clear it
                    set({ passExpiresAt: null, accessType: get().credits > 0 ? 'credits' : null, credits: 0 });
                    return false;
                }
            }
        }
        return credits > 0;
      },

      useCredit: () => {
        const { credits } = get();
        if (credits > 0) {
            set({ credits: credits - 1 });
            if (credits - 1 <= 0 && get().accessType !== 'pass') {
                set({ accessType: null });
            }
        }
      },

      addCredits: (amount: number) => {
        set((state) => ({ 
            credits: state.credits + amount,
            accessType: 'credits',
            passExpiresAt: null,
        }));
      },

      setAccessPass: (expiresAt: string, credits: number) => {
        set({ 
            passExpiresAt: expiresAt, 
            accessType: 'pass',
            credits: credits
        });
      },
    }),
    {
      name: 'wit-access-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
