import { PageErrorState } from "@/components/common/page-states";
import { GetCaseById } from "@/lib/api/cases";
import catchError from "@/lib/utils/catch-error";

export default async function CaseDetailsPage({ caseId }: { caseId: string }) {
  const [payload, error] = await catchError(() => GetCaseById(caseId));
  if (error) {
    <PageErrorState />;
  }
  return (
    <div>
      <div></div>
    </div>
  );
}
