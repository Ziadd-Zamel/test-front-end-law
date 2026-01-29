import { z } from "zod";

// Add Contact Schema
export const AddContactSchema = z.object({
  name: z.string({ message: "الاسم مطلوب" }).min(1, "يرجى كتابة الاسم"),
  JobPosition: z.string().optional(),
  email: z.string().optional(),
  phoneNumber: z.string().optional(),
});

// Update Contact Schema
export const UpdateContactSchema = z.object({
  clientName: z.string({ message: "الاسم مطلوب" }).min(1, "يرجى كتابة الاسم"),
  email: z
    .string({ message: "البريد الإلكتروني مطلوب" })
    .email("البريد الإلكتروني غير صحيح")
    .min(1, "يرجى كتابة البريد الإلكتروني"),
  phoneNumber: z
    .string({ message: "رقم الهاتف مطلوب" })
    .min(1, "يرجى إدخال رقم الهاتف"),
});

export type AddContactFields = z.infer<typeof AddContactSchema>;
export type UpdateContactFields = z.infer<typeof UpdateContactSchema>;
