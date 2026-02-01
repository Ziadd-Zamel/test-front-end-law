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
import { Input } from "@/components/ui/input";
import {
  ForgetPasswordFields,
  ForgetPasswordSchema,
} from "@/lib/schemas/auth.schema";
import { useForgetPassword } from "@/app/auth/_hooks/use-auth";

export default function ForgetPasswordForm() {
  // Hooks
  const { forgetPassword, isPending } = useForgetPassword();

  // Form setup with validation
  const form = useForm<ForgetPasswordFields>({
    resolver: zodResolver(ForgetPasswordSchema),
    defaultValues: {
      identity: "",
      type: "WhatsApp",
    },
  });

  // Handles form submission for forget password
  async function onSubmit(values: ForgetPasswordFields) {
    forgetPassword(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full max-w-md border-y-1 border-y-gray-200 py-5 flex flex-col items-start"
      >
        {/* Identity Input field */}
        <FormField
          control={form.control}
          name="identity"
          render={({ field, fieldState }) => (
            <FormItem className="w-full">
              <FormLabel>الهوية</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="أدخل رقم الهوية "
                  autoComplete="off"
                  className={cn(
                    fieldState.error && "border-red-500 focus:border-none",
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form actions*/}
        <div className="flex flex-col w-full items-end">
          <Button
            type="submit"
            variant={"default"}
            className="w-full h-9 sm:h-12"
            disabled={isPending}
          >
            {isPending ? "جار الإرسال..." : "إرسال رمز إعادة التعيين"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
