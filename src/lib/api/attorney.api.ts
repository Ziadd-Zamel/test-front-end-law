import { APIResponse } from "../types/api";
import {
  AllAttorney,
  Attorney,
  AttorneyCategory,
  AttorneyRequestData,
  AttorneyValidationData,
  UserAttorney,
} from "../types/attorney";
import { getAuthHeader } from "../utils/auth-header";
import { buildQueryParams } from "../utils/build-query-params";
import { isValidAttorneyCategoryId } from "../utils/validate-id";

// -----------------------------
// Attorney Categories
// -----------------------------
export const getAttorneyCategories = async () => {
  // Get auth token
  const { token } = await getAuthHeader();

  // Build API URL
  const url = `${process.env.API}/Attorney/list-main-categories`;

  // Send request
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 600 },
  });

  // Handle HTTP errors
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Parse response payload
  const payload: APIResponse<AttorneyCategory[]> = await response.json();
  return payload;
};

// -----------------------------
// All Attorney Requests
// -----------------------------
export const getAllAttorneyRequests = async (
  clientId?: string,
  status?: string,
  pageSize: number = 5,
  pageNumber: number = 1,
) => {
  // Get auth token
  const { token } = await getAuthHeader();

  // Base API URL
  const baseUrl = `${process.env.API}/Attorney/list-my-attorney-requests`;

  // Build query parameters
  const queryString = buildQueryParams({
    clientId,
    status,
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
  const payload: APIResponse<Attorney[]> = await response.json();
  return payload;
};

// -----------------------------
// Get One Attorney Request
// -----------------------------
export const getAttorneyRequestById = async (id: string) => {
  // Get auth token
  const { token } = await getAuthHeader();

  // Validate id before sending request
  if (!id || !isValidAttorneyCategoryId(id)) {
    throw new Error("Invalid attorney id");
  }

  // Build API URL
  const url = `${process.env.API}/Attorney/get-attorney-request-details?id=${id}`;

  // Send request
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 600 },
  });

  // Handle HTTP errors
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Parse response payload
  const payload: APIResponse<AttorneyRequestData> = await response.json();
  return payload;
};

// -----------------------------
// All User Attorneys
// -----------------------------
export const getAllUserAttorney = async (
  clientId?: string,
  status?: string,
  pageSize: number = 5,
  pageNumber: number = 1,
) => {
  // Get auth token
  const { token } = await getAuthHeader();

  // Base API URL
  const baseUrl = `${process.env.API}/Attorney/list-my-attorneys`;

  // Build query parameters
  const queryString = buildQueryParams({
    clientId,
    status,
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
  const payload: APIResponse<UserAttorney[]> = await response.json();
  return payload;
};

export const getAllAttorney = async (
  clientId?: string,
  status?: string,
  pageSize: number = 5,
  pageNumber: number = 1,
) => {
  // Get auth token
  const { token } = await getAuthHeader();

  // Base API URL
  const baseUrl = `${process.env.API}/Attorney/list-all-attorneys`;

  // Build query parameters
  const queryString = buildQueryParams({
    clientId,
    status,
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
  const payload: APIResponse<AllAttorney[]> = await response.json();
  return payload;
};

export const getUserAttorneyById = async (id: string) => {
  // Get auth token
  const { token } = await getAuthHeader();

  // Validate id before sending request
  if (!id || !isValidAttorneyCategoryId(id)) {
    throw new Error("Invalid attorney id");
  }

  // Build API URL
  const url = `${process.env.API}/Attorney/get-attorney-details/${id}`;

  // Send request
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 600 },
  });

  // Handle HTTP errors
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Parse response payload
  const payload: APIResponse<AttorneyValidationData> = await response.json();
  return payload;
};
