import { z } from "zod";

const PdfFileSchema = z
  .object({
    file: z.instanceof(File),
    name: z.string().min(1, "اسم الملف مطلوب"),
    description: z.string().min(1, "وصف الملف مطلوب"),
  })
  .refine((data) => data.file.size <= 10000000, {
    message: "حجم الملف يجب أن يكون أقل من 10 ميجابايت",
    path: ["file"],
  })
  .refine((data) => data.file.type === "application/pdf", {
    message: "يجب أن يكون الملف بصيغة PDF",
    path: ["file"],
  });

export const AddSettlementRequestSchema = z.object({
  CategoryId: z
    .string({
      message: "التصنيف مطلوب",
    })
    .min(1, "التصنيف مطلوب"),

  ClientType: z.enum(["client", "company"], {
    message: "نوع العميل مطلوب",
  }),

  ClientId: z
    .string({
      message: "العميل مطلوب",
    })
    .min(1, "العميل مطلوب"),

  ClientPosition: z.enum(["مدعي", "مدعي عليه"], {
    message: "صفة العميل مطلوبة",
  }),

  OpponentName: z.string().min(1, "اسم الخصم مطلوب"),

  OpponentIdNumber: z.string().min(1, "رقم هوية الخصم مطلوب"),

  DisputeSummary: z
    .string()
    .min(10, "يجب أن يكون ملخص النزاع 10 أحرف على الأقل"),

  settlementPdfs: z.array(PdfFileSchema.optional()).optional(),
});

export type AddSettlementRequestFields = z.infer<
  typeof AddSettlementRequestSchema
>;

export const SettlementCategorySchema = z.object({
  name: z.string().min(1, "اسم التصنيف مطلوب"),
  description: z.string().optional(),
  isActive: z.boolean(),
});

export type SettlementCategoryFields = z.infer<typeof SettlementCategorySchema>;

export const SettlementSessionSchema = z.object({
  sessionStatus: z.enum(["مؤجلة", "تعذر الصلح", "تم الصلح", "جلسة قادمة", ""], {
    message: "حالة الجلسة مطلوبة",
  }),
  sessionReport: z
    .string()
    .min(10, "يجب أن يكون تقرير الجلسة 10 أحرف على الأقل"),
  sessionDate: z
    .date({ error: "تاريخ الجلسة مطلوب" })
    .refine((date) => date !== null, { message: "تاريخ الجلسة مطلوب" }),
  descriptions: z.string().optional(),
  settlementPdf: z
    .object({
      file: z.instanceof(File),
      name: z.string().min(1, "اسم الملف مطلوب"),
      description: z.string().min(1, "وصف الملف مطلوب"),
    })
    .refine((data) => data.file.size <= 5000000, {
      message: "حجم الملف يجب أن يكون أقل من 5 ميجابايت",
      path: ["file"],
    })
    .refine((data) => data.file.type === "application/pdf", {
      message: "يجب أن يكون الملف بصيغة PDF",
      path: ["file"],
    })
    .optional()
    .nullable(),
});

export type SettlementSessionFields = z.infer<typeof SettlementSessionSchema>;
