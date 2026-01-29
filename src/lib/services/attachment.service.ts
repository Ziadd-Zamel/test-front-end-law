/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getAuthHeader } from "@/lib/utils/auth-header";

// ==================== INTERFACES ====================

export interface AttachmentCategoryResponse {
  success: boolean;
  data?: any;
  message?: string;
}

export interface AddCategoryPayload {
  categoryName: string;
}

export interface UpdateCategoryPayload {
  id: string;
  categoryName: string;
}

// ==================== ATTACHMENT CATEGORY SERVICES ====================

/**
 * Add a new attachment category
 */
export async function addAttachmentCategoryService(
  data: AddCategoryPayload,
): Promise<AttachmentCategoryResponse> {
  const token = await getAuthHeader();

  const response = await fetch(`${process.env.API}/AttachmentCategory/add`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      CategoryName: data.categoryName,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    return { message: result.Message, success: false };
  }

  return { success: true, data: result.data, message: result.Message };
}

/**
 * Update an existing attachment category
 */
export async function updateAttachmentCategoryService(
  data: UpdateCategoryPayload,
): Promise<AttachmentCategoryResponse> {
  const token = await getAuthHeader();

  const response = await fetch(`${process.env.API}/AttachmentCategory/update`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Id: data.id,
      CategoryName: data.categoryName,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    return { message: result.Message, success: false };
  }

  return { success: true, data: result.data, message: result.Message };
}

/**
 * Delete an attachment category
 */
export async function deleteAttachmentCategoryService(
  categoryId: string,
): Promise<AttachmentCategoryResponse> {
  const token = await getAuthHeader();

  const response = await fetch(
    `${process.env.API}/AttachmentCategory/delete/${categoryId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token.token}`,
        "Content-Type": "application/json",
      },
    },
  );

  const result = await response.json();

  if (!response.ok) {
    return { message: result.Message, success: false };
  }

  return { success: true, data: result.data, message: result.Message };
}
