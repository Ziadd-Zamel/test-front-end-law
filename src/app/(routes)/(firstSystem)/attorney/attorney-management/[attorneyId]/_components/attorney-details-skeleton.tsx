import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

export default function AttorneyDetailsSkeleton() {
  return (
    <div className="w-full mt-8 space-y-6 box-container">
      {/* Header with Status Skeleton */}
      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="text-2xl flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-gray-300" />
              <Skeleton className="h-7 w-48" />
            </CardTitle>
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-300" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-gray-300" />
                <Skeleton className="h-4 w-36" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-300" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-gray-300" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* Lawyer Information Skeleton */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-gray-300" />
              <Skeleton className="h-5 w-32" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      {i === 0 && <User className="h-4 w-4 text-gray-300" />}
                      {i === 1 && <IdCard className="h-4 w-4 text-gray-300" />}
                      {i === 2 && <Phone className="h-4 w-4 text-gray-300" />}
                      {i === 3 && (
                        <CalendarDays className="h-4 w-4 text-gray-300" />
                      )}
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-4 w-36" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attorney Types Skeleton */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ListTree className="h-5 w-5 text-gray-300" />
              <Skeleton className="h-5 w-28" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="pr-4 border-r-2 border-gray-200">
                    <div className="flex items-start gap-2">
                      <div className="mt-1 h-2 w-2 rounded-full bg-gray-300" />
                      <Skeleton className="h-4 w-full max-w-[200px]" />
                    </div>
                    {i === 0 && (
                      <div className="mt-3 pr-4 ml-4 space-y-2">
                        {[...Array(2)].map((_, j) => (
                          <div key={j} className="flex items-start gap-2">
                            <div className="mt-1 h-2 w-2 rounded-full bg-gray-300" />
                            <Skeleton className="h-4 w-40" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Notes Skeleton */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-gray-300" />
            <Skeleton className="h-5 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-blue-50 rounded-lg space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
