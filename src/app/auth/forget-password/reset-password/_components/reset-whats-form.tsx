"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ResetWhatsPasswordFields,
  ResetWhatsPasswordSchema,
} from "@/lib/schemas/auth.schema";
import { PasswordInput } from "@/app/auth/_components/password-input";
import { useResetWhatsPassword } from "@/app/auth/_hooks/use-auth";

export default function ResetWhatsAppPasswordForm() {
  // Hooks
  const { resetWhatsPassword, isPending } = useResetWhatsPassword();

  // Form setup with validation
  const form = useForm<ResetWhatsPasswordFields>({
    resolver: zodResolver(ResetWhatsPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Handles form submission for whatsapp reset
  async function onSubmit(values: ResetWhatsPasswordFields) {
    resetWhatsPassword(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full max-w-md border-y-1 border-y-gray-200 py-5"
      >
        {/* Password Input field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>كلمة المرور الجديدة</FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  autoComplete="new-password"
                  placeholder="أدخل كلمة المرور الجديدة"
                  className={cn(
                    fieldState.error && "border-red-500 focus:border-none"
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm Password Input field */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>تأكيد كلمة المرور الجديدة</FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  autoComplete="new-password"
                  placeholder="أكد كلمة المرور الجديدة"
                  className={cn(
                    fieldState.error && "border-red-500 focus:border-none"
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form actions */}
        <div className="flex flex-col w-full items-end">
          <Button
            type="submit"
            variant={"default"}
            className="w-full h-9 sm:h-12"
            disabled={isPending}
          >
            {isPending ? "جار إعادة التعيين..." : "إعادة تعيين كلمة المرور"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
