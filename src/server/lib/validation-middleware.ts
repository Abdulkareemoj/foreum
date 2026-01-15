import { TRPCError } from "@trpc/server"
import { type z, ZodError } from "zod"

/**
 * Wraps a procedure with input validation
 * Ensures all inputs are validated before reaching the handler
 */
export function withValidation<T extends z.ZodSchema>(schema: T) {
  return (input: unknown) => {
    try {
      return schema.parse(input)
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors = error.errors.reduce(
          (acc, err) => {
            const path = err.path.join(".")
            acc[path] = err.message
            return acc
          },
          {} as Record<string, string>,
        )

        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Validation failed",
          cause: fieldErrors,
        })
      }
      throw error
    }
  }
}

/**
 * Format Zod validation errors into user-friendly messages
 */
export function formatValidationError(error: ZodError) {
  const messages = error.errors.map((err) => {
    const field = err.path.join(".")
    return `${field}: ${err.message}`
  })
  return messages.join(", ")
}
