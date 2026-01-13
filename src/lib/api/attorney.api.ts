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

// Attorney Categories
export const getAttorneyCategories = async () => {
  const url = `${process.env.API}/Attorney/list-main-categories`;

  // Get the auth token
  const { token } = await getAuthHeader();
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 600 },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const payload: APIResponse<AttorneyCategory[]> = await response.json();
  return payload;
};

// All Attornies Requests
export const getAllAttorneyRequests = async (
  clientId?: string,
  status?: string,
  pageSize: number = 5,
  pageNumber: number = 1
) => {
  const baseUrl = `${process.env.API}/Attorney/list-my-attorney-requests`;
  const params = new URLSearchParams();

  if (clientId) {
    params.append("clientId", clientId);
  }

  if (status) {
    params.append("status", status);
  }
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

  const payload: APIResponse<Attorney[]> = await response.json();
  return payload;
};

// get One Attorney Request
export const getAttorneyRequestById = async (id: string) => {
  const url = `${process.env.API}/Attorney/get-attorney-request-details?id=${id}`;

  // Get the auth token
  const { token } = await getAuthHeader();
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 600 },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const payload: APIResponse<AttorneyRequestData> = await response.json();
  return payload;
};

export const getAllUserAttorney = async (
  clientId?: string,
  status?: string,
  pageSize: number = 5,
  pageNumber: number = 1
) => {
  const baseUrl = `${process.env.API}/Attorney/list-my-attorneys`;
  const params = new URLSearchParams();

  if (clientId) {
    params.append("clientId", clientId);
  }
  if (pageNumber) {
    params.append("pageNumber", pageNumber.toString());
  }
  if (pageSize) {
    params.append("pageSize", pageSize.toString());
  }

  if (status) {
    params.append("status", status);
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

  const payload: APIResponse<UserAttorney[]> = await response.json();
  return payload;
};

export const getAllAttorney = async (
  clientId?: string,
  status?: string,
  pageSize: number = 5,
  pageNumber: number = 1
) => {
  const baseUrl = `${process.env.API}/Attorney/list-all-attorneys`;
  const params = new URLSearchParams();

  if (clientId) {
    params.append("clientId", clientId);
  }
  if (pageNumber) {
    params.append("pageNumber", pageNumber.toString());
  }
  if (pageSize) {
    params.append("pageSize", pageSize.toString());
  }

  if (status) {
    params.append("status", status);
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

  const payload: APIResponse<AllAttorney[]> = await response.json();
  return payload;
};

export const getUserAttorneyById = async (id: string) => {
  const url = `${process.env.API}/Attorney/get-attorney-details/${id}`;

  // Get the auth token
  const { token } = await getAuthHeader();
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 600 },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const payload: APIResponse<AttorneyValidationData> = await response.json();
  return payload;
};
export const getAttorneyFileById = async (path: string) => {
  // Get the auth token
  const { token } = await getAuthHeader();
  const response = await fetch(
    `${process.env.API}/Attorney/download-attorney-pdf/${path}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/pdf",
      },
      next: { revalidate: 600 },
    }
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const payload: APIResponse<AttorneyValidationData> = await response.json();
  return payload;
};
