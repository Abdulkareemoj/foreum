import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  // Sidebar state
  leftSidebarOpen: boolean
  rightSidebarOpen: boolean
  
  // Modal state
  threadModalOpen: boolean
  replyModalOpen: boolean
  
  // Thread being edited/replied to
  activeThreadId: string | null
  activeReplyId: string | null
  
  // Actions
  toggleLeftSidebar: () => void
  toggleRightSidebar: () => void
  openThreadModal: (threadId?: string) => void
  closeThreadModal: () => void
  openReplyModal: (threadId: string, replyId?: string) => void
  closeReplyModal: () => void
  reset: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Initial state
      leftSidebarOpen: false,
      rightSidebarOpen: false,
      threadModalOpen: false,
      replyModalOpen: false,
      activeThreadId: null,
      activeReplyId: null,

      // Actions
      toggleLeftSidebar: () => 
        set((state) => ({ leftSidebarOpen: !state.leftSidebarOpen })),
      
      toggleRightSidebar: () =>
        set((state) => ({ rightSidebarOpen: !state.rightSidebarOpen })),
      
      openThreadModal: (threadId) =>
        set({ threadModalOpen: true, activeThreadId: threadId ?? null }),
      
      closeThreadModal: () =>
        set({ threadModalOpen: false, activeThreadId: null }),
      
      openReplyModal: (threadId, replyId) =>
        set({ 
          replyModalOpen: true, 
          activeThreadId: threadId,
          activeReplyId: replyId ?? null 
        }),
      
      closeReplyModal: () =>
        set({ 
          replyModalOpen: false, 
          activeThreadId: null,
          activeReplyId: null 
        }),
      
      reset: () =>
        set({
          leftSidebarOpen: false,
          rightSidebarOpen: false,
          threadModalOpen: false,
          replyModalOpen: false,
          activeThreadId: null,
          activeReplyId: null,
        }),
    }),
    {
      name: 'ui-storage', // localStorage key
      partialize: (state) => ({
        // Only persist sidebar preferences
        leftSidebarOpen: state.leftSidebarOpen,
        rightSidebarOpen: state.rightSidebarOpen,
      }),
    }
  )
)