import catchError from "@/lib/utils/catch-error";
import { getAllAttorneyRequests } from "@/lib/api/attorney.api";
import AttorneyTable from "./_components/attorney-table";
import { TableErrorState } from "@/components/common/table-states";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    clientId?: string;
    status?: string;
    pageNumber?: string;
    pageSize?: string;
  }>;
}) {
  // Resolve Params
  const resolvedParams = await searchParams;

  // variables
  const clientId = resolvedParams.clientId;
  const status = resolvedParams.status;
  const mainPage = Math.max(1, Number(resolvedParams.pageNumber) || 1);
  const mainLimit = Math.max(
    1,
    Math.min(50, Number(resolvedParams.pageSize) || 5)
  );

  // Fetching
  const [payload, error] = await catchError(() =>
    getAllAttorneyRequests(clientId, status, mainLimit, mainPage)
  );

  // Handle error state
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

  // Table
  return (
    <div className=" w-full box-container pt-20 pb-10">
      <AttorneyTable
        attorney={payload?.data || []}
        responsePagination={payload?.pagination}
        pagination={{
          currentPage: mainPage,
          limit: mainLimit,
        }}
      />
    </div>
  );
}
