import {
  PageEmptyState,
  PageErrorState,
} from "@/components/common/page-states";
import { getAttorneyRequestById } from "@/lib/api/attorney.api";
import catchError from "@/lib/utils/catch-error";
import AttorneyDetails from "./attorney-details";

export default async function PageContent({
  attorneyId,
}: {
  attorneyId: string;
}) {
  const [payload, error] = await catchError(() =>
    getAttorneyRequestById(attorneyId)
  );

  // Handle error state
  if (error) {
    return <PageErrorState error={error} />;
  }

  if (!payload || !payload.data) {
    return <PageEmptyState />;
  }

  return <AttorneyDetails data={payload?.data} />;
}
