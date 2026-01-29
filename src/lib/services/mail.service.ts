"use server";
import { revalidateTag } from "next/cache";
import { getAuthHeader } from "../utils/auth-header";

// Interfaces
export interface replayMailBody {
  originalMessageId: string;
  replyBodyHtml: string;
  attachments?: MainAttachment[];
  ccClientContactIds?: string[];
}

export interface sendEmployeeMailBody {
  subject: string;
  content: string;
  recipientEmployeeId: string[];
}

export interface sendAutoMailBody {
  subject: string;
  content: string;
  refType: string;
  refId: string;
}
export interface updateMessageBody {
  messageId: string;
  refType: string;
  refId: string;
}

export interface sendMailBody {
  subject: string;
  bodyHtml: string;
  refType: string;
  refId: string;
  attachments?: MainAttachment[];
  ccClientContactIds?: string[];
}

export interface searchMailBody {
  refType?: string;
  refId?: string;
  query?: string;
  clientId?: string;
  fromDate?: string;
  messageType?: string;
  toDate?: string;
}

// send mail
export async function sendMailService({
  body,
  skipAttachmentCheck = false,
}: {
  body: sendMailBody;
  skipAttachmentCheck?: boolean;
}) {
  const token = await getAuthHeader();

  const transformedBody = {
    subject: body.subject,
    bodyHtml: body.bodyHtml,
    refType: body.refType,
    refId: body.refId,
    isAttachmentCheckRequired: skipAttachmentCheck ? 0 : 1,
    ...(body.ccClientContactIds &&
      body.ccClientContactIds?.length > 0 && {
        ccClientContactIds: body.ccClientContactIds,
      }),
    ...(body.attachments &&
      body.attachments.length > 0 && {
        attachments: body.attachments.map((attachment) => ({
          attechmentId: attachment.id,
          originalName: attachment.originalName,
          relativePath: attachment.relativePath,
        })),
      }),
  };

  const response = await fetch(`${process.env.MAIL_API}/Mail/Sent`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transformedBody),
  });

  const result = await response.json();
  console.log("resultresultresultresult", result);

  if (!response.ok) {
    return {
      message: result.Message,
      success: false,
      IsAttachmentConfirmationError: result.IsAttachmentConfirmationError,
    };
  }

  return result;
}
// Send Mail to employee
export async function sendEmployeeMailService({
  body,
}: {
  body: sendEmployeeMailBody;
}) {
  const token = await getAuthHeader();
  const response = await fetch(
    `${process.env.MAIL_API}/Mail/Send-Employee-To-Employee`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );
  const result = await response.json();

  if (!response.ok) {
    return { message: result.Message, success: false };
  }

  return result;
}

// Send Mail to Auto-Notification
export async function sendAutoMailService({
  body,
}: {
  body: sendAutoMailBody;
}) {
  const token = await getAuthHeader();

  const response = await fetch(
    `${process.env.MAIL_API}/Mail/Send-Auto-Notification`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    return { message: result.Message, success: false };
  }

  return result;
}

// Reply Mail
export async function replayMailService({ body }: { body: replayMailBody }) {
  const token = await getAuthHeader();

  const transformedBody = {
    originalMessageId: body.originalMessageId,
    replyBodyHtml: body.replyBodyHtml,
    ...(body.ccClientContactIds &&
      body.ccClientContactIds?.length > 0 && {
        ccClientContactIds: body.ccClientContactIds,
      }),
    ...(body.attachments &&
      body.attachments.length > 0 && {
        attachments: body.attachments.map((attachment) => ({
          attechmentId: attachment.id,
          originalName: attachment.originalName,
          relativePath: attachment.relativePath,
        })),
      }),
  };
  const response = await fetch(`${process.env.MAIL_API}/Mail/Reply`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transformedBody),
  });

  const result = await response.json();

  if (!response.ok) {
    return { message: result.Message, success: false };
  }

  revalidateTag("mail-details");
  return result;
}

// Search in mail
export async function searchMailService({
  body,
  mailboxType,
  pageNumber = 1,
  pageSize = 20,
}: {
  body: searchMailBody;
  mailboxType: mailboxType;
  pageNumber?: number;
  pageSize?: number;
}) {
  const token = await getAuthHeader();

  // Mail box type
  const mailboxTypes =
    mailboxType === "Employee" ? "employeeemail" : mailboxType.toLowerCase();

  // Response
  const response = await fetch(
    `${process.env.MAIL_API}/Mail/search?mailBox=${mailboxTypes}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    return { message: result.Message, success: false };
  }

  return result;
}

// Log Mail Read
export async function logMailReadService(mailId: string) {
  const token = await getAuthHeader();

  const response = await fetch(
    `${process.env.MAIL_API}/Mail/Log-Read?mailId=${mailId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.token}`,
      },
    },
  );

  const result = await response.json();

  if (!response.ok) {
    return { message: result.Message, success: false };
  }

  return result;
}

// update message
export async function updateMessageService(body: updateMessageBody) {
  const token = await getAuthHeader();
  const response = await fetch(
    `${process.env.MAIL_API}/Mail/Update-Message-Raf-Tag`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.token}`,
      },
      body: JSON.stringify(body),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    return { message: result.Message, success: false };
  }
  revalidateTag("mail-details");

  return result;
}
