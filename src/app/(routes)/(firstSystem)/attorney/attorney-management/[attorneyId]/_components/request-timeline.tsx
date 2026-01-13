"use client";

import {
  InteractiveStepper,
  InteractiveStepperDescription,
  InteractiveStepperIndicator,
  InteractiveStepperItem,
  InteractiveStepperSeparator,
  InteractiveStepperTitle,
} from "@/components/ui/interactive-stepper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttorneyRequestData } from "@/lib/types/attorney";
import { cn } from "@/lib/utils";
import {
  BadgeCheck,
  Ban,
  Hourglass,
  CircleDot,
  Circle,
  XCircle,
  CheckCircle2,
  Clock5,
  Calendar,
} from "lucide-react";

interface RequestTimelineProps {
  data: AttorneyRequestData;
}

export default function RequestTimeline({ data }: RequestTimelineProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "لم يتم بعد";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("ar-EG", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch {
      return "لم يتم بعد";
    }
  };

  const steps = data.steps || [];
  // Only the first pending remains pending; subsequent pendings become inactive (muted)
  let seenFirstPending = false;
  const deriveDisplayStatus = (status: string) => {
    if (status === "pending") {
      if (seenFirstPending) return "inactive";
      seenFirstPending = true;
      return "pending";
    }
    return status;
  };

  const getStepConfig = (status: string) => {
    switch (status) {
      case "completed":
        return {
          icon: BadgeCheck,
          iconColor: "text-white",
          bgColor: "bg-emerald-500",
          lineColor: "!bg-emerald-400",
        };
      case "rejected":
        return {
          icon: Ban,
          iconColor: "text-white",
          bgColor: "bg-red-500",
          lineColor: "!bg-red-300",
        };
      case "current":
        return {
          icon: CircleDot,
          iconColor: "text-white",
          bgColor: "bg-blue-500",
          lineColor: "!bg-blue-300",
        };
      case "pending":
        return {
          icon: Hourglass,
          iconColor: "text-white",
          bgColor: "bg-amber-500",
          lineColor: "!bg-amber-300",
        };
      default:
        return {
          icon: Circle,
          iconColor: "text-white",
          bgColor: "bg-gray-300",
          lineColor: "!bg-gray-300",
        };
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5" />
          مسار الطلب
        </CardTitle>
      </CardHeader>
      <CardContent>
        <InteractiveStepper orientation="vertical">
          {steps.map((step, index) => {
            const displayStatus = deriveDisplayStatus(step.status);
            const cfg = getStepConfig(displayStatus);
            return (
              <InteractiveStepperItem
                key={step.stepNumber ?? index}
                completed={displayStatus === "completed"}
                disabled={false}
                className="mt-4 mb-1"
              >
                <div className="items-center flex flex-row">
                  <InteractiveStepperIndicator
                    className={`${cfg.bgColor} ${cfg.iconColor}`}
                  >
                    {displayStatus === "completed" && (
                      <CheckCircle2 className="h-6 w-6" />
                    )}
                    {displayStatus === "rejected" && (
                      <XCircle className="h-6 w-6" />
                    )}
                    {displayStatus === "pending" && (
                      <Clock5 className="h-6 w-6" />
                    )}
                    {displayStatus === "inactive" && (
                      <span className="text-white text-xl font-semibold">
                        {step.stepNumber ?? index + 1}
                      </span>
                    )}
                  </InteractiveStepperIndicator>
                  <div>
                    <InteractiveStepperTitle className="text-lg">
                      {step.stepName}
                    </InteractiveStepperTitle>
                    <InteractiveStepperDescription>
                      {displayStatus === "completed"
                        ? "مكتمل"
                        : displayStatus === "rejected"
                        ? "مرفوض"
                        : displayStatus === "current"
                        ? "جاري"
                        : displayStatus === "pending"
                        ? "في الانتظار"
                        : "غير مفعل"}
                      {step.date ? ` • ${formatDate(step.date)}` : ""}
                      {step.rejectionReason
                        ? ` • سبب الرفض: ${step.rejectionReason}`
                        : ""}
                    </InteractiveStepperDescription>
                  </div>
                </div>
                <InteractiveStepperSeparator
                  className={cn("!w-[2px] -ml-2", cfg.lineColor)}
                />
              </InteractiveStepperItem>
            );
          })}
        </InteractiveStepper>
      </CardContent>
    </Card>
  );
}
