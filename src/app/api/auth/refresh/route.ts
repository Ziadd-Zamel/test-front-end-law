import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Refresh token is required",
        },
        { status: 400 }
      );
    }

    console.log("🔄 Refreshing access token via API route");

    const response = await fetch(`${process.env.API}/Resend-Access-Toekn`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      console.error("❌ Token refresh failed:", result.message);
      return NextResponse.json(
        {
          success: false,
          message: result.message || "Failed to refresh token",
        },
        { status: response.status }
      );
    }

    console.log("✅ Token refreshed successfully");

    return NextResponse.json({
      success: true,
      data: {
        accessToken: result.data.accessToken,
        refreshToken: result.data.refreshToken,
      },
    });
  } catch (error) {
    console.error("❌ Exception during token refresh:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error during token refresh",
      },
      { status: 500 }
    );
  }
}
