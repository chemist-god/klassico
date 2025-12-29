/**
 * Standard result type for all server actions
 */
export type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Creates a success result
 */
export function success<T>(data: T): ActionResult<T> {
  return { success: true, data };
}

/**
 * Creates an error result
 */
export function failure(error: string): ActionResult<never> {
  return { success: false, error };
}

/**
 * Wraps an async function with error handling
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  errorMessage: string = "An error occurred"
): Promise<ActionResult<T>> {
  try {
    const data = await fn();
    return success(data);
  } catch (error) {
    console.error(errorMessage, error);
    return failure(
      error instanceof Error ? error.message : errorMessage
    );
  }
}

