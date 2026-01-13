export const SETTLEMENT_STATUSES: SettlementStatus[] = [
  {
    value: "550e8400-e29b-41d4-a716-446655440000",
    label: "قيد النظر",
  },
  {
    value: "550e8400-e29b-41d4-a716-446655440001",
    label: "تم الصلح",
  },
  {
    value: "550e8400-e29b-41d4-a716-446655440002",
    label: "تعذر الصلح",
  },
];

export const SETTLEMENT_TABLE_HEADERS = [
  { headName: "التصنيف", className: "text-center" },
  { headName: "اسم العميل", className: "text-center" },
  { headName: "صفة العميل", className: "text-center" },
  { headName: "اسم الخصم", className: "text-center" },
  { headName: "تاريخ الإنشاء", className: "text-center" },
  { headName: "الحالة", className: "text-center" },
  { headName: "الإجراءات", className: "text-center" },
];

export const SETTLEMENT_SESSION_TABLE_HEADERS = [
  { headName: "رقم الجلسة", className: "text-center" },
  { headName: "تاريخ الجلسة", className: "text-center" },
  { headName: "الحالة", className: "text-center" },
  { headName: "", className: "text-center" },
];

export const SETTLEMENT_SESSION_STATUSES = [
  { label: "جديدة", value: "new-guid" },
  { label: "قيد المراجعة", value: "review-guid" },
  { label: "مكتملة", value: "done-guid" },
  { label: "ملغاة", value: "cancel-guid" },
];

export const SETTLEMENT_CATEGORY_TABLE_HEADERS = [
  { headName: "اسم التصنيف", className: "text-center" },
  { headName: "الوصف", className: "text-center" },
  { headName: "الحالة", className: "text-center" },
  { headName: "الإجراءات", className: "text-center" },
];
