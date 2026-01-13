"use server";

import { getAuthHeader } from "@/lib/utils/auth-header";

export async function logMailRead(mailId: string) {
  const token = await getAuthHeader();

  const response = await fetch(
    `${process.env.API}/Mail/Log-Read?mailId=${mailId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result;
}
