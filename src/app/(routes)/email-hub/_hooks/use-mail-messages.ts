// lib/hooks/use-mail-messages.ts
import { MailMessage } from "@/lib/api/mail.api";
import { useInfiniteQuery } from "@tanstack/react-query";

interface Pagination {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

interface MailListResponse {
  folder: string;
  messages: MailMessage[];
  pagination: Pagination;
}

interface MailAPISuccessResponse {
  success: boolean;
  message: string;
  data: MailListResponse;
}

async function fetchMailMessages(
  mailboxType: "Info" | "Auto" | "Employee",
  folder: "inbox" | "sent" | "junk",
  pageNumber: number = 1,
  pageSize: number = 20
): Promise<MailAPISuccessResponse> {
  const params = new URLSearchParams({
    mailboxType,
    folder,
    pageNumber: pageNumber.toString(),
    pageSize: pageSize.toString(),
  });

  const response = await fetch(`/api/mail?${params.toString()}`);
  console.log("responseresponse", response);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch messages");
  }

  const data = await response.json();

  return data as MailAPISuccessResponse;
}

export function useMailMessages(
  mailboxType: "Info" | "Auto" | "Employee",
  folder: "inbox" | "sent" | "junk",
  pageSize: number = 20
) {
  return useInfiniteQuery({
    queryKey: ["mail", mailboxType, folder, pageSize],
    queryFn: ({ pageParam = 1 }) =>
      fetchMailMessages(mailboxType, folder, pageParam, pageSize),
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage.data;
      return pagination.hasNextPage ? pagination.pageNumber + 1 : undefined;
    },
    initialPageParam: 1,
  });
}
