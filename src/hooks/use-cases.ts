import { useQuery } from "@tanstack/react-query";

export const getAllCases = async () => {
  const response = await fetch("/api/cases", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export function useCases() {
  return useQuery({
    queryKey: ["cases"],
    queryFn: getAllCases,
    staleTime: 5 * 60 * 1000,
  });
}
