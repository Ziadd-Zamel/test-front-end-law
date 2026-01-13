import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  MapPin,
  User,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { AttorneyValidationData } from "@/lib/types/attorney";

interface AttorneyValidationResultProps {
  data: AttorneyValidationData;
}

const getBadgeVariant = (
  status: string
): "success" | "error" | "warning" | "info" | "neutral" => {
  switch (status) {
    case "معتمدة":
      return "success";
    case "منتهية":
    case "مفسوخة كلياً":
      return "error";
    default:
      return "neutral";
  }
};

export default function AttorneyValidationResult({
  data,
}: AttorneyValidationResultProps) {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("ar-SA");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="w-full mt-8 space-y-6">
      {/* Header with Status */}
      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="text-2xl text-blue-600 flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6" />
              تم التحقق من الوكالة بنجاح
            </CardTitle>
            <div className="flex justify-center">
              <Badge
                variant={getBadgeVariant(data.status)}
                className="px-3 py-1"
              >
                {data.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <strong>رقم الوكالة:</strong> {data.code}
              </p>
              <p className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <strong>نوع الوكالة:</strong> {data.attorneyType}
              </p>
            </div>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-blue-600" />
                <strong>تاريخ الإصدار:</strong> {data.issueGregDate} (
                {data.issueHijriDate})
              </p>
              <p className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-blue-600" />
                <strong>تاريخ الانتهاء:</strong> {data.expiryGregDate} (
                {data.expiryHijriDate})
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* Agents Information */}
        <Card className="w-full h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              المخولون بالتوكيل ({data.agents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.agents.map((agent) => (
                <div key={agent.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500">الاسم</p>
                        <p className="font-semibold text-gray-900">
                          {agent.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500">رقم الهوية</p>
                        <p className="font-medium text-gray-800">{agent.id}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500">تاريخ الميلاد</p>
                        <p className="font-medium text-gray-800">
                          {formatDate(agent.birthday)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500">الصفة</p>
                        <Badge variant="outline" className="mt-1">
                          {agent.sefaName}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600">
                  <strong>سلوك الوكلاء:</strong> {data.agentsBehavior.ar}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Principals Information */}
        <Card className="w-full h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              الوكلاء ({data.allowedToActOnBehalf.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.allowedToActOnBehalf.map((person, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500">الاسم</p>
                        <p className="font-semibold text-gray-900">
                          {person.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500">رقم الهوية</p>
                        <p className="font-medium text-gray-800">
                          {person.identityNo}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500">النوع</p>
                        <p className="font-medium text-gray-800">
                          {person.typeName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500">الصفة</p>
                        <Badge variant="outline" className="mt-1">
                          {person.sefaName}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Location and Services */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5" />
            الموقع والخدمات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-800">
                <strong>مكان الإصدار:</strong> {data.location.name}
              </p>
            </div>

            {data.textList && data.textList.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">تفاصيل الخدمات:</h4>
                <div className="grid gap-2">
                  {data.textList.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-blue-800 flex-1">{item.text}</p>
                        {item.type && (
                          <Badge
                            variant="outline"
                            className="text-blue-600 text-xs"
                          >
                            {item.type}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Full Text */}
      {data.text && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5" />
              نص الوكالة كاملاً
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm leading-relaxed text-gray-700">
                {data.text}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
