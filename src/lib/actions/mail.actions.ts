"use server";
import { getAuthHeader } from "../utils/auth-header";

interface MailReplyBody {
  originalMessageId: string;
  replyBodyHtml: string;
  attachments?: Attachment[];
}

interface MailSendEmployeeBody {
  subject: string;
  content: string;
  refId: number;
  refType: number;
}

interface MailSendAutoBody {
  subject: string;
  content: string;
  recipientEmployeeId: number;
}

interface MailSentBody {
  clientId: number;
  subject: string;
  bodyHtml: string;
  title: string;
  refType: string;
  refId: number;
  attachments?: Attachment[];
}

interface MailSearchBody {
  refType: string;
  refId: number;
}

// Reply Mail
export async function mailReply({ body }: { body: MailReplyBody }) {
  const token = await getAuthHeader();

  const response = await fetch(`${process.env.API}/Mail/Reply`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const result = await response.json();

  if (!response.ok) {
    return { message: result.message, success: false };
  }

  return result;
}

// Search in mail
export async function mailSearch({
  body,
  mailBox,
}: {
  body: MailSearchBody;
  mailBox: mailboxType;
}) {
  const token = await getAuthHeader();

  const response = await fetch(
    `${process.env.API}/Mail/search?mailBox=${mailBox}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    return { message: result.message, success: false };
  }

  return result;
}

// Send Mail
export async function mailSend({ body }: { body: MailSentBody }) {
  const token = await getAuthHeader();

  const response = await fetch(`${process.env.API}/Mail/Sent`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const result = await response.json();

  if (!response.ok) {
    return { message: result.message, success: false };
  }

  return result;
}

// Send Mail to employee
export async function mailSendEmployee({
  body,
}: {
  body: MailSendEmployeeBody;
}) {
  const token = await getAuthHeader();

  const response = await fetch(
    `${process.env.API}/Mail/Send-Employee-To-Employee`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    return { message: result.message, success: false };
  }

  return result;
}

// Send Mail to Auto-Notification
export async function mailSendAuto({ body }: { body: MailSendAutoBody }) {
  const token = await getAuthHeader();

  const response = await fetch(
    `${process.env.API}/Mail/Send-Auto-Notification`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    return { message: result.message, success: false };
  }

  return result;
}

// Update Messages Reftag
export async function mailUpdateReftag({
  updatedMessageId,
  originalMessageId,
}: {
  originalMessageId: string;
  updatedMessageId: string;
}) {
  const token = await getAuthHeader();

  const response = await fetch(
    `${process.env.API}/Mail/Update-Message-Raf-Tag?originalMessageId=${originalMessageId}&updatedMessageId=${updatedMessageId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    return { message: result.message, success: false };
  }

  return result;
}
