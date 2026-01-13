"use server";

import { getAuthHeader } from "@/lib/utils/auth-header";
import { revalidatePath } from "next/cache";

interface updatePermissionsPayload {
  UserId: number;
  PermissionIds: number[];
}

export async function updatePermissions({
  UserId,
  PermissionIds,
}: updatePermissionsPayload) {
  const token = await getAuthHeader();

  const response = await fetch(
    `${process.env.API}/Permission/Update-User-Permissions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.token}`,
      },
      body: JSON.stringify({
        UserId: UserId,
        PermissionIds: PermissionIds,
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
