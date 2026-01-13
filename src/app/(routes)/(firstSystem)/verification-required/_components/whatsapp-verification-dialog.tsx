/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useFingerprint } from "@/components/providers/components/fingerprint-client";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, CheckCircle2, ArrowLeft } from "lucide-react";
import OTPForm from "@/app/auth/_components/otp-form";
import { sendWhatsAppCode } from "./actions/send-whatsapp.action";
import { verifyWhatsAppCode } from "./actions/verify-whatsapp.action";
import { updateUser } from "./actions/update-phone.action";

interface WhatsAppVerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userPhone: string;
  userId: number;
}

export default function WhatsAppVerificationDialog({
  isOpen,
  onClose,
  userPhone,
  userId,
}: WhatsAppVerificationDialogProps) {
  const [step, setStep] = useState<"send" | "verify" | "update">("send");
  const [newPhone, setNewPhone] = useState("");
  const { data: session, update } = useSession();
  const router = useRouter();
  const { visitorId } = useFingerprint();

  // Send WhatsApp OTP mutation
  const sendWhatsAppMutation = useMutation({
    mutationFn: async () => {
      const result = await sendWhatsAppCode();
      if (result.httpStatus >= 400) {
        throw new Error(result.message || "no error message");
      }
    },
    onSuccess: () => {
      toast.success("تم إرسال رمز التحقق إلى واتساب");
      setStep("verify");
    },

    onError: (error) => {
      toast.error(error?.message || "حدث خطأ أثناء إرسال الرمز");
    },
  });

  // Verify WhatsApp OTP mutation
  const verifyWhatsAppMutation = useMutation({
    mutationFn: async (code: string) => {
      const result = await verifyWhatsAppCode(code, visitorId || "");
      if (result.httpStatus >= 400) {
        throw new Error(result.message || "no error message");
      }
      return result;
    },

    onSuccess: async (result) => {
      console.log("\n📱 [WhatsApp Verification] Success!");
      console.log("Result:", result);

      toast.success("تم التحقق من واتساب بنجاح");

      // Check if email is verified from current session
      const isEmailVerified = session?.user?.emailConfirmed || false;
      console.log("📧 Email Verified:", isEmailVerified);

      // Only update tokens if BOTH WhatsApp and email are verified
      if (
        isEmailVerified &&
        result.data?.accessToken &&
        result.data?.refreshToken
      ) {
        console.log("✅ Both WhatsApp and email verified!");
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
      } else if (!isEmailVerified) {
        console.log("⚠️ Email not verified yet, skipping token update");
        console.log("🔄 Only refreshing profile data...");

        // Just refresh the profile to show WhatsApp is now verified
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
      console.error("❌ [WhatsApp Verification] Error:", error);
      toast.error(error?.message || "حدث خطأ أثناء التحقق من الرمز");
    },
  });

  const handleSendCode = () => {
    sendWhatsAppMutation.mutate();
  };

  const handleVerifyCode = (code: string) => {
    verifyWhatsAppMutation.mutate(code);
  };

  // Update phone mutation
  const updatePhoneMutation = useMutation({
    mutationFn: async (email: string) => {
      const result = await updateUser(userId, email);

      if (!result.success) {
        throw new Error(result.message || "no error message");
      }
    },
    onSuccess: async () => {
      toast.success("تم تحديث رقم الهاتف بنجاح");
      await update();
      setStep("send");

      onClose();
      router.refresh();
    },

    onError: (error) => {
      toast.error(error?.message || "حدث خطأ أثناء تحديث رقم الهاتف");
    },
  });

  const handleUpdatePhone = () => {
    if (!newPhone.trim()) {
      toast.error("يرجى إدخال رقم الهاتف الجديد");
      return;
    }
    updatePhoneMutation.mutate(newPhone.trim());
  };

  const handleClose = () => {
    setStep("send");
    setNewPhone("");
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
            <Phone className="h-6 w-6" />
            التحقق من واتساب
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            {step === "send"
              ? "سيتم إرسال رمز التحقق إلى واتساب"
              : step === "verify"
              ? "أدخل الرمز المرسل إلى واتساب"
              : "تحديث رقم الهاتف"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step 1: Send Code */}
          {step === "send" && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  رقم الواتساب: <strong>{userPhone}</strong>
                </p>
                <p className="text-sm text-gray-500">
                  اضغط على "إرسال الرمز" لتلقي رمز التحقق
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleSendCode}
                  disabled={sendWhatsAppMutation.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12"
                >
                  {sendWhatsAppMutation.isPending ? (
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
                  تحديث رقم الهاتف
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
                  تم إرسال الرمز إلى: <strong>{userPhone}</strong>
                </p>
                <p className="text-sm text-gray-500">
                  أدخل الرمز المكون من 6 أرقام
                </p>
              </div>

              <OTPForm
                onVerify={handleVerifyCode}
                isVerifyPending={verifyWhatsAppMutation.isPending}
                title="رمز التحقق"
                description="أدخل الرمز المرسل إلى واتساب (6 أرقام)."
                submitButtonText="تحقق من الرمز"
                submitButtonLoadingText="جار التحقق..."
                showResendButton={false}
              />
            </div>
          )}

          {/* Step 3: Update Phone */}
          {step === "update" && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  رقم الهاتف الحالي: <strong>{userPhone}</strong>
                </p>
                <p className="text-sm text-gray-500">أدخل رقم الهاتف الجديد</p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="newPhone"
                  className="text-sm font-medium text-gray-700"
                >
                  رقم الهاتف الجديد
                </Label>
                <PhoneInput
                  value={newPhone}
                  onChange={(value) => setNewPhone(value || "")}
                  placeholder="أدخل رقم الهاتف الجديد"
                  defaultCountry="SA"
                  international
                  style={{ direction: "ltr" }}
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
                  onClick={handleUpdatePhone}
                  disabled={updatePhoneMutation.isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {updatePhoneMutation.isPending ? "جار التحديث..." : "تحديث"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
