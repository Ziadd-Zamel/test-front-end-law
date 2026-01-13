import { NextRequest, NextResponse } from "next/server";
import { getAuthHeader } from "@/lib/utils/auth-header";
import { APIResponse } from "@/lib/types/api";
import { AttorneyCategory } from "@/lib/types/attorney";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params in Next.js 15+
    const { id } = await params;

    const url = `https://api.abdullah-hassan.com/api/Attorney/get-category-tree/${id}`;

    // Get the auth token
    const { token } = await getAuthHeader();
    console.log(token);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch category: ${response.status}` },
        { status: response.status }
      );
    }

    const payload: APIResponse<AttorneyCategory> = await response.json();

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Error fetching attorney category:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
