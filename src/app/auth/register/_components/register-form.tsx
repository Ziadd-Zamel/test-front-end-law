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
import { PhoneInput } from "@/components/ui/phone-input";
import { RegisterFields, RegisterSchema } from "@/lib/schemas/auth.schema";
import { PasswordInput } from "../../_components/password-input";
import { DatePicker } from "@/components/ui/date-picker";
import { useLocationData } from "@/hooks/use-location-data";
import { useRegisterUser } from "../../_hooks/use-auth";

export default function RegisterForm() {
  // Hooks
  const { register, isPending } = useRegisterUser();
  const { data: LocationData, isLoading: LocationLoading } = useLocationData();

  // Form setup with validation
  const form = useForm<RegisterFields>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      identity: "",
      fullName: "",
      dateOfBirth: undefined,
      email: "",
      phoneNumber: "",
      passwordHash: "",
      confirmPassword: "",
    },
  });

  // Handles form submission for user registration
  async function onSubmit(values: RegisterFields) {
    register({ data: values, locationData: LocationData });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full max-w-md border-y-1 border-y-gray-200 py-5"
      >
        {/* Identity Input field */}
        <FormField
          control={form.control}
          name="identity"
          render={({ field, fieldState }) => (
            <FormItem>
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

        {/* Full Name Input field */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>الاسم الكامل</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="أدخل الاسم الكامل"
                  autoComplete="name"
                  className={cn(
                    fieldState.error && "border-red-500 focus:border-none"
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date of Birth Input field */}
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>تاريخ الميلاد</FormLabel>
              <FormControl>
                <DatePicker
                  date={field.value}
                  setDate={(date) => field.onChange(date)}
                  placeholder="اختر تاريخ الميلاد"
                  className={cn(
                    fieldState.error && "border-red-500 focus:border-none"
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Input field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>البريد الإلكتروني</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="أدخل البريد الإلكتروني"
                  autoComplete="email"
                  className={cn(
                    fieldState.error && "border-red-500 focus:border-none"
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone Number Input field */}
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>رقم الهاتف</FormLabel>
              <FormControl className="">
                <PhoneInput
                  {...field}
                  placeholder="أدخل رقم الهاتف"
                  defaultCountry="SA"
                  international
                  className={cn(
                    fieldState.error && "border-red-500 focus:border-none"
                  )}
                  style={{ direction: "ltr" }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Input field */}
        <FormField
          control={form.control}
          name="passwordHash"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>كلمة المرور</FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  autoComplete="new-password"
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

        {/* Confirm Password Input field */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>تأكيد كلمة المرور</FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  autoComplete="new-password"
                  placeholder="أكد كلمة المرور"
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
          <Button
            type="submit"
            variant={"default"}
            className="w-full h-9 sm:h-12"
            disabled={isPending || LocationLoading}
          >
            {isPending ? "جار إنشاء الحساب..." : "إنشاء حساب"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
