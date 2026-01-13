import {
  PageEmptyState,
  PageErrorState,
} from "@/components/common/page-states";
import { getUserAttorneyById } from "@/lib/api/attorney.api";
import catchError from "@/lib/utils/catch-error";
import MyAttorneyDetails from "./my-attorney-details";

export default async function PageContent({
  attorneyId,
}: {
  attorneyId: string;
}) {
  const [payload, error] = await catchError(() =>
    getUserAttorneyById(attorneyId)
  );

  // Handle error state
  if (error) {
    return <PageErrorState error={error} />;
  }
  if (!payload || !payload.data) {
    return <PageEmptyState />;
  }

  return <MyAttorneyDetails data={payload?.data} />;
}
