"use server";

import { getAuthHeader } from "@/lib/utils/auth-header";
import { APIResponse } from "@/lib/types/api";
import { buildQueryParams } from "../utils/build-query-params";

// ==================== INTERFACES ====================

export interface SettlementListQueryParams {
  PageNumber?: number;
  pageSize?: number;
  status?: string;
  categoryNumber?: string;
}

export interface SettlementCategoryListQueryParams {
  pageNumber?: number;
  pageSize?: number;
  onlyActive?: boolean;
}

/**
 * Get all settlement requests
 */
export async function getAllSettlement(params: SettlementListQueryParams = {}) {
  const token = await getAuthHeader();

  const queryString = buildQueryParams(params);

  const url = `${process.env.API}/SettlementRequest/list${
    queryString ? `?${queryString}` : ""
  }`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token.token}`,
    },
    next: { revalidate: 360, tags: ["all-settlement"] },
  });

  const result: APIResponse<Settlement[]> = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to fetch settlements");
  }

  return result;
}

/**
 * Get settlement request details by id
 */
export async function getSettlementById(id: string) {
  const token = await getAuthHeader();

  const url = `${
    process.env.API
  }/SettlementRequest/get-settlement-request-details?id=${encodeURIComponent(
    id
  )}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token.token}`,
    },
  });

  const result: APIResponse<SettlementDetails> = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to fetch settlement details");
  }

  return result;
}

/**
 * Get all settlement request categories
 */
export async function getSettlementCategories(
  params: SettlementCategoryListQueryParams = {}
) {
  const token = await getAuthHeader();

  const queryString = buildQueryParams(params);

  const url = `${process.env.API}/CaseAndSettlementCategories/list${
    queryString ? `?${queryString}` : ""
  }`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token.token}`,
    },
    next: { revalidate: 360, tags: ["settlement-categories"] },
  });

  const result: APIResponse<SettlementCategory[]> = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to fetch settlement categories");
  }

  return result;
}

/**
 * Get settlement request category details by id
 */
export async function getSettlementCategoryById(id: string) {
  const token = await getAuthHeader();

  const url = `${
    process.env.API
  }/CaseAndSettlementCategories/get-settlement-request-category-details?id=${encodeURIComponent(
    id
  )}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token.token}`,
    },
    next: {
      revalidate: 360,
      tags: [`settlement-category-${id}`],
    },
  });

  const result: APIResponse<SettlementCategoryDetails> = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.message || "Failed to fetch settlement category details"
    );
  }

  return result;
}

/**
 * Get settlement sessions by settlement request id
 */
export async function getSettlementSessionsByRequestId(requestId: string) {
  const token = await getAuthHeader();

  const url = `${
    process.env.API
  }/SettlementRequestSession/by-request?requestId=${encodeURIComponent(
    requestId
  )}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token.token}`,
    },
    next: {
      revalidate: 360,
      tags: [`settlement-sessions-request-${requestId}`],
    },
  });

  const result: APIResponse<SettlementSession[]> = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to fetch settlement sessions");
  }

  return result;
}

/**
 * Get settlement session details by session id
 */
export async function getSettlementSessionDetails(sessionId: string) {
  const token = await getAuthHeader();

  const url = `${
    process.env.API
  }/SettlementRequestSession/get-session-details?sessionId=${encodeURIComponent(
    sessionId
  )}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token.token}`,
    },
  });

  const result: APIResponse<SettlementSessionDetails> = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.message || "Failed to fetch settlement session details"
    );
  }

  return result;
}
