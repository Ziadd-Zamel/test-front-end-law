import { APIResponse } from "../types/api";
import { getAuthHeader } from "../utils/auth-header";

// Mail message types
export interface MailMessage {
  id: string;
  subject: string;
  senderName: string;
  senderEmail: string;
  bodyPreview: string;
  receivedDateTime: string;
  sentDateTime: string;
  isRead: boolean;
  isDraft: boolean;
  isFlagged: boolean;
  hasAttachments: boolean;
  attachmentCount: number;
  importance: string;
  hasReply: boolean;
  replyCount: number;
  refType: string;
  refTag: string;
  refId: string;
}

export interface MailListResponse {
  folder: string;
  messages: MailMessage[];
  nextPageToken?: string;
}

export interface MailMessageDetails {
  id: string;
  subject: string;
  senderName: string;
  senderEmail: string;
  receivedDateTime: string;
  sentDateTime: string;
  body: string;
  bodyPreview: string;
  bodyType: string;
  toRecipients: string;
  toRecipientsNames: string;
  ccRecipients: string;
  ccRecipientsNames: string;
  bccRecipients: string;
  bccRecipientsNames: string;
  hasAttachments: boolean;
  attachmentCount: number;
  attachments?: MailAttachment[];
  isRead: boolean;
  isDraft: boolean;
  isFlagged: boolean;
  importance: string;
  conversationId: string;
  conversationIndex: string;
  internetMessageId: string;
  webLink: string;
  replyTo: string | null;
  refType: string;
  refTag: string;
  refId: string;
  inReplyToRefTag: string;
  rootRefTag: string;
  employeeId: string;
  lastModifiedDateTime: string;
  showMessages: ShowMessage[];
}

export interface ShowMessage {
  id: number;
  name: string;
  dateTime: string;
}

export interface MailAttachment {
  attechmentId: string;
  originalName: string;
  relativePath: string;
  contentType: string;
  downloadUrl: string | null;
}

export interface MailDetailsResponse {
  messages: MailMessageDetails[];
}

// Get Mail Messages
export const getMailMessages = async (
  mailboxType: "Info" | "Auto" | "Employee",
  folder: "inbox" | "sent" | "junk",
  skipToken?: string,
): Promise<APIResponse<MailListResponse>> => {
  const baseUrl = `${process.env.MAIL_API}/Mail/${mailboxType}/${folder}`;
  const url = skipToken ? `${baseUrl}?skipToken=${skipToken}` : baseUrl;

  const { token } = await getAuthHeader();

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const payload: APIResponse<MailListResponse> = await response.json();

  if (!response.ok) {
    throw new Error(` ${payload.message}`);
  }

  return payload;
};

// Get Message Details
export const getMessageDetails = async (
  messageId: string,
  mailBox: "auto" | "info" | "employeeemail",
  employeeId?: number,
): Promise<APIResponse<MailDetailsResponse>> => {
  const baseUrl = `${process.env.MAIL_API}/Mail/Get-Message-Details`;
  const params = new URLSearchParams();
  let decodedId = decodeURIComponent(messageId);
  if (decodedId.includes("%")) {
    decodedId = decodeURIComponent(decodedId);
  }
  params.append("messageId", decodedId);
  params.append("mailBox", mailBox);

  if (employeeId) {
    params.append("employeeId", employeeId.toString());
  }

  const url = `${baseUrl}?${params.toString()}`;

  const { token } = await getAuthHeader();

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
    next: { tags: ["mail-details"] },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const payload: APIResponse<MailDetailsResponse> = await response.json();

  return payload;
};
