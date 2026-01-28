import * as React from "react";
import { TableBuilder } from "@/components/common/table-builder";
import { TableCell, TableRow } from "@/components/ui/table";
import { TableEmptyState } from "@/components/common/table-states";
import { Pagination } from "@/lib/types/api";
import AddCategoryDialog from "./add-category-dialog";
import UpdateCategoryDialog from "./update-category-dialog";
import DeleteCategoryDialog from "./delete-category-dialog";

const tableHeader = [
  { headName: "اسم الفئة", className: "text-center" },
  { headName: "تاريخ الإنشاء", className: "text-center" },
  { headName: "تم الإنشاء بواسطة", className: "text-center" },
  { headName: "الإجراءات", className: "text-center" },
];

export default function AttachmentCategoriesTable({
  categories,
  pagination,
  responsePagination,
}: {
  categories: AttachmentCategory[];
  responsePagination: Pagination | undefined;
  pagination: {
    currentPage: number;
    limit: number;
  };
}) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <TableBuilder<AttachmentCategory>
      pagination={
        responsePagination && responsePagination.totalCount > 5
          ? pagination
          : undefined
      }
      totalPages={responsePagination?.totalPages || 1}
      tableHeader={
        <>
          <div className="flex items-center justify-between w-full md:flex-row flex-col gap-4">
            <div className="flex self-start items-center gap-2">
              <div className="w-1 h-5 bg-gradient-to-b from-blue-400 to-white" />
              <h2 className="text-3xl font-semibold">تصنيفات المرفقات</h2>
            </div>
            <div className="self-end">
              <AddCategoryDialog />
            </div>
          </div>
        </>
      }
      tableHeadNames={tableHeader}
      tableData={categories}
      headRowClasses="text-center"
      emptyState={
        <TableEmptyState
          title="لا توجد تصنيفات"
          description="لم يتم العثور على أي تصنيفات للمرفقات. أضف أول فئة للبدء."
          className="h-fit"
        />
      }
      renderRow={(category) => (
        <TableRow key={category.id}>
          <TableCell className="text-center">
            <p className="font-medium">{category.categoryName}</p>
          </TableCell>
          <TableCell className="text-center">
            <p className="text-sm font-medium">
              {formatDate(category.createdAt)}
            </p>
          </TableCell>
          <TableCell className="text-center">
            <p className="text-sm font-medium">{category.createdByUserName}</p>
          </TableCell>
          <TableCell className="text-center">
            <div className="flex items-center justify-center gap-2">
              <UpdateCategoryDialog
                categoryId={category.id}
                currentCategoryName={category.categoryName}
              />
              <DeleteCategoryDialog
                categoryId={category.id}
                categoryName={category.categoryName}
              />
            </div>
          </TableCell>
        </TableRow>
      )}
    />
  );
}
