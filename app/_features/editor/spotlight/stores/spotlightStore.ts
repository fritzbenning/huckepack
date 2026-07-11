import { create } from "zustand";

interface SpotlightStore {
  isOpen: boolean;
  openSpotlight: () => void;
  closeSpotlight: () => void;
}

export const useSpotlightStore = create<SpotlightStore>((set) => ({
  isOpen: false,
  openSpotlight: () => set({ isOpen: true }),
  closeSpotlight: () => set({ isOpen: false }),
}));
