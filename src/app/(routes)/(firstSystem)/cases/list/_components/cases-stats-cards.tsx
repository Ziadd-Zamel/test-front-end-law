import React from "react";
import { FolderOpen, CheckCircle2, BarChart3, Calendar } from "lucide-react";
import catchError from "@/lib/utils/catch-error";
import { GetCaseCount } from "@/lib/api/cases";
import { PageEmptyState } from "@/components/common/page-states";

export default async function CasesStatsCards() {
  const [cases, error] = await catchError(() => GetCaseCount());

  if (!cases) {
    return <PageEmptyState />;
  }

  if (error) {
    return <PageEmptyState />;
  }
  const stats = [
    {
      title: "القضايا النشطة",
      value: cases.data.activeCases,
      Icon: FolderOpen,
      bgColor: "bg-[#16DBCC]/15",
      iconColor: "text-[#16DBCC]",
    },
    {
      title: "القضايا المكتملة",
      value: cases.data.completedCases,
      Icon: CheckCircle2,
      bgColor: "bg-[#FFBB38]/15",
      iconColor: "text-[#FFBB38]",
    },
    {
      title: "إجمالي القضايا",
      value: cases.data.totalCases,
      Icon: BarChart3,
      bgColor: "bg-[#FF82AC]/15",
      iconColor: "text-[#FF82AC]",
    },
    {
      title: "إجمالي الجلسات",
      value: cases.data.totalSessions,
      Icon: Calendar,
      bgColor: "bg-[#396AFF]/15",
      iconColor: "text-[#396AFF]",
    },
  ];

  return (
    <div className="grid gap-4 text-sm md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="flex items-center gap-2 rounded-lg shadow-sm bg-white px-4 py-6"
        >
          {/* Icon */}
          <div
            className={`relative flex size-14 items-center justify-center rounded-full ${stat.bgColor} p-2`}
          >
            <stat.Icon className={`size-7 ${stat.iconColor}`} />
          </div>

          <div className="flex-1">
            {/* Title */}
            <p className="mb-2 font-medium text-zinc-500">{stat.title}</p>

            {/* Value */}
            <p className="text-lg font-semibold text-zinc-900">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
