"use client";
import OTPForm from "../../_components/otp-form";
import { useVerifyEmailCode } from "../../_hooks/use-auth";

export default function VerifyEmailForm() {
  const { verify, isPending: isVerifyPending } = useVerifyEmailCode();

  return <OTPForm onVerify={verify} isVerifyPending={isVerifyPending} />;
}
