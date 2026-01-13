import "server-only";
import { cookies } from "next/headers";
import { AUTH_COOKIE, VERCEL_AUTH_COOKIE } from "../constants/auth.constant";
import { decode, JWT } from "next-auth/jwt";

export async function getAuthHeader(): Promise<{ token: string }> {
  const cookieStore = await cookies();

  const tokenCookie =
    cookieStore.get(AUTH_COOKIE)?.value ||
    cookieStore.get(VERCEL_AUTH_COOKIE)?.value;

  if (!tokenCookie) {
    throw new Error("No auth token found in cookies");
  }

  // Decode the JWE token (NextAuth automatically decrypts it)
  const decoded: JWT | null = await decode({
    token: tokenCookie,
    secret: process.env.NEXTAUTH_SECRET!,
  });

  if (!decoded) {
    throw new Error("Invalid or expired token");
  }

  // Extract the accessToken stored in your jwt callback
  const accessToken = decoded.accessToken as string;

  if (!accessToken) {
    throw new Error("No access token found in JWT");
  }
  return { token: accessToken };
}
