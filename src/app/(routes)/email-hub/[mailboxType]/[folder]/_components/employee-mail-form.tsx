// components/mail/forms/employee-mail-form.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useSendEmployeeMail } from "../../../_hooks/use-mail";
import {
  SendEmployeeMailFields,
  SendEmployeeMailSchema,
} from "@/lib/schemas/mail.schema";
import { useEmployees } from "@/hooks/use-employee";
import { MultiSelect } from "@/components/ui/multi-select";

interface EmployeeMailFormProps {
  onSuccess?: () => void;
}
export function EmployeeMailForm({ onSuccess }: EmployeeMailFormProps) {
  const { sendEmployeeMail, isPending } = useSendEmployeeMail();
  const { data: employees, isPending: employeesPending } = useEmployees();

  const form = useForm<SendEmployeeMailFields>({
    resolver: zodResolver(SendEmployeeMailSchema),
    defaultValues: {
      recipientEmployeeId: [],
      subject: "",
      content: "",
    },
  });

  function onSubmit(values: SendEmployeeMailFields) {
    sendEmployeeMail(values, {
      onSuccess: () => {
        form.reset();
        if (onSuccess) {
          onSuccess();
        }
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* EMPLOYEE SELECT */}
        <FormField
          control={form.control}
          name="recipientEmployeeId"
          disabled={employeesPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>الموظفون المعينون</FormLabel>
              <FormControl>
                <MultiSelect
                  options={
                    employees?.data.map((item: Employee) => ({
                      value: item.id + "",
                      label: item.fullName,
                    })) ?? []
                  }
                  maxCount={6}
                  value={field.value}
                  defaultValue={field.value}
                  onValueChange={(vals) => field.onChange(vals)}
                  placeholder="اختر الموظفين"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* SUBJECT */}
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الموضوع</FormLabel>
              <FormControl>
                <Input placeholder="أدخل الموضوع" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* CONTENT */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>المحتوى</FormLabel>
              <FormControl>
                <Textarea
                  className="h-32 text-right"
                  placeholder="اكتب الرسالة هنا..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full h-12" disabled={isPending}>
          {isPending ? (
            <>
              جاري الإرسال...
              <Loader2 className="size-4 animate-spin ml-2" />
            </>
          ) : (
            "إرسال للموظف"
          )}
        </Button>
      </form>
    </Form>
  );
}
