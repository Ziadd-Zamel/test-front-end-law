import { APIResponse } from "../types/api";
import { getAuthHeader } from "../utils/auth-header";

export const getAllPermissions = async () => {
  // Get the auth token
  const { token } = await getAuthHeader();
  const response = await fetch(
    `${process.env.API}/Permission/Get-All-Permissions`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const payload: APIResponse<Permission[]> = await response.json();
  return payload;
};
