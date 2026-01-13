/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decode } from "next-auth/jwt";
import { AUTH_COOKIE, VERCEL_AUTH_COOKIE } from "./lib/constants/auth.constant";

// Auth routes that are always public
const authPaths = [
  "/auth/login",
  "/auth/register",
  "/auth/forget-password",
  "/auth/otp-email",
  "/auth/otp-login",
  "/auth/otp-whatsapp",
];

// General public routes
const publicPaths = ["/auth", ...authPaths, "/favicon.ico", "/_next"];

// Allowed when user is unverified
const verificationPaths = ["/verification-required"];

// Permission-based routes
const permissionRoutes: Record<string, string> = {
  "/attorney/all-attorneies": "قائمة جميع الوكالات",
  "/cases/category": "إدارة_تصنيفات_القضايا_والصلح",
  "/settlement/category": "إدارة_تصنيفات_القضايا_والصلح",
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Route flags
  const isPublicPath = publicPaths.some((p) => pathname.startsWith(p));
  const isAuthPath = pathname.startsWith("/auth");
  const isVerificationPath = verificationPaths.some((p) =>
    pathname.startsWith(p)
  );

  // Read auth cookie
  const tokenCookie =
    request.cookies.get(AUTH_COOKIE)?.value ||
    request.cookies.get(VERCEL_AUTH_COOKIE)?.value;

  let decodedToken: any = null;
  let isAuthenticated = false;

  // Decode JWT token
  if (tokenCookie) {
    try {
      decodedToken = await decode({
        token: tokenCookie,
        secret: process.env.NEXTAUTH_SECRET!,
      });
      isAuthenticated = !!decodedToken;
    } catch {
      isAuthenticated = false;
    }
  }

  // Not authenticated → only public pages allowed
  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  /* ------------------------------------------------------------------
       ADMIN SUPER USER CHECK
     ------------------------------------------------------------------ */
  const roles: string[] = decodedToken?.roles ?? [];
  const isAdmin = roles.includes("Admin");

  if (isAdmin) {
    // Admin can access everything except login/register
    if (isAuthPath) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  /* ------------------------------------------------------------------
     VERIFICATION CHECK
     ------------------------------------------------------------------ */
  if (isAuthenticated && decodedToken) {
    const profile = decodedToken.profile;
    const isVerified = profile?.emailConfirmed && profile?.phoneNumberConfirmed;

    // User NOT verified
    if (!isVerified) {
      if (!isVerificationPath && !isPublicPath) {
        return NextResponse.redirect(
          new URL("/verification-required", request.url)
        );
      }
    }
    // User IS verified
    else {
      if (isVerificationPath) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      if (isAuthPath) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  /* ------------------------------------------------------------------
       EMPLOYEE-ONLY ROUTES
     ------------------------------------------------------------------ */
  if (pathname.startsWith("/attorney")) {
    const userType = decodedToken?.type;

    if (userType !== "Employee") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  /* ------------------------------------------------------------------
       ADMIN-ONLY ROUTE
      /settings/permissions is ONLY for Admins
     ------------------------------------------------------------------ */
  if (pathname.startsWith("/settings/permissions") && !isAdmin) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  /* ------------------------------------------------------------------
    PERMISSION-BASED ACCESS (Non-admin users)
     ------------------------------------------------------------------ */
  if (isAuthenticated && decodedToken && !isAdmin) {
    for (const [route, requiredPermission] of Object.entries(
      permissionRoutes
    )) {
      if (pathname.startsWith(route)) {
        const userPermissions = decodedToken?.profile?.permissions ?? [];

        const hasPermission = userPermissions.some(
          (permission: { id: number; name: string }) =>
            permission.name === requiredPermission
        );

        if (!hasPermission) {
          return NextResponse.redirect(new URL("/unauthorized", request.url));
        }

        break;
      }
    }
  }

  // Allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - /api/* (all API routes including NextAuth)
     * - /_next/static (static files)
     * - /_next/image (image optimization)
     * - /_next/data (server actions)
     * - /favicon.ico, /sitemap.xml, /robots.txt
     */
    "/((?!api/|_next/static|_next/image|_next/data|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
