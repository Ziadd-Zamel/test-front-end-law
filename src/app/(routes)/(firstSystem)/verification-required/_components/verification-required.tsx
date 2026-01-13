"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import EmailVerificationDialog from "./email-verification-dialog";
import WhatsAppVerificationDialog from "./whatsapp-verification-dialog";

interface VerificationRequiredProps {
  emailConfirmed: boolean;
  phoneNumberConfirmed: boolean;
}

export default function VerificationRequired({
  emailConfirmed,
  phoneNumberConfirmed,
}: VerificationRequiredProps) {
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isWhatsAppDialogOpen, setIsWhatsAppDialogOpen] = useState(false);
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "";
  const userPhone = session?.user?.phoneNumber || "";
  const userId = session?.user?.id || 0;

  const cards = [
    {
      type: "email",
      title: "البريد الإلكتروني",
      description: "تحقق من صندوق الوارد الخاص بك",
      confirmed: emailConfirmed,
      icon: Mail,
      buttonText: "التحقق من البريد الإلكتروني",
    },
    {
      type: "phone",
      title: "رقم الهاتف",
      description: "تحقق من الرسائل القصيرة",
      confirmed: phoneNumberConfirmed,
      icon: Phone,
      buttonText: "التحقق من رقم الهاتف",
    },
  ];

  return (
    <div className="w-full box-container pt-16 pb-5">
      <div className="space-y-10">
        {/* Header Section */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-3">
            <div className="w-2 h-12 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              التحقق من الحساب مطلوب
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            يجب التحقق من بريدك الإلكتروني ورقم هاتفك قبل استخدام النظام. يرجى
            إكمال عملية التحقق للوصول إلى جميع الميزات.
          </p>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cards.map((card) => {
            const Icon = card.icon;
            const confirmed = card.confirmed;

            return (
              <Card
                key={card.type}
                className={cn(
                  "transition-all duration-300 border shadow-sm hover:shadow-md rounded-2xl",
                  confirmed
                    ? "border-green-200 bg-green-50/30"
                    : "border-red-200 bg-red-50/30"
                )}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div
                      className={cn(
                        "p-3 rounded-xl transition-colors",
                        confirmed
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div
                      className={cn(
                        "text-sm font-medium px-3 py-1 rounded-full",
                        confirmed
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      )}
                    >
                      {confirmed ? "تم التحقق" : "في انتظار التحقق"}
                    </div>
                  </div>
                  <CardTitle className="mt-4 text-xl text-gray-900">
                    {card.title}
                  </CardTitle>
                  <CardDescription className="text-gray-500">
                    {card.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="mt-4 flex items-center gap-2">
                    {confirmed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-red-600" />
                    )}
                    <span className="text-sm text-gray-600">
                      {confirmed ? "تم التحقق بنجاح" : "لم يتم التحقق بعد"}
                    </span>
                  </div>

                  {!confirmed && (
                    <Button
                      onClick={() => {
                        if (card.type === "email") {
                          setIsEmailDialogOpen(true);
                        } else if (card.type === "phone") {
                          setIsWhatsAppDialogOpen(true);
                        }
                      }}
                      className="w-full mt-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                    >
                      <Icon className="w-4 h-4 ml-2" />
                      {card.buttonText}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Email Verification Dialog */}
      <EmailVerificationDialog
        isOpen={isEmailDialogOpen}
        onClose={() => setIsEmailDialogOpen(false)}
        userEmail={userEmail}
        userId={userId}
      />

      {/* WhatsApp Verification Dialog */}
      <WhatsAppVerificationDialog
        isOpen={isWhatsAppDialogOpen}
        onClose={() => setIsWhatsAppDialogOpen(false)}
        userPhone={userPhone}
        userId={userId}
      />
    </div>
  );
}
