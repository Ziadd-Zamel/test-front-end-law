/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { getAuthHeader } from "@/lib/utils/auth-header";
import { APIResponse } from "@/lib/types/api";
import { MailListResponse } from "@/lib/api/mail.api";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const mailboxType = searchParams.get("mailboxType") as
      | "info"
      | "auto"
      | "employee";
    const folder = searchParams.get("folder") as "inbox" | "sent" | "junk";
    const pageNumber = searchParams.get("pageNumber") || "1";
    const pageSize = searchParams.get("pageSize") || "20";

    if (!mailboxType || !folder) {
      return NextResponse.json(
        { message: "Missing required parameters" },
        { status: 400 }
      );
    }

    const url = `${process.env.MAIL_API}/Mail/${mailboxType}/${folder}?pageSize=${pageSize}&pageNumber=${pageNumber}`;
    console.log("urlurlurl", url);
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
      return NextResponse.json(
        { message: payload.message || "Failed to fetch messages" },
        { status: response.status }
      );
    }

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
