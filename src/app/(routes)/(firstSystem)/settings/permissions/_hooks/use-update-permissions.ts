import { apiPost } from "@/lib/utils/fetch-helper";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface UpdatePermissionsPayload {
  UserId: number;
  PermissionIds: number[];
}

export async function updateUserPermissions(payload: UpdatePermissionsPayload) {
  const result = await apiPost<UpdatePermissionsPayload>({
    endpoint: "/Permission/Update-User-Permissions",
    body: { UserId: payload.UserId, PermissionIds: payload.PermissionIds },
    revalidatePathUrl: "/attorney/attorney-management",
  });

  if (!result.success) {
    throw new Error(result.message);
  }

  return result;
}

export default function useUpdatePermissions() {
  const { isPending, error, mutate } = useMutation({
    mutationFn: updateUserPermissions,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });

  return {
    isPending,
    error,
    updatePermissions: mutate,
  };
}
