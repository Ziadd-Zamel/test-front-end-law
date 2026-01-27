import catchError from "@/lib/utils/catch-error";
import { TableErrorState } from "@/components/common/table-states";
import { getAllAttachmentCategories } from "@/lib/api/attachment.api";
import AttachmentCategoriesTable from "./_components/attachment-category-table";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    pageNumber?: string;
    pageSize?: string;
  }>;
}) {
  // Resolve Params
  const resolvedParams = await searchParams;

  // variables
  const mainPage = Math.max(1, Number(resolvedParams.pageNumber) || 1);
  const mainLimit = Math.max(
    1,
    Math.min(50, Number(resolvedParams.pageSize) || 5),
  );

  // Fetching
  const [payload, error] = await catchError(() =>
    getAllAttachmentCategories(mainLimit, mainPage),
  );

  // Handle error state
  if (error) {
    return (
      <div className="box-container p-5 md:p-20">
        <div className="rounded-xl bg-white border border-gray-300 min-h-[400px]">
          <TableErrorState
            title="فشل تحميل بيانات الفئات"
            description="لم نتمكن من استرجاع معلومات الفئات. يرجى التحقق من الاتصال والمحاولة مرة أخرى."
            error={error}
          />
        </div>
      </div>
    );
  }

  // Table
  return (
    <div className="w-full box-container pt-10 pb-5">
      <AttachmentCategoriesTable
        categories={payload?.data || []}
        responsePagination={payload?.pagination}
        pagination={{
          currentPage: mainPage,
          limit: mainLimit,
        }}
      />
    </div>
  );
}
