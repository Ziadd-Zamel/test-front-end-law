import { useQuery } from "@tanstack/react-query";

export const getAllEmployees = async () => {
  const response = await fetch("/api/employee", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
export function useEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: getAllEmployees,
    staleTime: 5 * 60 * 1000,
  });
}
