"use server";

import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function updateUser(
  userId: number,
  phoneNumber?: string,
  email?: string
) {
  const session = await getServerSession(authOptions);

  // Check both session and accessToken
  if (!session || !session.accessToken) {
    return {
      success: false,
      message: "الجلسة غير صالحة. يرجى تسجيل الخروج وتسجيل الدخول مرة أخرى",
      httpStatus: 401,
    };
  }

  const accessToken = session.accessToken;

  const formData = new FormData();

  if (email) {
    formData.append("Email", email);
  }

  if (phoneNumber) {
    formData.append("PhoneNumber", phoneNumber);
  }

  try {
    const response = await fetch(`${process.env.API}/Client/Update/${userId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    // Handle 401 from API
    if (response.status === 401) {
      return {
        success: false,
        message: "الجلسة غير صالحة. يرجى تسجيل الخروج وتسجيل الدخول مرة أخرى",
        httpStatus: 401,
      };
    }

    const result = await response.json();

    revalidatePath("/verification-required");

    return result;
  } catch (error) {
    console.error("Update user error:", error);
    return {
      success: false,
      message: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى",
      httpStatus: 500,
    };
  }
}
