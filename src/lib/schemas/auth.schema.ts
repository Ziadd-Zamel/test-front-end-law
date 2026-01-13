import { z } from "zod";

export const LoginSchema = z.object({
  identity: z.string({ error: "الهوية مطلوبة" }),
  visitorId: z.string().optional(),
  password: z
    .string({ error: "كلمة المرور مطلوبة" })
    .min(6, { error: "كلمة المرور يجب ان لا تقل عن 6 احرف او ارقام" }),
});

export type LoginFields = z.infer<typeof LoginSchema>;

export const RegisterSchema = z
  .object({
    identity: z.string({ error: "الهوية مطلوبة" }),
    fullName: z
      .string({ error: "الاسم الكامل مطلوب" })
      .min(2, { message: "الاسم الكامل يجب أن يكون حرفين على الأقل" }),
    dateOfBirth: z
      .date({ error: "تاريخ الميلاد مطلوب" })
      .refine((date) => date !== null, { message: "تاريخ الميلاد مطلوب" }),
    email: z
      .string({ error: "البريد الإلكتروني مطلوب" })
      .email({ message: "البريد الإلكتروني غير صحيح" }),
    phoneNumber: z
      .string({ error: "رقم الهاتف مطلوب" })
      .min(11, { message: "رقم الهاتف يجب أن يكون 11 رقم على الأقل" }),
    passwordHash: z
      .string({ error: "كلمة المرور مطلوبة" })
      .min(6, { error: "كلمة المرور يجب ان لا تقل عن 6 احرف او ارقام" }),
    confirmPassword: z.string({ error: "تأكيد كلمة المرور مطلوب" }),
  })
  .refine((data) => data.passwordHash === data.confirmPassword, {
    message: "كلمة المرور وتأكيد كلمة المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

export type RegisterFields = z.infer<typeof RegisterSchema>;

export const VerifyEmailSchema = z.object({
  code: z
    .string({ error: "رمز التحقق مطلوب" })
    .min(6, { message: "رمز التحقق يجب أن يكون 6 أرقام" })
    .max(6, { message: "رمز التحقق يجب أن يكون 6 أرقام" })
    .regex(/^\d+$/, { message: "رمز التحقق يجب أن يحتوي على أرقام فقط" }),
});

export type VerifyEmailFields = z.infer<typeof VerifyEmailSchema>;

export const ForgetPasswordSchema = z.object({
  identity: z.string({ error: "الهوية مطلوبة" }),
  type: z.enum(["Email", "WhatsApp"], {
    error: "نوع الإرسال مطلوب",
  }),
});

export type ForgetPasswordFields = z.infer<typeof ForgetPasswordSchema>;

export const ResetEmailPasswordSchema = z
  .object({
    password: z
      .string({ error: "كلمة المرور مطلوبة" })
      .min(6, { error: "كلمة المرور يجب ان لا تقل عن 6 احرف او ارقام" }),
    confirmPassword: z.string({ error: "تأكيد كلمة المرور مطلوب" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمة المرور وتأكيد كلمة المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

export const ResetWhatsPasswordSchema = z
  .object({
    password: z
      .string({ error: "كلمة المرور مطلوبة" })
      .min(6, { error: "كلمة المرور يجب ان لا تقل عن 6 احرف او ارقام" }),
    confirmPassword: z.string({ error: "تأكيد كلمة المرور مطلوب" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمة المرور وتأكيد كلمة المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

export type ResetEmailPasswordFields = z.infer<typeof ResetEmailPasswordSchema>;
export type ResetWhatsPasswordFields = z.infer<typeof ResetWhatsPasswordSchema>;

export const SendVerificationCodeSchema = z.object({
  identity: z.string().min(1, "رقم الهوية الوطنية مطلوب"),
});

export type SendVerificationCodeFields = z.infer<
  typeof SendVerificationCodeSchema
>;
