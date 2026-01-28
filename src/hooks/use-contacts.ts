import { useQuery } from "@tanstack/react-query";

export interface GetContactsParams {
  refId: string;
  refType: "case" | "task";
  pageSize?: number;
  pageNumber?: number;
}

export const getContactsByRef = async ({
  refId,
  refType,
  pageSize = 20,
  pageNumber = 1,
}: GetContactsParams) => {
  const params = new URLSearchParams({
    refId,
    refType,
    pageSize: pageSize.toString(),
    pageNumber: pageNumber.toString(),
  });

  const response = await fetch(`/api/contacts?${params.toString()}`, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const json = await response.json();
  console.log("contacts response:", json);

  return json;
};

export function useContacts(params: GetContactsParams) {
  const { refId, refType } = params;

  return useQuery({
    queryKey: ["contacts", refType, refId, params.pageNumber],
    queryFn: () => getContactsByRef(params),
    enabled: !!refId && !!refType,
  });
}
