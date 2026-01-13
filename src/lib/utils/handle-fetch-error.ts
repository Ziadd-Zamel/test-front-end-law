export async function handleFetchError(response: Response): Promise<never> {
  let errorMessage = `Request failed with status ${response.status}`;

  try {
    const errorData = await response.json();
    errorMessage =
      typeof errorData === "string" ? errorData : JSON.stringify(errorData);
  } catch {
    try {
      errorMessage = await response.text();
    } catch {
      // leave default message
    }
  }

  throw new Error(errorMessage);
}
