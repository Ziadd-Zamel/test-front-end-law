import { useQuery } from "@tanstack/react-query";

export const getUserPermissions = async (userId: number) => {
  const response = await fetch(`/api/employee-permission?userId=${userId}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export function useEmployeePermissions(userId: number) {
  return useQuery({
    queryKey: ["employee-permission", userId],
    queryFn: () => getUserPermissions(userId),
    staleTime: 5 * 60 * 1000,
    enabled: !!userId,
  });
}
