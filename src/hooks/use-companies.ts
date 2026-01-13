import { useQuery } from "@tanstack/react-query";
export const getAllCompaniesClient = async () => {
  const response = await fetch("/api/companies", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
export function useCompanies() {
  return useQuery({
    queryKey: ["companies"],
    queryFn: getAllCompaniesClient,
    staleTime: 5 * 60 * 1000,
  });
}
