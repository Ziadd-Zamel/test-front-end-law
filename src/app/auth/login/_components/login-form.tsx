"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
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
import useLogin from "../_hooks/use-login";
import { LoginFields, LoginSchema } from "@/lib/schemas/auth.schema";
import { PasswordInput } from "../../_components/password-input";
import { useFingerprint } from "@/components/providers/components/fingerprint-client";
import { useLocationData } from "@/hooks/use-location-data";

export default function LoginForm() {
  // Hooks
  const { data: LocationData, isLoading: LocationLoading } = useLocationData();
  const { login, isPending } = useLogin();
  const { isLoading, error } = useFingerprint();
  // Form setup with validation
  const form = useForm<LoginFields>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      identity: "",
      password: "",
    },
  });

  // Handles form submission for user login
  async function onSubmit(values: LoginFields) {
    login({ ...values, locationData: LocationData });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full max-w-md border-y-1 border-y-gray-200 py-5"
      >
        {/* Identity Input field*/}
        <FormField
          control={form.control}
          name="identity"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>الهوية</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="أدخل الهوية"
                  autoComplete="username"
                  className={cn(
                    fieldState.error && "border-red-500 focus:border-none"
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Input field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>كلمة المرور</FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  autoComplete="current-password"
                  placeholder="أدخل كلمة المرور"
                  className={cn(
                    fieldState.error && "border-red-500 focus:border-none"
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form actions & links */}
        <div className="flex flex-col w-full items-end">
          <div className="flex items-center justify-between w-full">
            <Link
              className="no-underline sm:text-base text-xs -mt-2 text-blue-700 font-semibold"
              href="/auth/otp-login/send"
            >
              تسجيل الدخول برمز التحقق
            </Link>
            <Link
              className="no-underline -mt-2  sm:text-base text-xs text-blue-700 font-semibold"
              href="/auth/forget-password/send"
            >
              نسيت كلمة المرور؟
            </Link>
          </div>
          <Button
            type="submit"
            variant={"default"}
            className="w-full h-9 sm:h-12 mt-5"
            disabled={isPending || isLoading || !!error || LocationLoading}
          >
            {isPending ? "جار تسجيل الدخول..." : "تسجيل الدخول"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
