"use server";

import { getAuthHeader } from "@/lib/utils/auth-header";
import { revalidatePath } from "next/cache";

export async function apiPost<T>({
  endpoint,
  body,
  revalidatePathUrl,
}: {
  endpoint: string;
  body: T;
  revalidatePathUrl?: string;
}) {
  const token = await getAuthHeader();

  const response = await fetch(`${process.env.API}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.token}`,
    },
    body: JSON.stringify(body),
  });

  const result = await response.json();

  if (!response.ok) {
    return { message: result.message, success: false };
  }

  if (revalidatePathUrl) {
    revalidatePath(revalidatePathUrl);
  }

  return result;
}
