import { z } from "zod";

export const AddCaseSchema = z.object({
  CaseNumber: z.string().min(1, "رقم القضية مطلوب"),
  OpponentName: z.string().min(1, "اسم الخصم مطلوب"),
  CourtName: z.string().min(1, "اسم المحكمة مطلوب"),

  ClientType: z.enum(["client", "company"], {
    message: "نوع العميل مطلوب",
  }),

  ClientId: z
    .string({
      message: "العميل مطلوب",
    })
    .min(1, "العميل مطلوب"),

  EmployeesIds: z.array(z.string()).min(1, "يجب اختيار موظف واحد على الأقل"),

  CaseTitle: z.string().min(1, "عنوان القضية مطلوب"),

  CategoryId: z
    .string({
      message: "التصنيف مطلوب",
    })
    .min(0, "التصنيف مطلوب"),
  CaseCategory: z.string().optional(),

  ClientPosition: z.enum(["مدعي", "مدعي عليه"], {
    message: "صفة العميل مطلوبة",
  }),

  AdditionalNotes: z.string().optional(),
});

export type AddCaseFields = z.infer<typeof AddCaseSchema>;
