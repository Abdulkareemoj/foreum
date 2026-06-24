import { create } from 'zustand'

interface ProfileFormData {
  name: string
  username: string
  image: string
  bio: string
  location: string
  website: string
}

interface ProfileState {
  profileUser: {
    id: string
    name: string
    username: string | null
    image: string | null
    bio: string | null
    location: string | null
    website: string | null
  } | null
  formData: ProfileFormData
  setProfileUser: (user: ProfileState['profileUser']) => void
  setFormField: (field: keyof ProfileFormData, value: string) => void
  initializeForm: () => void
  reset: () => void
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profileUser: null,
  formData: {
    name: '',
    username: '',
    image: '',
    bio: '',
    location: '',
    website: '',
  },
  setProfileUser: (user) => set({ profileUser: user }),
  setFormField: (field, value) =>
    set((state) => ({
      formData: { ...state.formData, [field]: value },
    })),
  initializeForm: () => {
    const user = get().profileUser
    if (!user) return
    set({
      formData: {
        name: user.name ?? '',
        username: user.username ?? '',
        image: user.image ?? '',
        bio: user.bio ?? '',
        location: user.location ?? '',
        website: user.website ?? '',
      },
    })
  },
  reset: () =>
    set({
      profileUser: null,
      formData: {
        name: '',
        username: '',
        image: '',
        bio: '',
        location: '',
        website: '',
      },
    }),
}))
