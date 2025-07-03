import { User } from "@/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
  user: User | null;
  hasHydrated: boolean;
  setUser: (user: User) => void;
  logoutUser: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      hasHydrated: false,
      setUser: (user) => set({ user }),
      logoutUser: () => set({ user: null }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "blog-user",
      onRehydrateStorage: () => () => {
        useUserStore.getState().setHasHydrated(true);
      },
    }
  )
);

export const getCurrentUser = () => useUserStore.getState().user;
