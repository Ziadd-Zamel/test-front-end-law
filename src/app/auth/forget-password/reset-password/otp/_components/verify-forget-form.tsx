"use client";

import OTPForm from "@/app/auth/_components/otp-form";
import { useVerifyCode } from "@/app/auth/_hooks/use-auth";

export default function VerifyForgetForm() {
  const { verify, isPending: isVerifyPending } = useVerifyCode();

  return <OTPForm onVerify={verify} isVerifyPending={isVerifyPending} />;
}
