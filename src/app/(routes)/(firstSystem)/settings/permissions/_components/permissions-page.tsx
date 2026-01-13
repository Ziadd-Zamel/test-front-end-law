import catchError from "@/lib/utils/catch-error";
import AddPermissions from "./add-permissions";
import { getAllPermissions } from "@/lib/api/permissions.api";
import {
  PageEmptyState,
  PageErrorState,
} from "@/components/common/page-states";

export default async function PermissionsPage() {
  const [payload, error] = await catchError(() => getAllPermissions());
  if (error) {
    return <PageErrorState />;
  }
  if (!payload?.data) {
    return <PageEmptyState />;
  }
  return (
    <div className="flex-center w-full min-h-[70%]">
      <AddPermissions permissions={payload?.data} />
    </div>
  );
}
