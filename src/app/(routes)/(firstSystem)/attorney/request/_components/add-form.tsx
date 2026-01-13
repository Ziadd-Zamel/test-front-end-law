"use client";

/* ============================ Imports ============================ */
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";

import TextEditor from "@/components/common/text-editor";

import { useClientOrCompany } from "@/hooks/use-client-or-company";
import { useRequestAttorney } from "../../_hooks/use-attorney";

import {
  AttorneyRequestFields,
  AttorneyRequestSchema,
} from "@/lib/schemas/attorney.schema";
import { getAttorneyCategoryById } from "@/lib/api/attorney.api.client";
import { AttorneyCategory } from "@/lib/types/attorney";

/* ============================ Component ============================ */
export default function AddForm({ data }: { data: AttorneyCategory[] }) {
  /* ============================ Local state ============================ */
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    []
  );
  const [clientType, setClientType] = useState<
    "client" | "company" | undefined
  >(undefined);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  /* ============================ API hooks ============================ */
  const { requestAttorney, isPending } = useRequestAttorney();

  const { data: ClientData, isPending: ClientsPending } =
    useClientOrCompany(clientType);

  // Fetch subcategories for selected categories
  const { data: categoriesWithChildren, isLoading: isCategoriesLoading } =
    useQuery({
      queryKey: ["selected-categories", selectedCategories],
      queryFn: async () => {
        if (selectedCategories.length === 0) return [];

        const results = await Promise.all(
          selectedCategories.map(async (categoryId) => {
            try {
              const response = await getAttorneyCategoryById(categoryId);
              const mainCategory = data.find((c) => c.id === categoryId);

              return {
                mainCategory,
                details: response.data,
              };
            } catch (error) {
              console.error(`Failed to fetch category ${categoryId}:`, error);
              return null;
            }
          })
        );

        return results.filter(
          (
            r
          ): r is {
            mainCategory: AttorneyCategory;
            details: AttorneyCategory;
          } => r !== null && r.mainCategory !== undefined
        );
      },
      enabled: selectedCategories.length > 0,
    });

  /* ============================ Form setup ============================ */
  const form = useForm<AttorneyRequestFields>({
    resolver: zodResolver(AttorneyRequestSchema),
    defaultValues: {
      clientType: undefined,
      clientId: undefined,
      attorneyCapacity: undefined,
      attorneyType: "",
      attorneyDuration: undefined,
      additionalNotes: "",
    },
  });

  /* ============================ Derived data ============================ */
  const attorneyTypeOptions: Option[] = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return [];

    return data
      .filter((category) => category && category.id && category.name)
      .map((category) => ({
        label: category.name,
        value: category.id,
      }));
  }, [data]);

  /* ============================ Helpers ============================ */
  const updateAttorneyTypeField = (mainCats: string[], subCats: string[]) => {
    const combined = [...mainCats, ...subCats];
    form.setValue("attorneyType", combined.join(","));
    form.clearErrors("attorneyType");
  };

  const toggleCollapsible = (categoryId: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Helper function to get all descendant IDs recursively
  const getAllDescendantIds = (category: AttorneyCategory): string[] => {
    let ids: string[] = [category.id];

    if (category.children && category.children.length > 0) {
      category.children.forEach((child) => {
        ids = [...ids, ...getAllDescendantIds(child)];
      });
    }

    return ids;
  };

  const isAllSelected = (categoryChildren: AttorneyCategory[]) => {
    if (categoryChildren.length === 0) return false;

    const allDescendantIds = categoryChildren.flatMap((child) =>
      getAllDescendantIds(child)
    );

    return allDescendantIds.every((id) => selectedSubcategories.includes(id));
  };

  // Recursive function to render category tree with collapsible nested items
  const renderCategoryTree = (
    categories: AttorneyCategory[],
    level: number
  ): React.ReactNode => {
    return (
      <div className="space-y-1">
        {categories.map((category) => {
          const hasChildren = category.children && category.children.length > 0;
          const isOpen = openItems[category.id] || false;

          const allDescendantIds = getAllDescendantIds(category);
          const isChecked = selectedSubcategories.includes(category.id);
          const isIndeterminate =
            !isChecked &&
            hasChildren &&
            allDescendantIds.some((id) => selectedSubcategories.includes(id));

          return (
            <div key={category.id}>
              {hasChildren ? (
                <Collapsible
                  open={isOpen}
                  onOpenChange={() => toggleCollapsible(category.id)}
                >
                  <div
                    className="flex items-center gap-1 py-1.5 hover:bg-gray-50 rounded-md transition-colors"
                    style={{ paddingRight: `${level * 1.5}rem` }}
                  >
                    <CollapsibleTrigger asChild>
                      <button
                        type="button"
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        {isOpen ? (
                          <ChevronDown className="h-4 w-4 text-gray-600" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-600" />
                        )}
                      </button>
                    </CollapsibleTrigger>

                    <Checkbox
                      id={`subcategory-${category.id}`}
                      checked={isChecked || isIndeterminate}
                      onCheckedChange={() =>
                        handleSubcategoryToggle(category.id, category)
                      }
                    />

                    <label
                      htmlFor={`subcategory-${category.id}`}
                      className="text-sm mr-1 font-medium cursor-pointer flex-1"
                    >
                      {category.name}
                    </label>
                  </div>

                  <CollapsibleContent>
                    {renderCategoryTree(category.children, level + 1)}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <div
                  className="flex items-center gap-1 py-1.5 hover:bg-gray-50 rounded-md transition-colors"
                  style={{ paddingRight: `${level * 1.5 + 1.5}rem` }}
                >
                  <Checkbox
                    id={`subcategory-${category.id}`}
                    checked={selectedSubcategories.includes(category.id)}
                    onCheckedChange={() =>
                      handleSubcategoryToggle(category.id, category)
                    }
                  />
                  <label
                    htmlFor={`subcategory-${category.id}`}
                    className="text-sm mr-1 font-medium cursor-pointer flex-1"
                  >
                    {category.name}
                  </label>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  /* ============================ Handlers ============================ */
  const handleCategoryChange = (selected: Option[]) => {
    const values = selected.map((opt) => opt.value);
    setSelectedCategories(values);

    // Keep existing subcategories but update the form
    updateAttorneyTypeField(values, selectedSubcategories);
  };

  const handleSubcategoryToggle = (
    subcategoryId: string,
    category: AttorneyCategory
  ) => {
    setSelectedSubcategories((prev) => {
      const allDescendantIds = getAllDescendantIds(category);
      const isCurrentlySelected = prev.includes(subcategoryId);

      let newSelection: string[];
      if (isCurrentlySelected) {
        // Deselect this category and all its descendants
        newSelection = prev.filter((id) => !allDescendantIds.includes(id));
      } else {
        // Select this category and all its descendants
        const uniqueIds = new Set([...prev, ...allDescendantIds]);
        newSelection = Array.from(uniqueIds);
      }

      // Update form field with combined main and sub
      updateAttorneyTypeField(selectedCategories, newSelection);

      return newSelection;
    });
  };

  const handleSelectAll = (categoryChildren: AttorneyCategory[]) => {
    const allDescendantIds = categoryChildren.flatMap((child) =>
      getAllDescendantIds(child)
    );

    setSelectedSubcategories((prev) => {
      const allSelected = allDescendantIds.every((id) => prev.includes(id));

      let newSelection: string[];
      if (allSelected) {
        newSelection = prev.filter((id) => !allDescendantIds.includes(id));
      } else {
        const uniqueIds = new Set([...prev, ...allDescendantIds]);
        newSelection = Array.from(uniqueIds);
      }

      updateAttorneyTypeField(selectedCategories, newSelection);

      return newSelection;
    });
  };

  async function onSubmit(values: AttorneyRequestFields) {
    const payload = {
      ...values,
      attorneyType: values.attorneyType.split(","),
    };

    requestAttorney(payload, {
      onSuccess: (data) => {
        router.push(`/attorney/attorney-management/${data.id}`);
        form.reset();
        setSelectedCategories([]);
        setSelectedSubcategories([]);
        setOpenItems({});
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full p-8 bg-white rounded-2xl shadow-md"
      >
        {/* ================= Client Info ================= */}
        <div className="flex items-center md:flex-row flex-col justify-between gap-5">
          {/* CLIENT TYPE */}
          <FormField
            control={form.control}
            name="clientType"
            render={({ field }) => (
              <FormItem className="md:w-1/2 w-full">
                <FormLabel>نوع العميل</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setClientType(value as "client" | "company");
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

          {/* CLIENT SELECT */}
          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem className="md:w-1/2 w-full">
                <FormLabel>اختر العميل</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value || undefined)}
                  value={field.value?.toString() || ""}
                  disabled={!clientType || ClientsPending}
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

        {/* ================= Attorney Meta ================= */}
        <div className="flex items-center md:flex-row flex-col justify-between gap-5">
          {/* ATTORNEY CAPACITY */}
          <FormField
            control={form.control}
            name="attorneyCapacity"
            render={({ field }) => (
              <FormItem className="md:w-1/2 w-full">
                <FormLabel>صفة المحامي</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر صفة المحامي" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="اصالة عن نفسه">اصالة عن نفسه</SelectItem>
                    <SelectItem value="محامي">محامي</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ATTORNEY DURATION */}
          <FormField
            control={form.control}
            name="attorneyDuration"
            render={({ field }) => (
              <FormItem className="md:w-1/2 w-full">
                <FormLabel>مدة الوكالة</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر مدة الوكالة" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="3_months">3 أشهر</SelectItem>
                    <SelectItem value="6_months">6 أشهر</SelectItem>
                    <SelectItem value="9_months">9 أشهر</SelectItem>
                    <SelectItem value="1_year">سنة واحدة</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ================= Main Attorney Categories ================= */}
        <FormField
          control={form.control}
          name="attorneyType"
          render={() => (
            <FormItem>
              <FormLabel>البنود الرئيسية للوكالة</FormLabel>
              <MultipleSelector
                defaultOptions={attorneyTypeOptions}
                placeholder="اختر بنود الوكالة"
                emptyIndicator={
                  <p className="text-center text-lg leading-10 text-gray-600">
                    لا توجد نتائج
                  </p>
                }
                value={selectedCategories
                  .map((v) =>
                    attorneyTypeOptions.find((opt) => opt.value === v)
                  )
                  .filter((opt): opt is Option => opt !== undefined)}
                onChange={handleCategoryChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ================= Subcategories Accordion ================= */}
        {selectedCategories.length > 0 && (
          <div>
            <FormLabel>البنود الفرعية</FormLabel>

            {isCategoriesLoading ? (
              <div className="border rounded-lg p-4 text-center text-gray-500 mt-2">
                جاري تحميل البنود...
              </div>
            ) : categoriesWithChildren &&
              categoriesWithChildren.filter(
                (item) =>
                  item.details &&
                  item.details.children &&
                  item.details.children.length > 0
              ).length > 0 ? (
              <div className="border rounded-lg mt-2">
                <Accordion type="multiple" className="w-full">
                  {categoriesWithChildren
                    ?.filter(
                      (item) =>
                        item.details &&
                        item.details.children &&
                        item.details.children.length > 0
                    )
                    .map((item) => {
                      const { mainCategory, details } = item;

                      const allDescendantIds = details.children.flatMap(
                        (child) => getAllDescendantIds(child)
                      );
                      const selectedCount = allDescendantIds.filter((id) =>
                        selectedSubcategories.includes(id)
                      ).length;

                      return (
                        <AccordionItem
                          key={mainCategory.id}
                          value={`item-${mainCategory.id}`}
                        >
                          <AccordionTrigger className="px-4 hover:no-underline">
                            <div className="flex items-center justify-between w-full">
                              <span className="font-medium">
                                {mainCategory.name}
                              </span>
                              <span className="text-sm text-gray-500 mr-2 mt-1">
                                ({selectedCount}/{allDescendantIds.length})
                              </span>
                            </div>
                          </AccordionTrigger>

                          <AccordionContent className="px-4 pb-4">
                            {/* Select All */}
                            <div className="flex items-center space-x-2 space-x-reverse pb-3 mb-3 border-b">
                              <Checkbox
                                id={`select-all-${mainCategory.id}`}
                                checked={isAllSelected(details.children)}
                                onCheckedChange={() =>
                                  handleSelectAll(details.children)
                                }
                              />
                              <label
                                htmlFor={`select-all-${mainCategory.id}`}
                                className="text-sm font-bold leading-none cursor-pointer mr-2"
                              >
                                تحديد الكل
                              </label>
                            </div>

                            {/* Collapsible Tree */}
                            <div className="max-h-96 overflow-y-auto">
                              {renderCategoryTree(details.children, 0)}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                </Accordion>
              </div>
            ) : (
              <div className="border rounded-lg p-4 text-center text-gray-500 mt-2">
                لا توجد بنود للفئات المحددة
              </div>
            )}

            {selectedSubcategories.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                تم اختيار {selectedSubcategories.length} بنود فرعية
              </p>
            )}
          </div>
        )}

        {/* ================= Additional Notes ================= */}
        <FormField
          control={form.control}
          name="additionalNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ملاحظات إضافية</FormLabel>
              <FormControl>
                <TextEditor
                  value={field.value || ""}
                  onChange={field.onChange}
                  minHeight="10rem"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ================= Primary Action ================= */}
        <Button
          type="submit"
          className="w-full h-12 mt-10"
          disabled={isPending}
        >
          {isPending ? "جار الإنشاء..." : "إنشاء طلب الوكالة"}
        </Button>
      </form>
    </Form>
  );
}
