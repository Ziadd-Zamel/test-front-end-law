import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettlementDetailsSkeleton() {
  return (
    <div className="w-full space-y-6 box-container">
      {/* ==================== HEADER ==================== */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-7 w-24 rounded-full" />
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-48" />
          </div>
        </CardContent>
      </Card>

      {/* ==================== PARTIES ==================== */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ==================== DISPUTE ==================== */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>

        <CardContent className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-4 bg-blue-50 rounded-lg space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ==================== SESSIONS TABLE ==================== */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-44" />
        </CardHeader>

        <CardContent className="p-0">
          <div className="space-y-3 p-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="grid grid-cols-4 gap-4 items-center">
                <Skeleton className="h-4 w-20 mx-auto" />
                <Skeleton className="h-4 w-28 mx-auto" />
                <Skeleton className="h-6 w-24 mx-auto rounded-full" />
                <Skeleton className="h-8 w-8 mx-auto rounded-md" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
