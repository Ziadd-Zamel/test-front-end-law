import { APIResponse, SuccessfulResponse } from "../types/api";

/**
 * Executes an asynchronous callback function and catches any errors.
 * If successful, returns the payload with a `null` error.
 * If there's an error, returns `null` payload and the error message.
 *
 * @template T - The type of data expected in the API response payload.
 * @param callback - An async function that returns a Promise of type `APIResponse<T>`.
 * @returns A tuple containing either the successful payload and `null`, or `null` and the error message.
 */
export default async function catchError<T>(
  callback: () => Promise<APIResponse<T>>
): Promise<[SuccessfulResponse<T>, null] | [null, string]> {
  try {
    const payload = await callback();

    // Check if the response indicates failure (success === false)
    if (payload.success === false) {
      const errorMessage = payload.message || "An error occurred";
      throw new Error(errorMessage);
    }

    // If success is true, return the successful response
    return [payload, null];
  } catch (error) {
    return [null, (error as Error).message];
  }
}
