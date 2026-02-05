"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  registerUserService,
  verifyWhatsappCodeService,
  verifyEmailCodeService,
  verifyForgetCodeService,
  forgetPasswordService,
  resetEmailPasswordService,
  resetWhatsPasswordService,
  sendVerificationCodeService,
  refreshTokenService,
  updateClient,
  sendPhoneCodeActivation,
  activeMail,
  activePhone,
  sendEmailCodeActivation,
} from "@/lib/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { LocationData } from "@/lib/api/location.api";
import type {
  RegisterFields,
  ForgetPasswordFields,
  ResetEmailPasswordFields,
  ResetWhatsPasswordFields,
  SendVerificationCodeFields,
} from "@/lib/schemas/auth.schema";
import { useRouter } from "next/navigation";
import { useFingerprint } from "@/components/providers/components/fingerprint-client";
import Cookies from "js-cookie";
import { signOut, useSession } from "next-auth/react";
import { decrypt } from "@/lib/utils/crypto-client";

// ==================== REGISTER HOOKS ====================
interface SendVerificationWithLocation extends SendVerificationCodeFields {
  locationData?: LocationData;
}
/**
 * Hook for user registration
 */
export function useRegisterUser() {
  const router = useRouter();
  const { visitorId } = useFingerprint();

  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationFn: async ({
      data,
      locationData,
    }: {
      data: RegisterFields;
      locationData?: LocationData;
    }) => {
      const result = await registerUserService(
        data,
        locationData,
        visitorId || "",
      );

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: (data) => {
      toast.success("تم التسجيل بنجاح!");
      Cookies.set("registerToken", data.token);
      router.push("/auth/otp-whatsapp");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    isPending,
    error,
    register: mutate,
    registerAsync: mutateAsync,
  };
}

// ==================== VERIFICATION HOOKS ====================

/**
 * Hook for verifying WhatsApp code during registration
 */
export function useVerifyWhatsappCode() {
  const router = useRouter();
  const { visitorId } = useFingerprint();

  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationFn: async (code: string) => {
      const result = await verifyWhatsappCodeService(code, visitorId || "");

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success("تم التحقق من رقم واتساب بنجاح");
      router.push("/auth/otp-email");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء التحقق من رمز واتساب");
    },
  });

  return {
    isPending,
    error,
    verify: mutate,
    verifyAsync: mutateAsync,
  };
}

/**
 * Hook for verifying email code during registration
 */
export function useVerifyEmailCode() {
  const router = useRouter();
  const { visitorId } = useFingerprint();

  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationFn: async (code: string) => {
      const result = await verifyEmailCodeService(code, visitorId || "");

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success("تم التحقق من البريد الإلكتروني بنجاح");
      router.push("/dashboard");
      Cookies.remove("registerToken");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء التحقق من الرمز");
    },
  });

  return {
    isPending,
    error,
    verify: mutate,
    verifyAsync: mutateAsync,
  };
}

/**
 * Hook for verifying forget password code
 */
export function useVerifyCode() {
  const router = useRouter();
  const { visitorId } = useFingerprint();
  const type = Cookies.get("forgetType");

  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationFn: async (code: string) => {
      const result = await verifyForgetCodeService(
        code,
        visitorId || "",
        type || "",
      );

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success("تم التحقق من الرمز بنجاح");
      if (type === "ForgetPasswordEmail") {
        router.push("/auth/forget-password/reset-password/email");
      } else {
        router.push("/auth/forget-password/reset-password/whatsapp");
      }
      Cookies.remove("forgetType");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء التحقق من الرمز ");
    },
  });

  return {
    isPending,
    error,
    verify: mutate,
    verifyAsync: mutateAsync,
  };
}

// ==================== FORGET PASSWORD HOOKS ====================

/**
 * Hook for requesting forget password
 */
export function useForgetPassword() {
  const router = useRouter();

  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationFn: async (data: ForgetPasswordFields) => {
      const result = await forgetPasswordService(data);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: (data, variables) => {
      toast.success("تم إرسال رمز إعادة تعيين كلمة المرور بنجاح!");
      if (variables.type === "Email") {
        Cookies.set("forgetType", "ForgetPasswordEmail");
      } else if (variables.type === "WhatsApp") {
        Cookies.set("forgetType", "ForgetPasswordWhats");
      }
      toast.success("تم إرسال رمز إعادة تعيين كلمة المرور بنجاح!");
      Cookies.set("forgetPasswordToken", data.token);
      router.push("/auth/forget-password/reset-password/otp");
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "حدث خطأ أثناء إرسال رمز إعادة تعيين كلمة المرور",
      );
    },
  });

  return {
    isPending,
    error,
    forgetPassword: mutate,
    forgetPasswordAsync: mutateAsync,
  };
}

/**
 * Hook for resetting password via email
 */
export function useResetEmailPassword() {
  const router = useRouter();

  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationFn: async (data: ResetEmailPasswordFields) => {
      const result = await resetEmailPasswordService(data);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success(
        "تم إعادة تعيين كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول.",
      );
      router.push("/auth/login");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء إعادة تعيين كلمة المرور");
    },
  });

  return {
    isPending,
    error,
    resetEmailPassword: mutate,
    resetEmailPasswordAsync: mutateAsync,
  };
}

/**
 * Hook for resetting password via WhatsApp
 */
export function useResetWhatsPassword() {
  const router = useRouter();

  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationFn: async (data: ResetWhatsPasswordFields) => {
      const result = await resetWhatsPasswordService(data);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success(
        "تم إعادة تعيين كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول.",
      );
      router.push("/auth/login");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء إعادة تعيين كلمة المرور");
    },
  });

  return {
    isPending,
    error,
    resetWhatsPassword: mutate,
    resetWhatsPasswordAsync: mutateAsync,
  };
}

