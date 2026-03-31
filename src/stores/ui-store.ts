import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  // Sidebar state
  leftSidebarOpen: boolean
  rightSidebarOpen: boolean
  
  // Modal state
  replyModalOpen: boolean
  
  // Thread being edited/replied to
  activeThreadId: string | null
  activeReplyId: string | null
  
  // Actions
  toggleLeftSidebar: () => void
  toggleRightSidebar: () => void
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
      replyModalOpen: false,
      activeThreadId: null,
      activeReplyId: null,

      // Actions
      toggleLeftSidebar: () => 
        set((state) => ({ leftSidebarOpen: !state.leftSidebarOpen })),
      
      toggleRightSidebar: () =>
        set((state) => ({ rightSidebarOpen: !state.rightSidebarOpen })),
      
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