// Updated hook for verification code login with token
"use client";

import { signIn } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface VerificationLoginFields {
  code: string;
  visitorId: string;
}

// Hook for verification code login
export function useVerificationLogin() {
  const router = useRouter();

  const { isPending, error, mutate } = useMutation({
    mutationFn: async ({ code, visitorId }: VerificationLoginFields) => {
      const verificationToken = Cookies.get("verificationToken");

      if (!verificationToken) {
        throw new Error(
          "لم يتم العثور على رمز التحقق. يرجى إعادة طلب رمز التحقق."
        );
      }

      const response = await signIn("verification-code", {
        code,
        visitorId,
        token: verificationToken,
        redirect: false,
      });
      if (response?.error) {
        throw new Error(response.error);
      }

      return response;
    },
    onSuccess: () => {
      Cookies.remove("verificationToken");
      Cookies.remove("userPhone");

      toast.success("مرحباً بك! تم تسجيل دخولك بكود التحقق بنجاح.");
      router.push("/");
    },
    onError: (error) => {
      console.error("Verification login error:", error);
      toast.error(error?.message || "كود التحقق غير صحيح");
    },
  });

  return {
    isPending,
    error,
    loginWithCode: mutate,
  };
}
