import { useQuery } from "@tanstack/react-query";

export const getAllCasesCategories = async () => {
  const response = await fetch("/api/cases/categories", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
export function useCasesCategories() {
  return useQuery({
    queryKey: ["cases-categories"],
    queryFn: getAllCasesCategories,
    staleTime: 5 * 60 * 1000,
  });
}
