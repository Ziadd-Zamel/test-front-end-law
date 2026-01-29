/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { getAuthHeader } from "@/lib/utils/auth-header";
import { revalidatePath, revalidateTag } from "next/cache";

// ==================== INTERFACES ====================

// Settlement Request Category Interfaces
export interface SettlementCategoryCreatePayload {
  name: string;
  description?: string;
  isActive: boolean;
}

export interface SettlementCategoryUpdatePayload {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface SettlementSessionUpdatePayload {
  id: number;
  sessionStatus: string;
  sessionReport: string;
  sessionDate: string;
  attachments?: any;
  descriptions?: any;
}

// ==================== SETTLEMENT REQUEST CATEGORY SERVICES ====================

/**
 * Create a new settlement request category
 */
export async function createSettlementCategoryService(
  data: SettlementCategoryCreatePayload,
) {
  const token = await getAuthHeader();

  const response = await fetch(
    `${process.env.API}/CaseAndSettlementCategories/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.token}`,
      },
      body: JSON.stringify(data),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    return { message: result.Message, success: false };
  }

  revalidateTag("settlement-categories");

  return result;
}

/**
 * Update an existing settlement request category
 */
export async function updateSettlementCategoryService(
  data: SettlementCategoryUpdatePayload,
) {
  const token = await getAuthHeader();

  const response = await fetch(
    `${process.env.API}/CaseAndSettlementCategories/update`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.token}`,
      },
      body: JSON.stringify(data),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    return { message: result.Message, success: false };
  }

  revalidateTag("settlement-categories");

  return result;
}

/**
 * Delete a settlement request category
 */
export async function deleteSettlementCategoryService(id: string) {
  const token = await getAuthHeader();

  const response = await fetch(
    `${process.env.API}/CaseAndSettlementCategories/delete?id=${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    },
  );

  const result = await response.json();

  if (!response.ok) {
    return { message: result.Message, success: false };
  }

  revalidateTag("settlement-categories");

  return result;
}

// ==================== SETTLEMENT REQUEST SERVICES ====================

/**
 * Create a new settlement request
 */
export async function createSettlementRequestService(formData: FormData) {
  const token = await getAuthHeader();

  const response = await fetch(`${process.env.API}/SettlementRequest/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.token}`,
    },
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    return { message: result.Message, success: false };
  }

  revalidateTag("all-settlement");

  return result;
}

/**
 * Update an existing settlement request
 */
export async function updateSettlementRequestService(formData: FormData) {
  const token = await getAuthHeader();

  const response = await fetch(`${process.env.API}/SettlementRequest/update`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token.token}`,
    },
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    return { message: result.Message, success: false };
  }

  revalidateTag("all-settlement");

  return result;
}

// ==================== SETTLEMENT REQUEST SESSION SERVICES ====================

/**
 * Create a new settlement request session
 */
export async function createSettlementSessionService(formData: FormData) {
  const token = await getAuthHeader();

  const response = await fetch(
    `${process.env.API}/SettlementRequestSession/create`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
      body: formData,
    },
  );

  const result = await response.json();

  if (!response.ok) {
    return { message: result.Message, success: false };
  }

  revalidateTag("all-settlement");

  return result;
}

/**
 * Update an existing settlement request session
 */
export async function updateSettlementSessionService(
  data: SettlementSessionUpdatePayload,
) {
  const token = await getAuthHeader();

  const response = await fetch(
    `${process.env.API}/SettlementRequestSession/update`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.token}`,
      },
      body: JSON.stringify(data),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    return { message: result.Message, success: false };
  }

  revalidatePath("/settlement/sessions");

  return result;
}
