"use client";

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
        visitorId || ""
      );

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: (data) => {
      toast.success("تم التسجيل بنجاح!");
      Cookies.set("registerToken", data.token);
      router.push("/auth/otp-email");
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
      router.push("/dashboard");
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
      router.push("/auth/otp-whatsapp");
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

  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationFn: async (code: string) => {
      const result = await verifyForgetCodeService(code, visitorId || "");

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success("تم التحقق من رقم واتساب بنجاح");
      router.push("/auth/forget-password/reset-password/whatsapp");
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
        router.push("/auth/login");
      } else if (variables.type === "WhatsApp") {
        Cookies.set("forgetPasswordToken", data.token);
        router.push("/auth/forget-password/reset-password/otp");
      }
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "حدث خطأ أثناء إرسال رمز إعادة تعيين كلمة المرور"
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
export function useResetEmailPassword(searchParams: {
  token?: string;
  email?: string;
}) {
  const router = useRouter();

  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationFn: async (data: ResetEmailPasswordFields) => {
      const { token, email } = searchParams;

      if (!token) {
        throw new Error("Token not found in URL");
      }

      if (!email) {
        throw new Error("Email not found in URL");
      }

      const result = await resetEmailPasswordService(data, { token, email });

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success(
        "تم إعادة تعيين كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول."
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
        "تم إعادة تعيين كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول."
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
        locationData
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
      const result = await refreshTokenService(session?.refreshToken || "");
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
