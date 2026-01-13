"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  CalendarDays,
  User,
  FileText,
  CheckCircle2,
  Phone,
  IdCard,
  Clock,
  Briefcase,
  ListTree,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { PageEmptyState } from "@/components/common/page-states";
import {
  Attorney,
  AttorneyRequestData,
  AttorneyTypeControl,
} from "@/lib/types/attorney";
import { useState } from "react";
import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";
import RequestTimeline from "./request-timeline";

interface AttorneyValidationResultProps {
  data: AttorneyRequestData;
}

// Use generic badge variants like in the management table
const getBadgeVariant = (
  status: Attorney["status"]
): "success" | "error" | "warning" | "info" | "neutral" => {
  switch (status) {
    case "approved":
      return "success";
    case "rejected":
      return "error";
    case "pending":
      return "warning";
    case "sent_to_client":
      return "success";
    case "in_progress":
    default:
      return "neutral";
  }
};

const getStatusLabel = (status: Attorney["status"]): string => {
  const labels: Record<Attorney["status"], string> = {
    sent_to_client: "مرسلة للعميل",
    pending: "قيد الانتظار",
    approved: "معتمدة",
    rejected: "مرفوضة",
    in_progress: "قيد المعالجة",
  };
  return labels[status];
};

// Helper function to get duration label
const getDurationLabel = (duration: string) => {
  const durationLabels: Record<string, string> = {
    "3_months": "3 أشهر",
    "6_months": "6 أشهر",
    "9_months": "9 أشهر",
    "1_year": " سنة",
    unlimited: "غير محدودة",
  };
  return durationLabels[duration] || duration;
};

const AttorneyTypeTree = ({
  types,
  level = 0,
}: {
  types: AttorneyTypeControl[];
  level?: number;
}) => {
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});

  const toggleCollapsible = (typeId: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [typeId]: !prev[typeId],
    }));
  };

  return (
    <div className="space-y-1">
      {types.map((type) => {
        const hasChildren = type.childControls && type.childControls.length > 0;
        const isOpen = openItems[type.id] || false;

        return (
          <div key={type.id}>
            {hasChildren ? (
              <Collapsible
                open={isOpen}
                onOpenChange={() => toggleCollapsible(type.id)}
              >
                <div
                  className="flex items-center gap-2 py-2  hover:bg-blue-50 rounded-md transition-colors"
                  style={{ paddingRight: `${level * 1.5}rem` }}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      type="button"
                      variant={"ghost"}
                      className="p-1 hover:bg-blue-100 rounded transition-colors mr-1"
                    >
                      {isOpen ? (
                        <ChevronDown className="h-4 w-4 text-blue-600" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-blue-600" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <p className="text-sm font-medium text-gray-800 flex-1">
                    {type.attorneyTypeName}
                  </p>
                </div>
                <CollapsibleContent>
                  <AttorneyTypeTree
                    types={type.childControls}
                    level={level + 1}
                  />
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <div
                className="flex items-center gap-2 py-2 hover:bg-blue-50 rounded-md transition-colors"
                style={{ paddingRight: `${level * 1.5 + 1.5}rem` }}
              >
                <div className="h-2 w-2 rounded-full bg-blue-400" />
                <p className="text-sm font-medium text-gray-800 flex-1">
                  {type.attorneyTypeName}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default function AttorneyDetails({
  data,
}: AttorneyValidationResultProps) {
  if (!data) {
    return <PageEmptyState />;
  }
  return (
    <div className="w-full mt-8 space-y-6 box-container">
      {/* Header with Status */}
      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="text-2xl text-blue-600 flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6" />
              تفاصيل طلب الوكالة
            </CardTitle>
            <div className="flex justify-center">
              <Badge
                variant={getBadgeVariant(data.status)}
                className="px-3 py-1"
              >
                {getStatusLabel(data.status)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                <strong>اسم العميل:</strong> {data.clientName}
              </p>
              <p className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-blue-600" />
                <strong>نوع العميل:</strong>
                {data.clientType === "client" && "شخصية طبيعية"}
                {data.clientType === "company" && "شخصية اعتبارية"}
              </p>
            </div>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <strong>مدة الوكالة:</strong>{" "}
                {getDurationLabel(data.attorneyDuration)}
              </p>
              <p className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-blue-600" />
                <strong>الصفة:</strong> {data.attorneyCapacity}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* Lawyer Information */}
        <Card className="w-full h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              بيانات المحامي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-500">الاسم</p>
                      <p className="font-semibold text-gray-900">
                        {data.lawyerName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <IdCard className="h-4 w-4 text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-500">
                        رقم الهوية الوطنية
                      </p>
                      <p className="font-medium text-gray-800">
                        {data.lawyerNationalID}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-500">رقم الهاتف</p>
                      <p className="font-medium text-gray-800" dir="ltr">
                        {data.lawyerPhone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-500">تاريخ الميلاد</p>
                      <p className="font-medium text-gray-800">
                        {data.lawyerDateOfBirth}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attorney Types */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ListTree className="h-5 w-5" />
              أنواع الوكالة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 rounded-lg max-h-96 overflow-y-auto">
              {data.attorneyType && data.attorneyType.length > 0 ? (
                <AttorneyTypeTree types={data.attorneyType} />
              ) : (
                <p className="text-sm text-gray-500">
                  لا توجد أنواع وكالة محددة
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Request Timeline */}
      <RequestTimeline data={data} />

      {/* Additional Notes */}
      {data.additionalNotes && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5" />
              ملاحظات إضافية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="p-4 bg-blue-50 rounded-lg text-gray-700 
                         [&_ul]:list-disc [&_ul]:ps-6 
                         [&_ol]:list-decimal [&_ol]:ps-6 
                         [&_li]:mb-1"
              dangerouslySetInnerHTML={{ __html: data.additionalNotes }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
