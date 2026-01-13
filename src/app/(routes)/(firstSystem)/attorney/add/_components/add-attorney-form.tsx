"use client";
import { useRef, useState } from "react";
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

import {
  AddAttorneyFields,
  AddAttorneySchema,
} from "@/lib/schemas/attorney.schema";

import PdfUploader from "@/components/common/pdf-uploader";
import AttorneyValidationResult from "./attorney-validation-result";

import { useAddAttorney, useValidateAttorney } from "../../_hooks/use-attorney";
import { useClientOrCompany } from "@/hooks/use-client-or-company";

import { toast } from "sonner";

export default function AddAttorneyForm() {
  //Local state
  const [clientType, setClientType] = useState<
    "client" | "company" | undefined
  >();
  const [showValidationResult, setShowValidationResult] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  //  API hooks
  const { addAttorney, isPending } = useAddAttorney(); // Add attorney mutation

  const {
    validateAttorney,
    isPending: isValidating,
    validationData,
  } = useValidateAttorney(); // Validate attorney number mutation

  const { data: ClientData, isPending: ClientsPending } =
    useClientOrCompany(clientType); // Fetch clients or companies based on selected type

  // Form setup
  const form = useForm<AddAttorneyFields>({
    resolver: zodResolver(AddAttorneySchema),
    defaultValues: {
      attorneyNumber: "",
      clientType: undefined,
      clientId: undefined,
    },
  });

  //Handlers
  /**
   * Step 1:
   * - Validate required PDF fields manually
   * - Call attorney validation API using attorney number
   * - Scroll to validation result on success
   */
  async function onSubmit(values: AddAttorneyFields) {
    if (
      !values.attorneyPdf?.file ||
      !values.attorneyPdf.name?.trim() ||
      !values.attorneyPdf.description?.trim()
    ) {
      toast.error("يجب رفع ملف الوكالة و ملئ بياناته");
      return;
    }

    validateAttorney(
      { attorneyNumber: values.attorneyNumber },
      {
        onSuccess: () => {
          setShowValidationResult(true);

          // Smooth scroll to validation result
          setTimeout(() => {
            resultRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }, 500);
        },
      }
    );
  }

  /**
   * Step 2:
   * - Re-check required PDF fields
   * - Build final payload
   * - Submit add attorney request
   */
  const handleConfirmAdd = () => {
    const values = form.getValues();

    if (
      !values.attorneyPdf?.file ||
      !values.attorneyPdf.name?.trim() ||
      !values.attorneyPdf.description?.trim()
    ) {
      toast.error("يجب رفع ملف الوكالة و ملئ بياناته");
      return;
    }

    const payload = {
      attorneyNumber: values.attorneyNumber,
      attorneyPdf: {
        file: values.attorneyPdf.file,
        name: values.attorneyPdf.name,
        description: values.attorneyPdf.description,
      },
      clientId: values.clientId,
      clientType: values.clientType,
    };

    addAttorney(
      { values: payload, validationData },
      {
        onSuccess: () => {
          setShowValidationResult(false);
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6 w-full p-8 bg-white rounded-2xl shadow-md">
          {/* ================= Attorney Number ================= */}
          <FormField
            control={form.control}
            name="attorneyNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رقم الوكالة</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="أدخل رقم الوكالة" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ================= Client Info ================= */}
          <div className="flex items-center md:flex-row flex-col justify-between gap-5">
            {/* Client Type */}
            <FormField
              control={form.control}
              name="clientType"
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

            {/* Client Selector */}
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem className="md:w-1/2 w-full">
                  <FormLabel>اختر العميل</FormLabel>
                  <Select
                    value={field.value?.toString() || ""}
                    disabled={!clientType || ClientsPending}
                    onValueChange={(value) =>
                      field.onChange(value || undefined)
                    }
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

          {/* ================= Attorney PDF ================= */}
          <FormField
            control={form.control}
            name="attorneyPdf"
            render={({ field: { value, onChange } }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  ملف الوكالة (PDF)
                </FormLabel>
                <FormControl>
                  <PdfUploader
                    value={value}
                    onChange={onChange}
                    maxSizeMB={10}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ================= Primary Action ================= */}
          <div className="space-y-3">
            <Button
              type="submit"
              className="w-full h-12"
              disabled={isValidating}
            >
              {isValidating ? "جار التحقق..." : "التحقق من الوكالة"}
            </Button>
          </div>
        </div>

        {/* ================= Validation Result & Confirmation ================= */}
        {showValidationResult && validationData && (
          <>
            <div className="pt-4" ref={resultRef}>
              <AttorneyValidationResult data={validationData} />
            </div>

            <Button
              type="button"
              className="w-full h-12 mt-12"
              disabled={isPending}
              onClick={handleConfirmAdd}
            >
              {isPending ? "جار الإضافة..." : "تأكيد الإضافة"}
            </Button>
          </>
        )}
      </form>
    </Form>
  );
}
