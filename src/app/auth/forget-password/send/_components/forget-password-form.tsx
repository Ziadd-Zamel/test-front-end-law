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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
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
      type: undefined,
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
                    fieldState.error && "border-red-500 focus:border-none"
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Type Radio Group field */}
        <FormField
          control={form.control}
          name="type"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className={cn(
                    "flex flex-col space-y-2 items-start",
                    fieldState.error && "border-red-500"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem
                      className="cursor-pointer"
                      value="Email"
                      id="email"
                    />
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem
                      className="cursor-pointer"
                      value="WhatsApp"
                      id="whatsapp"
                    />
                    <Label htmlFor="whatsapp">واتساب</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form actions & links */}
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
