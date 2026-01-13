import { AlertTriangle, FileSearch, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

/* ==================== EMPTY ==================== */

export function PageEmptyState() {
  return (
    <div className="box-container p-5 md:p-20">
      <Card className="min-h-[420px] flex items-center justify-center">
        <CardContent className="flex flex-col items-center text-center gap-6 py-16">
          <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
            <FileSearch className="h-12 w-12 text-gray-400" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-900">
              لا توجد بيانات
            </h2>

            <p className="text-gray-600 max-w-md leading-relaxed">
              لم يتم العثور على أي بيانات مرتبطة بهذه الصفحة.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ==================== ERROR ==================== */

export function PageErrorState({ error }: { error?: string | Error }) {
  const message = error instanceof Error ? error.message : error;

  return (
    <div className="box-container p-5 md:p-20">
      <Card className="min-h-[420px] flex items-center justify-center">
        <CardContent className="flex flex-col items-center text-center gap-6 py-16">
          <div className="h-24 w-24 rounded-full bg-red-50 flex items-center justify-center">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-900">
              تعذّر تحميل البيانات
            </h2>

            <p className="text-gray-600 max-w-md leading-relaxed">
              حدث خطأ أثناء جلب بيانات الصفحة.
            </p>
          </div>

          {message && (
            <div className="mt-2 max-w-md rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {message}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ==================== LOADING ==================== */

export function PageLoadingState() {
  return (
    <div className="box-container p-5 md:p-20">
      <Card className="min-h-[420px] flex items-center justify-center">
        <CardContent className="flex flex-col items-center gap-6 py-16">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="text-gray-600 text-base">جاري تحميل البيانات...</p>
        </CardContent>
      </Card>
    </div>
  );
}
