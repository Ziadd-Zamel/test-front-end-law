/* eslint-disable @typescript-eslint/no-unused-vars */
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
import {
  AddSettlementRequestFields,
  AddSettlementRequestSchema,
} from "@/lib/schemas/settlement.schema";
import { useClientOrCompany } from "@/hooks/use-client-or-company";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, X, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useCreateSettlementRequest,
  useUpdateSettlementRequest,
} from "../../../_hooks/use-settlement";
import PdfUploader from "@/components/common/pdf-uploader";
import { PdfCard } from "@/components/common/pdf-card";

export default function AddSettlementRequestForm({
  settlementRequest,
  categories,
}: {
  settlementRequest?: SettlementDetails;
  categories: SettlementCategory[];
}) {
  const router = useRouter();
  const [clientType, setClientType] = useState<
    "client" | "company" | undefined
  >(settlementRequest?.clientType as "client" | "company");

  const [formKey, setFormKey] = useState(0);
  // Track number of PDF fields
  const [pdfCount, setPdfCount] = useState(settlementRequest ? 0 : 1);

  // Hooks
  const { data: ClientData, isPending: ClientsPending } =
    useClientOrCompany(clientType);
  const { isPending: isCreating, createRequest } = useCreateSettlementRequest();
  const { isPending: isUpdating, updateRequest } = useUpdateSettlementRequest();

  // Form
  const form = useForm<AddSettlementRequestFields>({
    resolver: zodResolver(AddSettlementRequestSchema),
    defaultValues: {
      CategoryId: settlementRequest?.categoryId ?? "",
      ClientType:
        (settlementRequest?.clientType as "client" | "company") ?? undefined,
      ClientId: settlementRequest?.clientId ?? undefined,
      ClientPosition:
        (settlementRequest?.clientPosition as "مدعي" | "مدعي عليه") ??
        undefined,
      OpponentName: settlementRequest?.opponentName ?? "",
      OpponentIdNumber: settlementRequest?.opponentIdNumber ?? "",
      DisputeSummary: settlementRequest?.disputeSummary ?? "",
      settlementPdfs: [],
    },
  });

  const handleClientTypeChange = (value: "client" | "company") => {
    setClientType(value);
    form.setValue("ClientType", value);
    form.resetField("ClientId");
  };

  async function onSubmit(values: AddSettlementRequestFields) {
    // Get all PDFs
    const allPdfs = values.settlementPdfs || [];

    if (allPdfs.length === 0 && !settlementRequest) {
      toast.error("يجب رفع ملف واحد على الأقل");
      return;
    }

    if (allPdfs.length < pdfCount) {
      toast.error("يوجد ملفات مضافة ولم يتم تعبئة بياناتها");
      return;
    }

    const invalidPdfIndex = allPdfs.findIndex(
      (pdf) => !pdf?.file || !pdf.name?.trim() || !pdf.description?.trim()
    );

    if (invalidPdfIndex !== -1) {
      toast.error(`يجب ملئ جميع بيانات الملف رقم ${invalidPdfIndex + 1}`);
      return;
    }

    // Convert form data to FormData
    const formData = new FormData();
    formData.append("CategoryId", values.CategoryId);
    formData.append("ClientType", values.ClientType);
    formData.append("ClientId", values.ClientId.toString());
    formData.append("ClientPosition", values.ClientPosition);
    formData.append("OpponentName", values.OpponentName);
    formData.append("OpponentIdNumber", values.OpponentIdNumber);
    formData.append("DisputeSummary", values.DisputeSummary);

    // Append all valid PDFs
    allPdfs.forEach((pdf, index) => {
      if (pdf?.file) {
        formData.append(`Attachments[${index}]`, pdf.file);
        formData.append(`Descriptions[${index}]`, pdf.description);
        formData.append(`OriginalFilesName[${index}]`, pdf.name);
      }
    });

    if (settlementRequest) {
      // Update existing request
      formData.append("Id", settlementRequest.id.toString());
      updateRequest({ formData, setFormKey });
    } else {
      // Create new request
      createRequest({ formData, setFormKey });
    }
  }

  const isSubmitting = isCreating || isUpdating;

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
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleClientTypeChange(value as "client" | "company");
                  }}
                  value={field.value}
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
                  value={field.value?.toString() || ""}
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

        {/* Row 2: Category & Client Position */}
        <div className="flex items-center md:flex-row flex-col justify-between gap-5">
          <FormField
            control={form.control}
            name="CategoryId"
            render={({ field }) => (
              <FormItem className="md:w-1/2 w-full">
                <FormLabel>التصنيف</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر التصنيف" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

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
        </div>

        {/* Row 3: Opponent Name & ID Number */}
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
            name="OpponentIdNumber"
            render={({ field }) => (
              <FormItem className="md:w-1/2 w-full">
                <FormLabel>رقم هوية الخصم</FormLabel>
                <FormControl>
                  <Input placeholder="أدخل رقم هوية الخصم" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Dispute Summary */}
        <FormField
          control={form.control}
          name="DisputeSummary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ملخص النزاع</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="أدخل ملخصاً تفصيلياً للنزاع"
                  value={field.value || ""}
                  onChange={field.onChange}
                  rows={5}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ================= Multiple PDF Uploaders ================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel className="text-base font-semibold">
              ملفات الصلح (PDF)
            </FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPdfCount(pdfCount + 1)}
              className="flex items-center gap-2"
            >
              <Plus className="size-4" />
              إضافة ملف
            </Button>
          </div>
          {settlementRequest && (
            <div className="space-y-2">
              {settlementRequest.attachments.map((attachment) => {
                return <PdfCard key={attachment.id} pdf={attachment} />;
              })}
            </div>
          )}
          {Array.from({ length: pdfCount }).map((_, index) => (
            <div
              key={index}
              className="space-y-4 p-4 border rounded-lg relative"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">ملف رقم {index + 1}</h3>
                {pdfCount > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setPdfCount(pdfCount - 1);
                      const current = form.getValues("settlementPdfs") || [];
                      const updated = current.filter((_, i) => i !== index);
                      form.setValue("settlementPdfs", updated);
                    }}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="size-4" />
                    حذف
                  </Button>
                )}
              </div>

              <FormField
                control={form.control}
                name={`settlementPdfs.${index}`}
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormControl>
                      <PdfUploader
                        value={value}
                        onChange={onChange}
                        maxSizeMB={10}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        <Button
          type="submit"
          className="w-full h-12 mt-10"
          disabled={isSubmitting}
        >
          {settlementRequest ? (
            <>
              {isSubmitting ? (
                <>
                  جاري التعديل...{" "}
                  <Loader2 className="animate-spin text-white size-4" />
                </>
              ) : (
                "تعديل طلب الصلح"
              )}
            </>
          ) : (
            <>
              {isSubmitting ? (
                <>
                  جاري الإنشاء...{" "}
                  <Loader2 className="animate-spin text-white size-4" />
                </>
              ) : (
                "إنشاء طلب الصلح"
              )}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
