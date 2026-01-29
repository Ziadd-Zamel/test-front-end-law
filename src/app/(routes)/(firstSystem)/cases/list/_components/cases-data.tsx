import catchError from "@/lib/utils/catch-error";
import CasesTable from "./case-table";
import { GetAllCases } from "@/lib/api/cases";
import { TableErrorState } from "@/components/common/table-states";

export default async function CasesData({
  mainLimit,
  mainPage,
}: {
  mainLimit: number;
  mainPage: number;
}) {
  // fetching Cases
  const [payload, error] = await catchError(() =>
    GetAllCases({ pageSize: mainLimit, pageNumber: mainPage }),
  );
  if (error) {
    return (
      <div className="box-container p-5 md:p-20">
        <div className="rounded-xl bg-white border border-gray-300 min-h-[400px]">
          <TableErrorState
            title="Failed to load attorney data"
            description="We couldn't retrieve the attorney information. Please check your connection and try again."
            error={error}
          />
        </div>
      </div>
    );
  }
  return (
    <CasesTable
      cases={payload?.data || []}
      responsePagination={payload?.pagination}
      pagination={{
        currentPage: mainPage,
        limit: mainLimit,
      }}
    />
  );
}
