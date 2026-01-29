import { isValidAttorneyCategoryId } from "../utils/validate-id";

export const getAttorneyCategoryById = async (id: string) => {
  // Validate id before sending request
  if (!id || !isValidAttorneyCategoryId(id)) {
    throw new Error("Invalid attorney category id");
  }

  // Send request
  const response = await fetch(`/api/attorney/category/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Handle HTTP errors
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Parse response payload
  const payload = await response.json();
  return payload;
};
