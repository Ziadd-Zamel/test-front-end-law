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
  AttorneyValidationFields,
  AttorneyValidationSchema,
} from "@/lib/schemas/attorney.schema";
import AttorneyValidationResult from "./attorney-result";
import { useValidateAttorney } from "../../_hooks/use-attorney";

export default function ValidateAttorneyForm() {
  const { validateAttorney, isPending, validationData } = useValidateAttorney();

  const form = useForm<AttorneyValidationFields>({
    resolver: zodResolver(AttorneyValidationSchema),
    defaultValues: {
      attorneyNumber: "",
    },
  });

  async function onSubmit(values: AttorneyValidationFields) {
    validateAttorney(values);
  }

  return (
    <div className="w-full box-container">
      <div className="max-w-md mx-auto mt-10">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full p-8 bg-white rounded-2xl shadow-md"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-blue-700">
                التحقق من الوكالة
              </h2>
              <p className="text-gray-600 mt-2">
                أدخل رقم الوكالة للتحقق من صحته
              </p>
            </div>

            {/* ATTORNEY NUMBER INPUT */}
            <FormField
              control={form.control}
              name="attorneyNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رقم الوكالة</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="أدخل رقم الوكالة"
                      className="text-center text-lg"
                      maxLength={12}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* SUBMIT BUTTON */}
            <Button
              type="submit"
              className="w-full h-12 mt-6"
              disabled={isPending}
            >
              {isPending ? "جار التحقق..." : "التحقق من الوكالة"}
            </Button>
          </form>
        </Form>
      </div>

      {/* VALIDATION RESULT - FULL WIDTH */}
      {validationData && <AttorneyValidationResult data={validationData} />}
    </div>
  );
}
