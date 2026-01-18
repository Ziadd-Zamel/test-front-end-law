"use client";
import { InfoMailForm } from "./info-mail-form";
import { useParams } from "next/navigation";
import { EmployeeMailForm } from "./employee-mail-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SendMailDialog() {
  const params = useParams();

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

  if (mailboxType === "Auto") {
    return null;
  }

  return (
    <div className="mt-6 box-container">
      <h2 className="text-3xl font-semibold text-blue-600 text-center mb-5">
        {getTitle()}
      </h2>
      <Card>
        <CardHeader className="sr-only">
          <CardTitle></CardTitle>
        </CardHeader>
        <CardContent className="">
          {mailboxType === "Info" && <InfoMailForm />}
          {mailboxType === "Employee" && <EmployeeMailForm />}
        </CardContent>
      </Card>
    </div>
  );
}
