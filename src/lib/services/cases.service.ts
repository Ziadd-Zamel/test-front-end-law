"use server";
import { getAuthHeader } from "@/lib/utils/auth-header";
import { revalidatePath, revalidateTag } from "next/cache";

// Add Case interface
export interface AddCasePayload {
  CaseNumber: string;
  OpponentName: string;
  CourtName: string;
  ClientType: "client" | "company";
  ClientId: string;
  EmployeesIds: string[];
  CaseTitle: string;
  CategoryId: string;
  CaseCategory?: string;
  ClientPosition: "مدعي" | "مدعي عليه";
  AdditionalNotes?: string;
}

// Edit Case interface
export interface EditCasePayload {
  id: string;
  CaseNumber: string;
  OpponentName: string;
  CourtName: string;
  ClientType: "client" | "company";
  ClientId: string;
  EmployeesIds: string[];
  CaseTitle: string;
  CategoryId: string;
  CaseCategory?: string;
  ClientPosition: "مدعي" | "مدعي عليه";
  AdditionalNotes?: string;
}

// Add new Case
export async function addCaseService(data: AddCasePayload) {
  const token = await getAuthHeader();

  const response = await fetch(`${process.env.API}/Case/Add`, {
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

  revalidatePath("/cases/list");
  revalidateTag("all-cases");

  return result;
}

// Edit Case
export async function editCaseService(data: EditCasePayload) {
  const token = await getAuthHeader();

  const response = await fetch(`${process.env.API}/Case/Update/${data.id}`, {
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

  revalidatePath("/cases/list");
  revalidateTag("all-cases");

  return result;
}
// Close Case
export async function closeCaseService(formData: FormData, id: string) {
  const token = await getAuthHeader();

  const url = `${process.env.API}/Case/Close/${id}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token.token}`,
    },
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    return { message: result.message, success: false };
  }

  revalidatePath("/cases/list");
  revalidateTag("all-cases");

  return result;
}
