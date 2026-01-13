"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  VerifyEmailFields,
  VerifyEmailSchema,
} from "@/lib/schemas/auth.schema";

interface OTPFormProps {
  onVerify: (code: string) => void;
  onResend?: () => void;
  isVerifyPending: boolean;
  isResendPending?: boolean;
  title?: string;
  description?: string;
  submitButtonText?: string;
  submitButtonLoadingText?: string;
  resendButtonText?: string;
  resendButtonLoadingText?: string;
  showResendButton?: boolean;
}

export default function OTPForm({
  onVerify,
  onResend,
  isVerifyPending,
  isResendPending = false,
  title = "رمز التحقق",
  description = "أدخل الرمز المرسل إلى بريدك الإلكتروني (6 أرقام).",
  submitButtonText = "تحقق",
  submitButtonLoadingText = "جار التحقق...",
  resendButtonText = "إعادة الإرسال",
  resendButtonLoadingText = "جار الإرسال...",
  showResendButton = true,
}: OTPFormProps) {
  const form = useForm<VerifyEmailFields>({
    resolver: zodResolver(VerifyEmailSchema),
    defaultValues: { code: "" },
    mode: "onChange",
  });

  function onSubmit(values: VerifyEmailFields) {
    onVerify(values.code);
  }

  const codeValue = form.watch("code") ?? "";
  const isComplete = /^\d{6}$/.test(codeValue);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        dir="rtl"
        className="space-y-6 w-full max-w-md border-y border-y-gray-200 py-5"
      >
        <FormField
          control={form.control}
          name="code"
          render={({ field, fieldState }) => (
            <FormItem className="w-full">
              <FormLabel>{title}</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-2">
                  <InputOTP
                    {...field}
                    maxLength={6}
                    className={cn(fieldState.error && "ring-1 ring-red-500")}
                    onChange={(val) => {
                      const onlyDigits = val.replace(/\D+/g, "");
                      field.onChange(onlyDigits);
                    }}
                  >
                    <InputOTPGroup
                      dir="ltr"
                      className="w-full flex justify-between"
                    >
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>

                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col w-full items-end gap-3">
          <Button
            type="submit"
            variant="default"
            className="w-full h-9 sm:h-12"
            disabled={isVerifyPending || !isComplete}
          >
            {isVerifyPending ? submitButtonLoadingText : submitButtonText}
          </Button>

          {showResendButton && onResend && (
            <Button
              type="button"
              variant="outline"
              className="w-full h-9 sm:h-12"
              disabled={isResendPending}
              onClick={onResend}
            >
              {isResendPending ? resendButtonLoadingText : resendButtonText}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
