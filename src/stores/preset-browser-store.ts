import { create } from 'zustand'

interface PresetBrowserState {
  open: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
}

export const usePresetBrowserStore = create<PresetBrowserState>()((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  toggle: () => set((state) => ({ open: !state.open })),
}))
