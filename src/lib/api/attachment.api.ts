import { getAuthHeader } from "@/lib/utils/auth-header";
import { APIResponse } from "@/lib/types/api";
import { buildQueryParams } from "../utils/build-query-params";

export const getAllAttachmentCategories = async (
  pageSize: number = 10,
  pageNumber: number = 1,
) => {
  // Get auth token
  const { token } = await getAuthHeader();

  // Base API URL
  const baseUrl = `${process.env.API}/AttachmentCategory/list`;

  // Build query parameters
  const queryString = buildQueryParams({
    pageNumber,
    pageSize,
  });

  // Final request URL
  const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

  // Send request
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  // Handle HTTP errors
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Parse response payload
  const payload: APIResponse<AttachmentCategory[]> = await response.json();
  return payload;
};
