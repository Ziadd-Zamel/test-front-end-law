import { NextResponse } from "next/server";
import { getAuthHeader } from "@/lib/utils/auth-header";

export async function GET() {
  try {
    const url = `${process.env.API}/Employee/Get-All`;
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
        { error: "Failed to fetch companies" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