//

export default function useSendVerificationCode() {
  const router = useRouter();

  const { isPending, error, mutate } = useMutation({
    mutationFn: async ({
      identity,
      locationData,
    }: SendVerificationWithLocation) => {
      const result = await sendVerificationCodeService(
        { identity },
        locationData,
      );

      if (!result.success) {
        throw new Error(result.message || "فشل إرسال رمز التحقق");
      }

      return result;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "تم إرسال رمز التحقق بنجاح!");
      Cookies.set("verificationToken", data?.data.token);
      router.push("/auth/otp-login/otp");
    },
    onError: (error) => {
      console.error("Send verification code error:", error);
      toast.error(error?.message || "حدث خطأ أثناء إرسال رمز التحقق");
    },
  });

  return {
    isPending,
    error,
    sendVerificationCode: mutate,
  };
}

export function useRefreshToken() {
  const { data: session, update } = useSession();

  const { isPending, error, mutate } = useMutation({
    mutationFn: async () => {
      const refreshToken = session?.sessionKey
        ? decrypt(session.sessionKey)
        : "";
      const result = await refreshTokenService(refreshToken);
      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    },
    onSuccess: async (data) => {
      await update({
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken,
      });
      const expiresAt = Date.now() + 2 * 60 * 1000;
      const expiresAtServer = Date.now() + 9 * 60 * 1000;
      Cookies.set("token-expires-at", expiresAt.toString(), {
        expires: new Date(expiresAt),
        path: "/",
        sameSite: "lax",
      });
      Cookies.set("token-expires-at-server", expiresAtServer.toString(), {
        expires: new Date(expiresAtServer),
        path: "/",
        sameSite: "lax",
      });
      toast.success("تم تحديث الجلسة");
    },
    onError: async () => {
      toast.error("انتهت الجلسة جاري تسجيل الخروج");
      Cookies.remove("token-expires-at");
      Cookies.remove("token-expires-at-server");
      await signOut();
    },
  });

  return {
    isPending,
    error,
    refreshToken: mutate,
    session: session,
  };
}

// ==================== VERIFICATION REQUIRED HOOKS ====================

/**
 * Hook for sending email activation code
 */
export function useSendEmailCodeActivation() {
  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationFn: async () => {
      const result = await sendEmailCodeActivation();

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success("تم إرسال رمز التفعيل إلى بريدك الإلكتروني");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء إرسال رمز التفعيل");
    },
  });

  return {
    isPending,
    error,
    sendEmailCode: mutate,
    sendEmailCodeAsync: mutateAsync,
  };
}

/**
 * Hook for sending phone activation code
 */
export function useSendPhoneCodeActivation() {
  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationFn: async () => {
      const result = await sendPhoneCodeActivation();

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success("تم إرسال رمز التفعيل إلى رقم واتساب");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء إرسال رمز التفعيل");
    },
  });

  return {
    isPending,
    error,
    sendPhoneCode: mutate,
    sendPhoneCodeAsync: mutateAsync,
  };
}

/**
 * Hook for activating email
 */
export function useActiveMail() {
  const { visitorId } = useFingerprint();
  const { update, data: session } = useSession();

  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationFn: async (code: string) => {
      const result = await activeMail(code, visitorId || "");

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: async () => {
      toast.success("تم تفعيل البريد الإلكتروني بنجاح");
      // Update session to reflect email confirmation
      await update({
        user: {
          ...session?.user,
          emailConfirmed: true,
        },
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء تفعيل البريد الإلكتروني");
    },
  });

  return {
    isPending,
    error,
    activeMail: mutate,
    activeMailAsync: mutateAsync,
  };
}

/**
 * Hook for activating phone number
 */
export function useActivePhone() {
  const { visitorId } = useFingerprint();
  const { update, data: session } = useSession();

  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationFn: async (code: string) => {
      const result = await activePhone(code, visitorId || "");

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: async () => {
      toast.success("تم تفعيل رقم الهاتف بنجاح");
      // Update session to reflect phone confirmation
      await update({
        user: {
          ...session?.user,
          phoneNumberConfirmed: true,
        },
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء تفعيل رقم الهاتف");
    },
  });

  return {
    isPending,
    error,
    activePhone: mutate,
    activePhoneAsync: mutateAsync,
  };
}

/**
 * Hook for updating client information (email or phone)
 */
export function useUpdateClient() {
  const { data: session, update } = useSession();
  console.log(session);
  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationFn: async ({
      phoneNumber,
      email,
    }: {
      phoneNumber?: string;
      email?: string;
    }) => {
      const userId = session?.user?.id?.toString();

      if (!userId) {
        throw new Error("لم يتم العثور على معرف المستخدم");
      }

      const result = await updateClient(userId, phoneNumber, email);
      console.log(result.result);
      if (!result.success) {
        throw new Error(result.message);
      }

      return { data: result.data, variables: { phoneNumber, email } };
    },
    onSuccess: async ({ variables }) => {
      toast.success("تم تحديث البيانات بنجاح");

      // Update session with new values
      const updates: any = {};

      if (variables.email) {
        updates.email = variables.email;
        updates.emailConfirmed = false;
      }

      if (variables.phoneNumber) {
        updates.phoneNumber = variables.phoneNumber;
        updates.phoneNumberConfirmed = false;
      }

      await update(updates);
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء تحديث البيانات");
    },
  });

  return {
    isPending,
    error,
    updateClient: mutate,
    updateClientAsync: mutateAsync,
  };
}
