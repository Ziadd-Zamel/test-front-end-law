import { signIn } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { LoginFields } from "@/lib/schemas/auth.schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useFingerprint } from "@/components/providers/components/fingerprint-client";
import { LocationData } from "@/lib/api/location.api";

interface LoginWithLocation extends LoginFields {
  locationData?: LocationData;
}

export default function useLogin() {
  const router = useRouter();
  const { visitorId } = useFingerprint();

  const { isPending, error, mutate } = useMutation({
    mutationFn: async ({
      identity,
      password,
      locationData,
    }: LoginWithLocation) => {
      const response = await signIn("credentials", {
        identity,
        password,
        visitorId,
        ip: locationData?.ip,
        country: locationData?.country,
        city: locationData?.city,
        latitude: locationData?.latitude,
        longitude: locationData?.longitude,
        plusCode: locationData?.plusCode,
        redirect: false,
      });

      if (response?.error?.startsWith("VERIFICATION_REQUIRED|||")) {
        const parts = response.error.split("|||");
        const token = parts[1];
        const message = parts[2];

        Cookies.set("verificationToken", token);

        toast.info(message);
        router.push("/auth/otp-login/otp");
        return { requiresVerification: true };
      }

      if (response?.error) {
        throw new Error(response.error);
      }

      return response;
    },
    onSuccess: (data) => {
      if (data && "requiresVerification" in data && data.requiresVerification) {
        return;
      }

      toast.success("مرحباً بك! تم تسجيل دخولك بنجاح.");
      router.push("/");
    },
    onError: (error) => {
      toast.error(error?.message || "حدث خطأ أثناء تسجيل الدخول");
    },
  });

  return {
    isPending,
    error,
    login: mutate,
  };
}
