"use client";

import { useFingerprint } from "@/components/providers/components/fingerprint-client";
import OTPForm from "../../_components/otp-form";
import { useVerificationLogin } from "../_hooks/use-verification-login";

export default function VerifyCodeForm() {
  const { loginWithCode, isPending: isVerifyPending } = useVerificationLogin();
  const { visitorId } = useFingerprint();
  const handleVerify = (code: string) => {
    loginWithCode({
      code,
      visitorId: visitorId || "",
    });
  };

  return (
    <OTPForm
      onVerify={handleVerify}
      isVerifyPending={isVerifyPending}
      title="رمز التحقق"
      description="أدخل رمز التحقق المرسل إليك (6 أرقام)"
      submitButtonText="تسجيل الدخول"
      submitButtonLoadingText="جاري التحقق..."
    />
  );
}
