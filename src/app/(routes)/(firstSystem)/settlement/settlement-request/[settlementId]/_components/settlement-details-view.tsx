"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Users,
  FileText,
  Scale,
  CheckCircle2,
  Paperclip,
  User,
  IdCard,
} from "lucide-react";
import { PdfCard } from "@/components/common/pdf-card";

// ==================== HELPERS ====================

const getBadgeVariant = (
  status: string
): "success" | "error" | "warning" | "info" | "neutral" => {
  switch (status) {
    case "تم الصلح":
      return "success";
    case "تعذر الصلح":
      return "error";
    case "قيد النظر":
      return "warning";
    default:
      return "neutral";
  }
};

// ==================== COMPONENT ====================

export default function SettlementDetailsView({
  data,
}: {
  data: SettlementDetails;
}) {
  return (
    <>
      {/* ==================== STATUS HEADER ==================== */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="text-2xl text-blue-600 flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6" />
              تفاصيل طلب الصلح
            </CardTitle>

            <Badge variant={getBadgeVariant(data.status)} className="px-3 py-1">
              {data.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <p className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-blue-600" />
              <strong>تاريخ الإنشاء:</strong> {data.createdAtFormatted}
            </p>

            <p className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-blue-600" />
              <strong>التصنيف:</strong> {data.categoryName}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ==================== PARTIES SECTION ==================== */}
      <Card className="shadow-md border-blue-100">
        <CardHeader className="border-b border-blue-100">
          <CardTitle className="flex items-center gap-2 ">
            <Users className="h-5 w-5" />
            أطراف النزاع
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Plaintiff Card */}
            <div className="relative">
              <div className="absolute -top-3 right-4 bg-gray-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                العميل
              </div>
              <div className="border-2 border-gray-200 rounded-lg p-6 bg-gradient-to-br from-gray-50 to-white h-full">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                      <User className="h-3.5 w-3.5" />
                      <span>الاسم</span>
                    </div>
                    <p className="font-semibold text-lg text-gray-900">
                      {data.clientName}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                      <Scale className="h-3.5 w-3.5" />
                      <span>الصفة</span>
                    </div>
                    <p className="text-gray-700">{data.clientPosition}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Defendant Card */}
            <div className="relative">
              <div className="absolute -top-3 right-4 bg-gray-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                الخصم
              </div>
              <div className="border-2 border-gray-200 rounded-lg p-6 bg-gradient-to-br from-gray-50 to-white h-full">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                      <User className="h-3.5 w-3.5" />
                      <span>الاسم</span>
                    </div>
                    <p className="font-semibold text-lg text-gray-900">
                      {data.opponentName}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                      <IdCard className="h-3.5 w-3.5" />
                      <span>رقم الهوية</span>
                    </div>
                    <p className="text-gray-700 font-mono">
                      {data.opponentIdNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ==================== DISPUTE DETAILS ==================== */}
      <Card className="shadow-md border-blue-100">
        <CardHeader className="border-b border-blue-100">
          <CardTitle className="flex items-center gap-2 ">
            <FileText className="h-5 w-5" />
            تفاصيل النزاع
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-5">
          {/* Dispute Summary */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-1 w-1 rounded-full bg-blue-600"></div>
              <h3 className="font-semibold text-gray-900">ملخص النزاع</h3>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-blue-50/50 rounded-lg p-3">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {data.disputeSummary || "لم يتم تقديم ملخص للنزاع"}
              </p>
            </div>
          </div>

          {/* Claims */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-1 w-1 rounded-full bg-blue-600"></div>
              <h3 className="font-semibold text-gray-900">المطالبات</h3>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-blue-50/50 rounded-lg p-3">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {data.claims || "لم يتم تقديم مطالبات"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ==================== ATTACHMENTS ==================== */}
      <Card className="shadow-md border-blue-100">
        <CardHeader className="border-b border-blue-100">
          <CardTitle className="flex items-center gap-2 ">
            <Paperclip className="h-5 w-5" />
            المرفقات
            {data.attachments?.length > 0 && (
              <Badge variant="outline" className="mr-auto bg-white">
                {data.attachments.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          {data.attachments?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.attachments.map((attachment) => (
                <PdfCard key={attachment.id} pdf={attachment} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Paperclip className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">لا توجد مرفقات</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
