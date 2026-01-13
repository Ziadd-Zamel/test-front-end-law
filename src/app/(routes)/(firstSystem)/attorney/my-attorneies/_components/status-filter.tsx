"use client";
import * as React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
const statusLabels: Record<string, string> = {
  sent_to_client: "تم الإرسال للعميل",
  pending: "في الانتظار",
  approved: "موافق عليه",
  rejected: "مرفوض",
  in_progress: "قيد التنفيذ",
};

export default function StatuFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="اختر الحالة" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">كل الحالات</SelectItem>
        {Object.entries(statusLabels).map(([key, label]) => (
          <SelectItem key={key} value={key}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
