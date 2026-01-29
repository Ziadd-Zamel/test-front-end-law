"use server";

import { cookies } from "next/headers";
import { LocationData } from "@/lib/api/location.api";
import {
  RegisterFields,
  ForgetPasswordFields,
  ResetEmailPasswordFields,
  ResetWhatsPasswordFields,
  SendVerificationCodeFields,
} from "@/lib/schemas/auth.schema";

// ==================== INTERFACES ====================

export interface VerifyCodePayload {
  code: string;
  visitorId: string;
  typeOfGenerate: "RegisterUserWhats" | "RegisterUserEmail" | "ForgetPassword";
}

export interface ResetEmailPasswordPayload {
  password: string;
  confirmPassword: string;
  token: string;
  email: string;
}

// ==================== REGISTER SERVICE ====================

/**
 * Register a new user with location data
 */
export async function registerUserService(
  data: RegisterFields,
  locationData?: LocationData,
  visitorId?: string,
) {
  const body = {
    ...data,
    visitorId: visitorId,
    ...(locationData?.ip && { ip: locationData.ip }),
    ...(locationData?.country && { country: locationData.country }),
    ...(locationData?.city && { city: locationData.city }),
    ...(locationData?.latitude && { latitude: locationData.latitude }),
    ...(locationData?.longitude && { longitude: locationData.longitude }),
    ...(locationData?.plusCode && { plusCode: locationData.plusCode }),
  };

  const response = await fetch(`${process.env.API}/Register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const result = await response.json();

  if (!response.ok) {
    return { message: result.Message, success: false };
  }

  return result;
}

// ==================== VERIFICATION SERVICES ====================

/**
 * Verify WhatsApp code during registration
 */
export async function verifyWhatsappCodeService(
  code: string,
  visitorId: string,
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("registerToken")?.value;

  if (!token) {
    return { message: "Token not found in cookies", success: false };
  }

  const response = await fetch(`${process.env.API}/Verify/Code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      code: code,
      visitorId: visitorId,
      typeOfGenerate: "RegisterUserWhats",
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    return { message: result.Message, success: false };
  }

  return result;
}

/**
 * Verify email code during registration
 */
export async function verifyEmailCodeService(code: string, visitorId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("registerToken")?.value;

  if (!token) {
    return { message: "Token not found in cookies", success: false };
  }

  const response = await fetch(`${process.env.API}/Verify/Code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      code: code,
      visitorId: visitorId,
      typeOfGenerate: "RegisterUserEmail",
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    return { message: result.Message, success: false };
  }

  return result;
}

/**
 * Verify code for forget password
 */
export async function verifyForgetCodeService(code: string, visitorId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("forgetPasswordToken")?.value;

  if (!token) {
    return { message: "Token not found in cookies", success: false };
  }

  const response = await fetch(`${process.env.API}/Verify/Code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      code: code,
      typeOfGenerate: "ForgetPassword",
      visitorId: visitorId,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    return { message: result.Message, success: false };
  }

  return result;
}

// ==================== FORGET PASSWORD SERVICES ====================

/**
 * Request forget password (send code via email or WhatsApp)
 */
export async function forgetPasswordService(data: ForgetPasswordFields) {
  const response = await fetch(`${process.env.API}/Forget-Password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    return { message: result.Message, success: false };
  }

  return result;
}

/**
 * Reset password via email link
 */
export async function resetEmailPasswordService(
  data: ResetEmailPasswordFields,
  searchParams: { token: string; email: string },
) {
  const { token, email } = searchParams;

  const { password, confirmPassword } = data;

  const requestBody = {
    password,
    confirmPassword,
    token,
    email,
  };

  const response = await fetch(`${process.env.API}/Reset-Email-Password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const result = await response.json();

  if (!response.ok) {
    return { message: result.Message, success: false };
  }

  return result;
}

/**
 * Reset password via WhatsApp verification
 */
export async function resetWhatsPasswordService(
  data: ResetWhatsPasswordFields,
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("forgetPasswordToken")?.value;

  if (!token) {
    return { message: "Token not found in cookies", success: false };
  }

  const response = await fetch(`${process.env.API}/Reset-Whats-Password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    return { message: result.Message, success: false };
  }

  return result;
}

export async function sendVerificationCodeService(
  data: SendVerificationCodeFields,
  locationData?: LocationData,
) {
  const body = {
    identity: data.identity,
    ...(locationData?.ip && { ip: locationData.ip }),
    ...(locationData?.country && { country: locationData.country }),
    ...(locationData?.city && { city: locationData.city }),
    ...(locationData?.latitude && { latitude: locationData.latitude }),
    ...(locationData?.longitude && { longitude: locationData.longitude }),
    ...(locationData?.plusCode && { plusCode: locationData.plusCode }),
  };
  const response = await fetch(`${process.env.API}/Login-OTP`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "*/*",
    },
    body: JSON.stringify(body),
  });

  const result = await response.json();

  if (!response.ok) {
    return { message: result.Message, success: false };
  }

  return result;
}

/**
 * refresh token
 */
export async function refreshTokenService(refreshToken: string) {
  const response = await fetch(`${process.env.API}/Resend-Access-Toekn`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refreshToken,
    }),
  });
  const result = await response.json();

  if (!response.ok) {
    return { message: result.Message, success: false };
  }

  return result;
}
