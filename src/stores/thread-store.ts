import { create } from 'zustand'

interface ThreadState {
  // Draft state for forms
  draftThread: {
    title: string
    content: string
    categoryId: string | null
    tags: string[]
  } | null
  
  draftReply: {
    content: string
    threadId: string
    parentReplyId: string | null
  } | null
  
  // Actions
  setDraftThread: (draft: ThreadState['draftThread']) => void
  setDraftReply: (draft: ThreadState['draftReply']) => void
  clearDrafts: () => void
}

export const useThreadStore = create<ThreadState>((set) => ({
  draftThread: null,
  draftReply: null,
  
  setDraftThread: (draft) => set({ draftThread: draft }),
  setDraftReply: (draft) => set({ draftReply: draft }),
  clearDrafts: () => set({ draftThread: null, draftReply: null }),
}))