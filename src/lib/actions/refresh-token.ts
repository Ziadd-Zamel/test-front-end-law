"use server";
import { cookies } from "next/headers";
import { encode } from "next-auth/jwt";

export async function refreshAccessToken(refreshToken: string) {
  try {
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

    if (!response.ok) {
      throw new Error(
        result.message || `HTTP error! status: ${response.status}`
      );
    }

    console.log(
      "Server Action - Got new access token:",
      result.data.accessToken
    );
    console.log(
      "Server Action - Got new refresh token:",
      result.data.refreshToken
    );

    // Update the NextAuth session cookie with the new tokens
    const cookieStore = await cookies();
    const sessionToken =
      cookieStore.get("next-auth.session-token")?.value ||
      cookieStore.get("__Secure-next-auth.session-token")?.value;

    if (sessionToken) {
      // Decode and update the JWT with new tokens
      const newToken = await encode({
        token: {
          accessToken: result.data.accessToken,
          refreshToken: result.data.refreshToken,
        },
        secret: process.env.NEXTAUTH_SECRET!,
      });

      // Update the cookie
      (await cookies()).set("next-auth.session-token", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60,
      });

      console.log("Cookie updated with new tokens");
    }

    return {
      success: true,
      accessToken: result.data.accessToken,
      refreshToken: result.data.refreshToken,
      message: result.message,
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);

    // Use a separate function to handle logout
    await clearAuthCookies();

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to refresh token",
    };
  }
}

// Separate Server Action for clearing cookies
export async function clearAuthCookies() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete("next-auth.session-token");
  cookieStore.delete("__Secure-next-auth.session-token");
  cookieStore.delete("next-auth.csrf-token");
  console.log("Auth cookies cleared");
}
