import { z } from "zod";

export const ReplySchema = z.object({
  replyBodyHtml: z
    .string({ message: "الرد مطلوب" })
    .min(1, "الرجاء كتابة الرد"),
});

export type ReplyFields = z.infer<typeof ReplySchema>;

// Mail Schema (Info)
export const SendMailSchema = z.object({
  subject: z.string({ message: "الموضوع مطلوب" }).min(1, "يرجى كتابة الموضوع"),
  refType: z.enum(["task", "case"], {
    message: "نوع المرجع مطلوب",
  }),
  refId: z.string({
    message: "المعرف مطلوب",
  }),
  bodyHtml: z
    .string({ message: "نص الرسالة مطلوب" })
    .min(1, "يرجى كتابة نص الرسالة"),
});

// Auto Mail Schema
export const SendAutoMailSchema = z.object({
  subject: z.string({ message: "الموضوع مطلوب" }).min(1, "يرجى كتابة الموضوع"),
  content: z.string({ message: "المحتوى مطلوب" }).min(1, "يرجى كتابة المحتوى"),
  refType: z.enum(["task", "case"], {
    message: "نوع المرجع مطلوب",
  }),
  refId: z.string({
    message: "المعرف مطلوب",
  }),
});

// Employee Mail Schema
export const SendEmployeeMailSchema = z.object({
  recipientEmployeeId: z
    .array(z.string())
    .min(1, "يجب اختيار موظف واحد على الأقل"),
  subject: z.string({ message: "الموضوع مطلوب" }).min(1, "يرجى كتابة الموضوع"),
  content: z.string({ message: "المحتوى مطلوب" }).min(1, "يرجى كتابة المحتوى"),
});

export type SendMailFields = z.infer<typeof SendMailSchema>;
export type SendAutoMailFields = z.infer<typeof SendAutoMailSchema>;
export type SendEmployeeMailFields = z.infer<typeof SendEmployeeMailSchema>;

export const UpdateMessageSchema = z.object({
  refType: z.enum(["task", "case"], {
    message: "نوع المرجع مطلوب",
  }),
  refId: z.string({
    message: "المعرف مطلوب",
  }),
});

export type UpdateMessageFields = z.infer<typeof UpdateMessageSchema>;
