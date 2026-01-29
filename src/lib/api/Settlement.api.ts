import { APIResponse } from "@/lib/types/api";
import { getAuthHeader } from "../utils/auth-header";
import { buildQueryParams } from "../utils/build-query-params";

// -----------------------------
// Get All Cases
// -----------------------------
interface QueryParams {
  pageNumber?: number;
  pageSize?: number;
}

export async function GetAllCases(params: QueryParams = {}) {
  // Get auth token
  const { token } = await getAuthHeader();

  // Base API URL
  const baseUrl = `${process.env.API}/Case/List-All-Cases`;

  // Build query parameters
  const queryString = buildQueryParams(params);

  // Final request URL
  const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

  // Send request
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 360, tags: ["all-cases"] },
  });

  // Handle HTTP errors
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Parse response payload
  const data: APIResponse<Case[]> = await response.json();
  return data;
}

// -----------------------------
// Validate Case ID
// -----------------------------
const VALID_ID_REGEX = /^[a-zA-Z0-9-]+$/;
export const isValidCaseId = (id: string) => VALID_ID_REGEX.test(id);

// -----------------------------
// Get Case By ID
// -----------------------------
export async function GetCaseById(id: string) {
  // Get auth token
  const { token } = await getAuthHeader();

  // Validate ID before request
  if (!id || !isValidCaseId(id)) {
    throw new Error("Invalid case id");
  }

  // Build API URL
  const url = `${process.env.API}/Case/Get-Case-By-Id/${id}`;

  // Send request
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 360, tags: [`case-${id}`] },
  });

  // Handle HTTP errors
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Parse response payload
  const data: APIResponse<Case> = await response.json();
  return data;
}

// -----------------------------
// Get Case Count By Category
// -----------------------------
interface CaseCategoryCount {
  categoryId: number;
  count: number;
  categoryName: string;
}

interface CaseCountByCategoryResponse {
  categories: CaseCategoryCount[];
  totalCases: number;
}

export async function GetCaseCountByCategory() {
  // Get auth token
  const { token } = await getAuthHeader();

  // Build API URL
  const url = `${process.env.API}/Case/get-cases-count-by-category`;

  // Send request
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 360, tags: ["case-count-category"] },
  });

  // Handle HTTP errors
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Parse response payload
  const data: APIResponse<CaseCountByCategoryResponse> = await response.json();
  return data;
}

// -----------------------------
// Get Cases Stats
// -----------------------------
interface CasesStatsData {
  activeCases: number;
  completedCases: number;
  totalCases: number;
  totalSessions: number;
}

export async function GetCaseCount() {
  // Get auth token
  const { token } = await getAuthHeader();

  // Build API URL
  const url = `${process.env.API}/Case/Cases-Count`;

  // Send request
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 360, tags: ["case-count"] },
  });

  // Handle HTTP errors
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Parse response payload
  const data: APIResponse<CasesStatsData> = await response.json();
  return data;
}
