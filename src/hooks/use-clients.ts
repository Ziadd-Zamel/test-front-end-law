import { useQuery } from "@tanstack/react-query";

export const getAllClientsClient = async () => {
  const response = await fetch("/api/clients", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
export function useClients() {
  return useQuery({
    queryKey: ["clients"],
    queryFn: getAllClientsClient,
    staleTime: 5 * 60 * 1000,
  });
}
