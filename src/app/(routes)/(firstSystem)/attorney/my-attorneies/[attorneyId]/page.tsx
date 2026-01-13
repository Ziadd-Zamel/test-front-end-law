import { Suspense } from "react";
import PageContent from "./_components/page-content";
import MyAttorneyDetailsSkeleton from "./_components/my-attorney-details-skeleton";

export default async function page({
  params,
}: {
  params: Promise<{ attorneyId: string }>;
}) {
  const resolvedParams = await params;

  return (
    <Suspense fallback={<MyAttorneyDetailsSkeleton />}>
      <PageContent attorneyId={resolvedParams.attorneyId} />
    </Suspense>
  );
}
