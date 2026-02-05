/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import {
  useActivePhone,
  useSendPhoneCodeActivation,
  useUpdateClient,
} from "@/app/auth/_hooks/use-auth";

interface WhatsAppVerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userPhone: string;
}

export default function WhatsAppVerificationDialog({
  isOpen,
  onClose,
  userPhone,
}: WhatsAppVerificationDialogProps) {
  const [step, setStep] = useState<"send" | "verify" | "update">("send");
  const [newPhone, setNewPhone] = useState("");
  const router = useRouter();

  // Use the new hooks
  const { isPending: isSendingCode, sendPhoneCode } =
    useSendPhoneCodeActivation();
  const { isPending: isVerifying, activePhone } = useActivePhone();
  const { isPending: isUpdating, updateClient } = useUpdateClient();

  const handleSendCode = () => {
    sendPhoneCode(undefined, {
      onSuccess: () => {
        setStep("verify");
      },
    });
  };

  const handleVerifyCode = (code: string) => {
    activePhone(code, {
      onSuccess: () => {
        onClose();
        router.refresh();
      },
    });
  };

  const handleUpdatePhone = () => {
    if (!newPhone.trim()) {
      toast.error("يرجى إدخال رقم الهاتف الجديد");
      return;
    }

    updateClient(
      { phoneNumber: newPhone.trim() },
      {
        onSuccess: () => {
          setStep("send");
          setNewPhone("");
          onClose();
          router.refresh();
        },
      },
    );
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
                  disabled={isSendingCode}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12"
                >
                  {isSendingCode ? (
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
                isVerifyPending={isVerifying}
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
                  disabled={isUpdating}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isUpdating ? "جار التحديث..." : "تحديث"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
