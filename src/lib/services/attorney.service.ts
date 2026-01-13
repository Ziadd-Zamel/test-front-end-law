"use server";
import { getAuthHeader } from "@/lib/utils/auth-header";
import { revalidatePath } from "next/cache";

// Attorney Request interface
export interface AttorneyRequestPayload {
  clientType: "client" | "company";
  clientId: string;
  attorneyCapacity: "اصالة عن نفسه" | "محامي";
  attorneyType: string[];
  attorneyDuration: "3_months" | "6_months" | "9_months" | "1_year";
  additionalNotes?: string;
}

// Attorney Revoke interface
export interface AttorneyRevokePayload {
  attorneyNumber: string;
  rejectionReason: string;
}

// Attorney Validate interface
export interface AttorneyValidationFields {
  attorneyNumber: string;
}

export interface changestatuAtornyProps {
  attorneyId: number;
  reason: string;
}
// Add new Attorney
export async function addAttorneyService(formData: FormData) {
  const token = await getAuthHeader();

  const response = await fetch(`${process.env.API}/Attorney/add-attorney`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.token}`,
    },
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    return { message: result.message, success: false };
  }

  revalidatePath("/attorney/list");

  return result;
}

// Request new Attorney
export async function requestAtorneyService(data: AttorneyRequestPayload) {
  const token = await getAuthHeader();

  const response = await fetch(
    `${process.env.API}/Attorney/request-new-attorney`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.token}`,
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    return { message: result.message, success: false };
  }

  revalidatePath("/attorney/list");

  return result;
}

// Revoke Attorney
export async function revokeAttorneyService(data: AttorneyRevokePayload) {
  const token = await getAuthHeader();

  const response = await fetch(`${process.env.API}/Attorney/revoke-attorney`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.token}`,
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();

  if (!response.ok) {
    return { message: result.message, success: false };
  }
  revalidatePath("/attorney/attorney-management");

  return result;
}

// validate Attorney
export async function validateAttorneyService(data: AttorneyValidationFields) {
  const token = await getAuthHeader();

  const response = await fetch(
    `${process.env.API}/Attorney/validate-attorney`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.token}`,
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    return { message: result.message, success: false };
  }

  return result;
}

// change Statu Attorney
export async function changeAttorneyStatyService(data: changestatuAtornyProps) {
  const token = await getAuthHeader();

  const response = await fetch(
    `${process.env.API}/Attorney/update-attorney-request-status`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.token}`,
      },
      body: JSON.stringify({
        Id: data.attorneyId,
        Status: "rejected",
        RejectionReason: data.reason,
      }),
    }
  );
  const result = await response.json();

  if (!response.ok) {
    return { message: result.message, success: false };
  }
  revalidatePath("/attorney/attorney-management");

  return result;
}
