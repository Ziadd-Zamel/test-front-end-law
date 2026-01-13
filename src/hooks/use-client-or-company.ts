import { useQuery } from "@tanstack/react-query";
import { getAllCompaniesClient } from "./use-companies";
import { getAllClientsClient } from "./use-clients";

type ClientType = "client" | "company";

export function useClientOrCompany(type: ClientType | undefined) {
  return useQuery({
    queryKey: type
      ? [type === "client" ? "clients" : "companies"]
      : ["no-type"],
    queryFn: () => {
      if (type === "client") {
        return getAllClientsClient();
      } else if (type === "company") {
        return getAllCompaniesClient();
      }
      return Promise.resolve({ data: [] });
    },
    enabled: !!type,
    staleTime: 5 * 60 * 1000,
  });
}
