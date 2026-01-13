/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useFingerprint } from "@/components/providers/components/fingerprint-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle2, ArrowLeft } from "lucide-react";
import OTPForm from "@/app/auth/_components/otp-form";
import { sendEmailCode } from "./actions/send-email.action";
import { verifyEmailCode } from "./actions/verify-email.action";
import { updateUser } from "./actions/update-phone.action";

interface EmailVerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  userId: number;
}

export default function EmailVerificationDialog({
  isOpen,
  onClose,
  userEmail,
  userId,
}: EmailVerificationDialogProps) {
  const [step, setStep] = useState<"send" | "verify" | "update">("send");
  const [newEmail, setNewEmail] = useState("");
  const { data: session, update } = useSession();
  const router = useRouter();
  const { visitorId } = useFingerprint();

  // Send email OTP mutation
  const sendEmailMutation = useMutation({
    mutationFn: async () => {
      const result = await sendEmailCode();

      if (result.httpStatus >= 400) {
        throw new Error(result.message || "no error message");
      }
    },
    onSuccess: () => {
      toast.success("تم إرسال رمز التحقق إلى بريدك الإلكتروني");
      setStep("verify");
    },

    onError: (error) => {
      toast.error(error?.message || "حدث خطأ أثناء إرسال الرمز");
    },
  });

  // Verify email OTP mutation
  const verifyEmailMutation = useMutation({
    mutationFn: async (code: string) => {
      const result = await verifyEmailCode(code, visitorId || "");
      if (result.httpStatus >= 400) {
        throw new Error(result.message || "no error message");
      }
      return result;
    },
    onSuccess: async (result) => {
      console.log("\n📧 [Email Verification] Success!");
      console.log("Result:", result);

      toast.success("تم التحقق من البريد الإلكتروني بنجاح");

      // Check if WhatsApp is verified from current session
      const isWhatsAppVerified = session?.user?.phoneNumberConfirmed || false;
      console.log("📱 WhatsApp Verified:", isWhatsAppVerified);

      // Only update tokens if BOTH email and WhatsApp are verified
      if (
        isWhatsAppVerified &&
        result.data?.accessToken &&
        result.data?.refreshToken
      ) {
        console.log("✅ Both email and WhatsApp verified!");
        console.log("🔑 New tokens received from API:");
        console.log(
          "New Access Token:",
          result.data.accessToken.substring(0, 20) + "..."
        );
        console.log(
          "New Refresh Token:",
          result.data.refreshToken.substring(0, 20) + "..."
        );
        console.log("🔄 Calling session update with new tokens...");

        await update({
          accessToken: result.data.accessToken,
          refreshToken: result.data.refreshToken,
        });

        console.log("✅ Session updated with new tokens");
      } else if (!isWhatsAppVerified) {
        console.log("⚠️ WhatsApp not verified yet, skipping token update");
        console.log("🔄 Only refreshing profile data...");

        // Just refresh the profile to show email is now verified
        await update();

        console.log("✅ Profile refreshed (no token update)");
      } else {
        console.log("ℹ️ No new tokens in result, just refetching profile");
        await update();
        console.log("✅ Profile refetch completed");
      }

      onClose();
      router.refresh();
    },
    onError: (error) => {
      console.error("❌ [Email Verification] Error:", error);
      toast.error(error?.message || "حدث خطأ أثناء التحقق من الرمز");
    },
  });

  const handleSendCode = () => {
    sendEmailMutation.mutate();
  };

  const handleVerifyCode = (code: string) => {
    verifyEmailMutation.mutate(code);
  };

  // Update email mutation
  const updateEmailMutation = useMutation({
    mutationFn: async (email: string) => {
      const result = await updateUser(userId, "", email);

      if (!result.success) {
        throw new Error(result.message || "no error message");
      }
    },
    onSuccess: async () => {
      toast.success("تم تحديث البريد الإلكتروني بنجاح");
      await update();
      setStep("send");
      onClose();
      router.refresh();
    },

    onError: (error) => {
      toast.error(error?.message || "حدث خطأ أثناء تحديث البريد الإلكتروني");
    },
  });

  const handleUpdateEmail = () => {
    if (!newEmail.trim()) {
      toast.error("يرجى إدخال البريد الإلكتروني الجديد");
      return;
    }
    updateEmailMutation.mutate(newEmail.trim());
  };

  const handleClose = () => {
    setStep("send");
    setNewEmail("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="sm:max-w-md"
        dir="rtl"
      >
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-blue-600 flex items-center justify-center gap-2">
            <Mail className="h-6 w-6" />
            التحقق من البريد الإلكتروني
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            {step === "send"
              ? "سيتم إرسال رمز التحقق إلى بريدك الإلكتروني"
              : step === "verify"
              ? "أدخل الرمز المرسل إلى بريدك الإلكتروني"
              : "تحديث البريد الإلكتروني"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step 1: Send Code */}
          {step === "send" && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  البريد الإلكتروني: <strong>{userEmail}</strong>
                </p>
                <p className="text-sm text-gray-500">
                  اضغط على "إرسال الرمز" لتلقي رمز التحقق
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleSendCode}
                  disabled={sendEmailMutation.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12"
                >
                  {sendEmailMutation.isPending ? (
                    "جار الإرسال..."
                  ) : (
                    <>
                      إرسال رمز التحقق
                      <ArrowLeft className="w-5 h-5 mr-2" />
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => setStep("update")}
                  variant="outline"
                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  تحديث البريد الإلكتروني
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Verify Code */}
          {step === "verify" && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  تم إرسال الرمز إلى: <strong>{userEmail}</strong>
                </p>
                <p className="text-sm text-gray-500">
                  أدخل الرمز المكون من 6 أرقام
                </p>
              </div>

              <OTPForm
                onVerify={handleVerifyCode}
                isVerifyPending={verifyEmailMutation.isPending}
                title="رمز التحقق"
                description="أدخل الرمز المرسل إلى بريدك الإلكتروني (6 أرقام)."
                submitButtonText="تحقق من الرمز"
                submitButtonLoadingText="جار التحقق..."
                showResendButton={false}
              />
            </div>
          )}

          {/* Step 3: Update Email */}
          {step === "update" && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  البريد الإلكتروني الحالي: <strong>{userEmail}</strong>
                </p>
                <p className="text-sm text-gray-500">
                  أدخل البريد الإلكتروني الجديد
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="newEmail"
                  className="text-sm font-medium text-gray-700"
                >
                  البريد الإلكتروني الجديد
                </Label>
                <Input
                  id="newEmail"
                  type="email"
                  placeholder="أدخل البريد الإلكتروني الجديد"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setStep("send")}
                  variant="outline"
                  className="flex-1"
                >
                  العودة
                </Button>
                <Button
                  onClick={handleUpdateEmail}
                  disabled={updateEmailMutation.isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {updateEmailMutation.isPending ? "جار التحديث..." : "تحديث"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
