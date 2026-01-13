"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import React, { useState } from "react";
import { AddCaseFields, AddCaseSchema } from "@/lib/schemas/cases.schema";
import { useClientOrCompany } from "@/hooks/use-client-or-company";
import { MultiSelect } from "@/components/ui/multi-select";
import { useCasesCategories } from "@/hooks/use-case-categories";
import { useEmployees } from "@/hooks/use-employee";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAddCase, useEditCase } from "../../../_hooks/use-cases";

export default function AddCaseForm({
  Case,
  settlement,
}: {
  Case: Case | null;
  settlement: SettlementDetails | null;
}) {
  const [clientType, setClientType] = useState<
    "client" | "company" | undefined
  >((settlement?.clientType as "client" | "company") ?? Case?.clientType);
  const [formKey, setFormKey] = useState(0);
  // data hooks
  const { addCase, isPending: isAdding } = useAddCase();
  const { editCase, isPending: isEditing } = useEditCase();

  const { data: ClientData, isPending: ClientsPending } =
    useClientOrCompany(clientType);

  const { data: categories, isPending: categoriesPending } =
    useCasesCategories();
  console.log(categories);
  const { data: employees, isPending: employeesPending } = useEmployees();
  // form
  const form = useForm<AddCaseFields>({
    resolver: zodResolver(AddCaseSchema),
    defaultValues: {
      CaseNumber: Case?.caseNumber ?? "",
      CaseTitle: Case?.caseTitle ?? "",
      CategoryId: Case?.categoryId ?? settlement?.categoryId ?? undefined,
      CaseCategory: Case?.caseCategory ?? "",
      ClientPosition:
        (settlement?.clientPosition as "مدعي" | "مدعي عليه") ??
        Case?.clientPosition ??
        undefined,
      OpponentName: settlement?.opponentName ?? Case?.opponentName ?? "",
      CourtName: Case?.courtName ?? "",
      ClientType: (settlement?.clientType ?? Case?.clientType) as
        | "client"
        | "company"
        | undefined,
      ClientId: settlement?.clientId ?? Case?.clientId ?? undefined,
      EmployeesIds: Case?.employees?.map((emp) => emp.id) ?? [],
      AdditionalNotes: Case?.additionalNotes ?? "",
    },
  });

  function onSubmit(values: AddCaseFields) {
    if (values.CategoryId === "" && !values.CaseCategory?.trim()) {
      toast.error("يرجى إدخال اسم التصنيف الجديد أولاً");
      return;
    }

    if (Case) {
      const CasePayload = {
        id: Case?.id + "",
        ...values,
      };
      editCase(CasePayload);
    } else {
      addCase(values, {
        onSuccess: () => {
          setFormKey((prev) => prev + 1);
        },
      });
    }
  }

  return (
    <Form key={formKey} {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full p-8 bg-white rounded-2xl shadow-md"
      >
        {/* Row 1: Client Type & Client Select */}
        <div className="flex items-center md:flex-row flex-col justify-between gap-5">
          <FormField
            control={form.control}
            name="ClientType"
            render={({ field }) => (
              <FormItem className="md:w-1/2 w-full">
                <FormLabel>نوع العميل</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setClientType(value as "client" | "company");
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع العميل" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="client">شخصية طبيعية</SelectItem>
                    <SelectItem value="company">شخصية اعتبارية</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ClientId"
            render={({ field }) => (
              <FormItem className="md:w-1/2 w-full">
                <FormLabel>اختر العميل</FormLabel>
                <Select
                  value={field.value}
                  disabled={!clientType || ClientsPending}
                  onValueChange={(value) => field.onChange(value || undefined)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر العميل" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ClientData?.data.map((item: Client) => (
                      <SelectItem key={item.id} value={String(item.id)}>
                        {item.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Row 2: Case Number & Case Title */}
        <div className="flex items-center md:flex-row flex-col justify-between gap-5">
          <FormField
            control={form.control}
            name="CaseNumber"
            render={({ field }) => (
              <FormItem className="md:w-1/2 w-full">
                <FormLabel>رقم القضية</FormLabel>
                <FormControl>
                  <Input placeholder="أدخل رقم القضية" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="CaseTitle"
            render={({ field }) => (
              <FormItem className="md:w-1/2 w-full">
                <FormLabel>عنوان القضية</FormLabel>
                <FormControl>
                  <Input placeholder="أدخل عنوان القضية" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Row 3: Opponent & Court */}
        <div className="flex items-center md:flex-row flex-col justify-between gap-5">
          <FormField
            control={form.control}
            name="OpponentName"
            render={({ field }) => (
              <FormItem className="md:w-1/2 w-full">
                <FormLabel>اسم الخصم</FormLabel>
                <FormControl>
                  <Input placeholder="أدخل اسم الخصم" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="CourtName"
            render={({ field }) => (
              <FormItem className="md:w-1/2 w-full">
                <FormLabel>اسم المحكمة</FormLabel>
                <FormControl>
                  <Input placeholder="أدخل اسم المحكمة" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Row 4: Employees */}
        <FormField
          control={form.control}
          name="EmployeesIds"
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
        <div className="flex items-center md:flex-row flex-col justify-between gap-5">
          <FormField
            control={form.control}
            name="ClientPosition"
            render={({ field }) => (
              <FormItem className="md:w-1/2 w-full">
                <FormLabel>صفة العميل</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر صفة العميل" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="مدعي">مدعي</SelectItem>
                    <SelectItem value="مدعي عليه">مدعي عليه</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="CategoryId"
            render={({ field }) => (
              <FormItem className="md:w-1/2 w-full">
                <FormLabel>التصنيف</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={categoriesPending}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر التصنيف" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories?.data.map((category: Category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="0">تصنيف جديد</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Category Row */}
        <div className="flex items-center flex-col justify-between gap-5">
          {form.watch("CategoryId") === "" && (
            <FormField
              control={form.control}
              name="CaseCategory"
              disabled={form.watch("CategoryId") !== ""}
              render={({ field }) => (
                <FormItem className="w-full ">
                  <FormLabel>اسم التصنيف الجديد</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل اسم التصنيف الجديد" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Notes */}
        <FormField
          control={form.control}
          name="AdditionalNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ملاحظات إضافية</FormLabel>
              <FormControl>
                <Textarea value={field.value || ""} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isAdding || isEditing}
          className="w-full h-12 mt-10"
        >
          {Case ? (
            <>
              {isEditing ? (
                <>
                  جاري التعديل...{" "}
                  <Loader2 className="animate-spin text-white size-4" />
                </>
              ) : (
                " تعديل القضية"
              )}
            </>
          ) : (
            <>
              {" "}
              {isAdding ? (
                <>
                  جاري الإنشاء...{" "}
                  <Loader2 className="animate-spin text-white size-4" />
                </>
              ) : (
                " إنشاء القضية"
              )}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
