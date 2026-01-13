import SettlementRequestPage from "./_components/settlement-request-page";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    pageNumber?: string;
    pageSize?: string;
  }>;
}) {
  // resolve params
  const resolvedParams = await searchParams;

  // variables
  const status = resolvedParams.status;
  const mainPage = Math.max(1, Number(resolvedParams.pageNumber) || 1);
  const mainLimit = Math.max(
    1,
    Math.min(50, Number(resolvedParams.pageSize) || 5)
  );

  // table
  return (
    <SettlementRequestPage
      pagination={{
        currentPage: mainPage,
        limit: mainLimit,
      }}
      status={status || ""}
    />
  );
}
