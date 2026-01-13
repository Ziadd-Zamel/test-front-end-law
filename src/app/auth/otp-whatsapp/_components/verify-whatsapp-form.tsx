"use client";

import OTPForm from "../../_components/otp-form";
import { useVerifyWhatsappCode } from "../../_hooks/use-auth";

export default function VerifywhatsappForm() {
  const { verify, isPending: isVerifyPending } = useVerifyWhatsappCode();

  return <OTPForm onVerify={verify} isVerifyPending={isVerifyPending} />;
}
