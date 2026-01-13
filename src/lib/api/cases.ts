import { APIResponse } from "@/lib/types/api";
import { getAuthHeader } from "../utils/auth-header";

interface QueryParams {
  PageNumber?: number;
  pageSize?: number;
}

interface CasesStatsData {
  activeCases: number;
  completedCases: number;
  totalCases: number;
  totalSessions: number;
}

export async function GetAllCases(params: QueryParams = {}) {
  const { token } = await getAuthHeader();

  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    if (Array.isArray(value)) {
      value.forEach((v) => query.append(`${key}[]`, String(v)));
    } else {
      query.append(key, String(value));
    }
  });

  const url = `${process.env.API}/Case/List-All-Cases/${
    query.toString() ? `?${query}` : ""
  }`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 360, tags: ["all-cases"] },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data: APIResponse<Case[]> = await response.json();

  return data;
}

export async function GetCaseById(id: string) {
  const { token } = await getAuthHeader();

  const url = `${process.env.API}/Case/Get-Case-By-Id/${id}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 360, tags: [`case-${id}`] },
  });
  const data: APIResponse<Case> = await response.json();
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return data;
}
interface CaseCategoryCount {
  categoryId: number;
  count: number;
  categoryName: string;
}
interface respons {
  categories: CaseCategoryCount[];
  totalCases: number;
}
export async function GetCaseCountByCategory() {
  const { token } = await getAuthHeader();

  const url = `${process.env.API}/Case/get-cases-count-by-category`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 360, tags: [`case-count-category`] },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data: APIResponse<respons> = await response.json();

  return data;
}
export async function GetCaseCount() {
  const { token } = await getAuthHeader();

  const url = `${process.env.API}/Case/Cases-Count`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 360, tags: [`case-count`] },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data: APIResponse<CasesStatsData> = await response.json();

  return data;
}
