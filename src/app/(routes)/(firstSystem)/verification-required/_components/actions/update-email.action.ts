"use server";

import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function updateEmail(userId: number, email: string) {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;

  if (!accessToken) {
    return {
      success: false,
      message: "الجلسة غير صالحة. يرجى تسجيل الخروج وتسجيل الدخول مرة أخرى",
      httpStatus: 401,
    };
  }
  const formData = new FormData();
  formData.append("Email", email);

  const response = await fetch(`${process.env.API}/Profile/${userId}`, {
    method: "post",
    headers: {
      Authorization: `Bearer ${11}`,
    },
    body: formData,
  });

  if (!accessToken) {
    return {
      success: false,
      message: "الجلسة غير صالحة. يرجى تسجيل الخروج وتسجيل الدخول مرة أخرى",
      httpStatus: 401,
    };
  }

  const result = await response.json();

  revalidatePath("/verification-required");

  return result;
}
