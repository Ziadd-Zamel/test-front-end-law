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
import React, { useState, useRef } from "react";
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
  
  // Track the selected client type (natural person or company)
  const [clientType, setClientType] = useState<
    "client" | "company" | undefined
  >(settlementRequest?.clientType as "client" | "company");

  // Form key used to reset the form after successful submission
  // Incrementing this key forces React to remount the form component
  const [formKey, setFormKey] = useState(0);
  
  // Track the number of PDF upload fields displayed
  // If editing existing settlement, start with 0 (existing files shown separately)
  // If creating new, start with 1 field
  const [pdfCount, setPdfCount] = useState(settlementRequest ? 0 : 1);
  
  // Refs to track each PDF field container DOM element
  // Used to scroll to newly added fields when user clicks "Add File"
  const pdfFieldRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // ==================== CUSTOM HOOKS ====================
  // Fetch clients or companies based on selected client type
  const { data: ClientData, isPending: ClientsPending } =
    useClientOrCompany(clientType);
  
  // Mutation hooks for creating and updating settlement requests
  const { isPending: isCreating, createRequest } = useCreateSettlementRequest();
  const { isPending: isUpdating, updateRequest } = useUpdateSettlementRequest();

  // ==================== FORM CONFIGURATION ====================
  // Initialize react-hook-form with validation schema and default values
  // Default values are populated from settlementRequest if editing
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

  /**
   * Handle client type change (natural person vs company)
   * When client type changes, we need to:
   * 1. Update the clientType state to trigger data fetching
   * 2. Update the form field value
   * 3. Reset the ClientId field since the client list will change
   */
  const handleClientTypeChange = (value: "client" | "company") => {
    setClientType(value);
    form.setValue("ClientType", value);
    form.resetField("ClientId");
  };

  /**
   * Handle form submission
   * Validates all PDF files and converts form data to FormData for API submission
   */
  async function onSubmit(values: AddSettlementRequestFields) {
    // Get all PDFs from form values
    const allPdfs = values.settlementPdfs || [];

    // Validation 1: For new settlements, at least one PDF is required
    if (allPdfs.length === 0 && !settlementRequest) {
      toast.error("يجب رفع ملف واحد على الأقل");
      return;
    }

    // Validation 2: Check if user added PDF fields but didn't fill them
    // This happens when pdfCount > allPdfs.length (user clicked "Add File" but didn't upload)
    if (allPdfs.length < pdfCount) {
      toast.error("يوجد ملفات مضافة ولم يتم تعبئة بياناتها");
      return;
    }

    // Validation 3: Check if any PDF is missing required data (file, name, or description)
    const invalidPdfIndex = allPdfs.findIndex(
      (pdf) => !pdf?.file || !pdf.name?.trim() || !pdf.description?.trim()
    );

    if (invalidPdfIndex !== -1) {
      toast.error(`يجب ملئ جميع بيانات الملف رقم ${invalidPdfIndex + 1}`);
      return;
    }

    // Convert form data to FormData for multipart/form-data submission
    // This is required because we're uploading files
    const formData = new FormData();
    formData.append("CategoryId", values.CategoryId);
    formData.append("ClientType", values.ClientType);
    formData.append("ClientId", values.ClientId.toString());
    formData.append("ClientPosition", values.ClientPosition);
    formData.append("OpponentName", values.OpponentName);
    formData.append("OpponentIdNumber", values.OpponentIdNumber);
    formData.append("DisputeSummary", values.DisputeSummary);

    // Append all valid PDF files with their metadata
    // Each PDF needs: file, description, and original filename
    allPdfs.forEach((pdf, index) => {
      if (pdf?.file) {
        formData.append(`Attachments[${index}]`, pdf.file);
        formData.append(`Descriptions[${index}]`, pdf.description);
        formData.append(`OriginalFilesName[${index}]`, pdf.name);
      }
    });

    // Determine if we're updating existing settlement or creating new one
    if (settlementRequest) {
      // Update existing request - include the settlement ID
      formData.append("Id", settlementRequest.id.toString());
      updateRequest({ formData, setFormKey });
    } else {
      // Create new request
      createRequest({ formData, setFormKey });
    }
  }

  // Combined loading state for both create and update operations
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
              onClick={() => {
                // Increment PDF field count to add a new upload field
                const newCount = pdfCount + 1;
                setPdfCount(newCount);
                
                // Scroll to the newly added field after DOM update
                // setTimeout ensures the DOM has rendered the new field before scrolling
                // The new field index is newCount - 1 (0-indexed)
                setTimeout(() => {
                  const newFieldIndex = newCount - 1;
                  const fieldElement = pdfFieldRefs.current[newFieldIndex];
                  if (fieldElement) {
                    // Smooth scroll to bring the new field into view
                    fieldElement.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }, 100);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="size-4" />
              إضافة ملف
            </Button>
          </div>
          {/* Display existing PDF attachments when editing a settlement */}
          {/* These are read-only cards showing files already uploaded */}
          {settlementRequest && (
            <div className="space-y-2">
              {settlementRequest.attachments.map((attachment) => {
                return <PdfCard key={attachment.id} pdf={attachment} />;
              })}
            </div>
          )}
          {/* Render dynamic PDF upload fields based on pdfCount */}
          {Array.from({ length: pdfCount }).map((_, index) => (
            <div
              key={index}
              // Store ref to this field's DOM element for scrolling
              ref={(el) => {
                pdfFieldRefs.current[index] = el;
              }}
              className="space-y-4 p-4 border rounded-lg relative"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">ملف رقم {index + 1}</h3>
                {/* Only show delete button if there's more than one field */}
                {pdfCount > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      // Decrement PDF count to remove this field
                      setPdfCount(pdfCount - 1);
                      
                      // Remove the PDF data from form state at this index
                      // This ensures form data stays in sync with visible fields
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
