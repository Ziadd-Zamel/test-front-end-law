import { Suspense } from "react";
import PageContent from "./_components/page-content";
import AttorneyDetailsSkeleton from "./_components/attorney-details-skeleton";

export default async function page({
  params,
}: {
  params: Promise<{ attorneyId: string }>;
}) {
  const resolvedParams = await params;

  return (
    <Suspense fallback={<AttorneyDetailsSkeleton />}>
      <PageContent attorneyId={resolvedParams.attorneyId} />;
    </Suspense>
  );
}
