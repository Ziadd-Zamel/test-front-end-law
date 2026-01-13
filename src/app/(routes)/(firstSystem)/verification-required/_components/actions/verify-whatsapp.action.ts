"use server";

import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function verifyWhatsAppCode(code: string, visitorId: string) {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;
  if (!accessToken) {
    return {
      success: false,
      message: "الجلسة غير صالحة. يرجى تسجيل الخروج وتسجيل الدخول مرة أخرى",
      httpStatus: 401,
    };
  }
  const response = await fetch(`${process.env.API}/Verify/Code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      code: code,
      visitorId: visitorId,
      typeOfGenerate: "RegisterUserWhats",
    }),
  });
  const result = await response.json();

  if (response.status === 401) {
    return {
      success: false,
      message: "الجلسة غير صالحة. يرجى تسجيل الخروج وتسجيل الدخول مرة أخرى",
      httpStatus: 401,
    };
  }

  revalidatePath("/verification-required");

  return {
    ...result,
    httpStatus: response.status,
  };
}
