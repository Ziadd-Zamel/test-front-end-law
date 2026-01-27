import { getAuthHeader } from "@/lib/utils/auth-header";
import { APIResponse } from "@/lib/types/api";

export const getAllAttachmentCategories = async (
  pageSize: number = 10,
  pageNumber: number = 1,
) => {
  const baseUrl = `${process.env.API}/AttachmentCategory/list`;
  const params = new URLSearchParams();

  if (pageNumber) {
    params.append("pageNumber", pageNumber.toString());
  }
  if (pageSize) {
    params.append("pageSize", pageSize.toString());
  }

  const url = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;

  // Get the auth token
  const { token } = await getAuthHeader();

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const payload: APIResponse<AttachmentCategory[]> = await response.json();
  return payload;
};
