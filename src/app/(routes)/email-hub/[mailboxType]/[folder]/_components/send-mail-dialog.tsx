"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { InfoMailForm } from "./info-mail-form";
import { EmployeeMailForm } from "./employee-mail-form";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function SendMailDialog() {
  const params = useParams();
  const [open, setOpen] = useState(false);

  const mailboxType = params.mailboxType as "Info" | "Auto" | "Employee";

  const getTitle = () => {
    switch (mailboxType) {
      case "Info":
        return "إرسال بريد للعملاء";
      case "Auto":
        return "إرسال إشعار تلقائي";
      case "Employee":
        return "إرسال بريد للموظفين";
      default:
        return "إرسال بريد إلكتروني";
    }
  };

  const handleSuccess = () => {
    setOpen(false);
  };

  if (mailboxType === "Auto") {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className={cn(
            "w-full flex items-center gap-4 rounded-lg text-xs cursor-pointer transition-colors px-2 py-2",
            "text-gray-700 hover:bg-gray-200 hover:text-black"
          )}
        >
          <Send className="h-4 w-4 shrink-0" />
          <span>إرسال بريد جديد</span>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto hide-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center text-blue-600">
            {getTitle()}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6">
          {mailboxType === "Info" && <InfoMailForm onSuccess={handleSuccess} />}
          {mailboxType === "Employee" && (
            <EmployeeMailForm onSuccess={handleSuccess} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
