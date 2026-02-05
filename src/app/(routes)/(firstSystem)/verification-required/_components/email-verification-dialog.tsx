/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
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
import {
  useActiveMail,
  useSendEmailCodeActivation,
  useUpdateClient,
} from "@/app/auth/_hooks/use-auth";

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
}: EmailVerificationDialogProps) {
  const [step, setStep] = useState<"send" | "verify" | "update">("send");
  const [newEmail, setNewEmail] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  // Use the new hooks
  const { isPending: isSendingCode, sendEmailCode } =
    useSendEmailCodeActivation();
  const { isPending: isVerifying, activeMail } = useActiveMail();
  const { isPending: isUpdating, updateClient } = useUpdateClient();

  const handleSendCode = () => {
    sendEmailCode(undefined, {
      onSuccess: () => {
        setStep("verify");
      },
    });
  };

  const handleVerifyCode = (code: string) => {
    activeMail(code, {
      onSuccess: () => {
        console.log("\n📧 [Email Verification] Success!");

        // Check if WhatsApp is verified from current session
        const isWhatsAppVerified = session?.user?.phoneNumberConfirmed || false;
        console.log("📱 WhatsApp Verified:", isWhatsAppVerified);

        if (isWhatsAppVerified) {
          console.log("✅ Both email and WhatsApp verified!");
        } else {
          console.log("⚠️ WhatsApp not verified yet");
        }

        onClose();
        router.refresh();
      },
    });
  };

  const handleUpdateEmail = () => {
    if (!newEmail.trim()) {
      toast.error("يرجى إدخال البريد الإلكتروني الجديد");
      return;
    }

    updateClient(
      { email: newEmail.trim() },
      {
        onSuccess: () => {
          setStep("send");
          setNewEmail("");
          onClose();
          router.refresh();
        },
      },
    );
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
                isVerifyPending={isVerifying}
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
