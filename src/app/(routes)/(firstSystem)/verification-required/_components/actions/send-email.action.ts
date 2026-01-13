"use server";

import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";

export async function sendEmailCode() {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;

  if (!accessToken) {
    return {
      success: false,
      message: "الجلسة غير صالحة. يرجى تسجيل الخروج وتسجيل الدخول مرة أخرى",
      httpStatus: 401,
    };
  }

  const response = await fetch(
    `${process.env.API}/Verify/Resend-Email-Code/RegisterUserEmail`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (response.status === 401) {
    return {
      success: false,
      message: "رمز الوصول غير صالح. يرجى تسجيل الخروج وتسجيل الدخول مرة أخرى",
      httpStatus: 401,
    };
  }

  const result = await response.json();

  return {
    ...result,
    httpStatus: response.status,
  };
}
