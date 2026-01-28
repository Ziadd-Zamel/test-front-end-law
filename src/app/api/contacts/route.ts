import { NextResponse } from "next/server";
import { getAuthHeader } from "@/lib/utils/auth-header";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const refId = searchParams.get("refId");
    const refType = searchParams.get("refType");
    const pageSize = searchParams.get("pageSize") ?? "1000";
    const pageNumber = searchParams.get("pageNumber") ?? "1";

    if (!refId || !refType) {
      return NextResponse.json(
        { error: "refId and refType are required" },
        { status: 400 },
      );
    }

    const url = `${process.env.API}/Contact/ListByRef?refId=${refId}&refType=${refType}&pageSize=${pageSize}&pageNumber=${pageNumber}`;

    const { token } = await getAuthHeader();

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 600 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch contacts" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
