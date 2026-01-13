import CaseDetailsPage from "./_components/case-details-page";

export default async function Page({
  params,
}: {
  params: Promise<{
    caseId?: string;
  }>;
}) {
  // Resolve Params
  const resolvedParams = await params;

  return <CaseDetailsPage caseId={resolvedParams.caseId || ""} />;
}
