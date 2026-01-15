import { toast } from "svelte-sonner"

/**
 * Utility to handle tRPC errors with consistent toast notifications
 */
export function getTrpcErrorHandler() {
  return {
    handle: (error: any) => {
      const message = error?.message || "An error occurred"
      const code = error?.data?.code

      const errorMessages: Record<string, string> = {
        UNAUTHORIZED: "You need to be logged in to do that",
        FORBIDDEN: "You do not have permission to do that",
        NOT_FOUND: "The requested resource was not found",
        BAD_REQUEST: "Invalid input provided",
        INTERNAL_SERVER_ERROR: "Something went wrong on our end. Please try again.",
        CONFLICT: "This action conflicts with existing data",
      }

      const userMessage = errorMessages[code] || message

      toast.error("Error", {
        description: userMessage,
      })

      console.error("[v0] tRPC Error:", { code, message, error })
    },
  }
}
