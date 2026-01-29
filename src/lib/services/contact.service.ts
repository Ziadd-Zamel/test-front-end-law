/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getAuthHeader } from "@/lib/utils/auth-header";

// ==================== INTERFACES ====================

export interface ContactResponse {
  success: boolean;
  data?: any;
  message?: string;
}

export interface AddContactPayload {
  name: string;
  email?: string;
  JobPosition?: string;
  phoneNumber?: string;
  refId: string;
  refType: "case" | "task";
}

export interface UpdateContactPayload {
  id: string;
  clientName: string;
  email: string;
  phoneNumber: string;
}

// ==================== CONTACT SERVICES ====================

/**
 * Add a new contact
 */
export async function addContactService(
  data: AddContactPayload,
): Promise<ContactResponse> {
  const token = await getAuthHeader();

  const payload = {
    name: data.name,
    refId: data.refId,
    refType: data.refType,
    ...(data.email && { email: data.email }),
    ...(data.JobPosition && { JobPosition: data.JobPosition }),
    ...(data.phoneNumber && { phoneNumber: data.phoneNumber }),
  };
  const response = await fetch(`${process.env.API}/Contact/AddByRef`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    return { message: result.Message, success: false };
  }

  return { success: true, data: result.data, message: result.Message };
}

/**
 * Update an existing contact
 */
export async function updateContactService(
  data: UpdateContactPayload,
): Promise<ContactResponse> {
  const token = await getAuthHeader();

  const response = await fetch(`${process.env.API}/Contact/${data.id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ClientName: data.clientName,
      Email: data.email,
      PhoneNumber: data.phoneNumber,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    return { message: result.Message, success: false };
  }

  return { success: true, data: result.data, message: result.Message };
}

/**
 * Delete a contact
 */
export async function deleteContactService(
  contactId: string,
): Promise<ContactResponse> {
  const token = await getAuthHeader();

  const response = await fetch(`${process.env.API}/Contact/${contactId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token.token}`,
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    return { message: result.Message, success: false };
  }

  return { success: true, data: result.data, message: result.Message };
}
