## Overview

This document provides detailed technical documentation for the core authentication system components: `auth.ts`, middleware, and the token refresh provider. These components work together to provide secure authentication, route protection, and automatic token management.

## Table of Contents

1. [NextAuth.js Configuration (`auth.ts`)](#nextauthjs-configuration-authts)
2. [Middleware (`middleware.ts`)](#middleware-middlewarets)
3. [Token Refresh Provider](#token-refresh-provider)
4. [Token Refresh Action](#token-refresh-action)
5. [Type Definitions](#type-definitions)
6. [Security Features](#security-features)
7. [Error Handling](#error-handling)
8. [Development Notes](#development-notes)

---

## NextAuth.js Configuration (`auth.ts`)

### File Location

```
src/auth.ts
```

### Purpose

Configures NextAuth.js with custom providers and callbacks to handle both traditional credentials login and OTP-based verification.

### Configuration Details

#### Providers

**1. Credentials Provider (`credentials`)**

- **ID**: `credentials`
- **Purpose**: Traditional username/password authentication
- **Endpoint**: `${process.env.API}/Login`
- **Credentials**:
  - `identity`: User's national ID or username
  - `password`: User's password

**2. Verification Code Provider (`verification-code`)**

- **ID**: `verification-code`
- **Purpose**: OTP-based authentication
- **Endpoint**: `${process.env.API}/Verify/Code`
- **Credentials**:
  - `code`: 6-digit verification code
  - `token`: Verification token from previous step

#### Callbacks

**JWT Callback**

```typescript
jwt: async ({ token, user }) => {
  // Only set tokens on initial login
  if (user) {
    return {
      ...token,
      accessToken: user.token,
      refreshToken: user.refreshToken,
      loginMethod: user.loginMethod,
    };
  }
  return token;
};
```

**Session Callback**

```typescript
session: async ({ session, token }) => {
  session.accessToken = token.accessToken;
  session.refreshToken = token.refreshToken;
  session.error = token.error;
  session.loginMethod = token.loginMethod;
  return session;
};

## Middleware (`middleware.ts`)

### File Location

```

src/middleware.ts

````

### Purpose

Protects routes by checking authentication status and redirecting users appropriately.

### Configuration

#### Matcher

```typescript
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
````

**Excluded Paths**:

- `/api` - API routes
- `/_next/static` - Static files
- `/_next/image` - Image optimization files
- `/favicon.ico` - Favicon file

#### Public Paths

```typescript
const publicPaths = [
  "/auth",
  "/auth/login",
  "/auth/register",
  "/auth/forget-password",
  "/auth/otp-email",
  "/auth/otp-login",
  "/auth/otp-whatsapp",
  "/favicon.ico",
  "/_next",
  "/api/auth",
];
```

### Authentication Logic

1. **Path Classification**:

   - Determines if path is public (no auth required)
   - Identifies auth-related paths

2. **Token Verification**:

   - Extracts JWT from cookies
   - Decodes and validates token using NextAuth secret
   - Handles both standard and Vercel cookie formats

3. **Route Protection**:
   - **Authenticated + Auth Path**: Redirect to home (`/`)
   - **Unauthenticated + Protected Path**: Redirect to login (`/auth/login`)
   - **Public Path**: Allow access

### Cookie Handling

**Supported Cookies**:

- `next-auth.session-token` (standard)
- `__Secure-next-auth.session-token` (Vercel production)

**Token Decoding**:

```typescript
const decodedToken = await decode({
  token: tokenCookie,
  secret: process.env.NEXTAUTH_SECRET!,
});
```

---

## Token Refresh Provider

### File Location

```
src/components/providers/components/token-refresh-provider.tsx
```

### Purpose

Automatically refreshes access tokens in the background to maintain user sessions.

### Implementation Details

#### Component Structure

```typescript
export function TokenRefreshProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  // ... implementation
}
```

#### Key Features

**1. Automatic Token Refresh**

- Runs every 10 seconds (configurable)
- Only runs when refresh token is available
- Handles cleanup on component unmount

**2. Session Integration**

- Uses NextAuth `useSession` hook
- Monitors refresh token availability
- Updates session automatically

**3. Error Handling**

- Logs refresh attempts and results
- Handles refresh failures gracefully
- Optionally redirects to login on failure

#### Refresh Logic

```typescript
const handleTokenRefresh = async () => {
  try {
    const result = await refreshAccessToken(session.refreshToken || "");
    if (result.success) {
      console.log("Token refreshed successfully");
    } else {
      console.error("Token refresh failed:", result.error);
    }
  } catch (error) {
    console.error("Error during token refresh:", error);
  }
};
```

#### Lifecycle Management

- **Mount**: Starts refresh interval and performs initial refresh
- **Unmount**: Clears interval to prevent memory leaks
- **Dependency**: Re-runs when refresh token changes

---

## Token Refresh Action

### File Location

```
src/lib/actions/refresh-token.ts
```

### Purpose

Server action that handles the actual token refresh API call and cookie updates.

### Implementation Details

#### API Call

```typescript
const response = await fetch(
  `${process.env.NEXT_PUBLIC_API || process.env.API}/api/Resend-Access-Toekn`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refreshToken,
    }),
  }
);
```

#### Cookie Management

```typescript
// Update the NextAuth session cookie with the new token
const newToken = await encode({
  token: {
    accessToken: result.accessToken,
    refreshToken: refreshToken,
  },
  secret: process.env.NEXTAUTH_SECRET!,
});

cookieStore.set("next-auth.session-token", newToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 30 * 24 * 60 * 60,
});
```

#### Error Handling

```typescript
// Delete NextAuth session cookies to sign out user
const cookieStore = await cookies();
cookieStore.delete("next-auth.session-token");
cookieStore.delete("__Secure-next-auth.session-token");
cookieStore.delete("next-auth.csrf-token");
```

### Return Values

```typescript
// Success
{
  success: true,
  accessToken: string,
  message: string,
}

// Error
{
  success: false,
  error: string,
}
```

---

## Type Definitions

### File Location

```
src/lib/types/next-auth.d.ts
```

### Extended Types

#### Session Interface

```typescript
interface Session extends DefaultSession {
  accessToken?: string;
  refreshToken?: string;
  error?: string;
  loginMethod?: "credentials" | "verification-code";
  user: {
    accessToken?: string;
    refreshToken?: string;
    loginMethod?: "credentials" | "verification-code";
  } & DefaultSession["user"];
}
```

#### User Interface

```typescript
interface User extends DefaultUser {
  token?: string;
  refreshToken?: string;
  message?: string;
  loginMethod?: "credentials" | "verification-code";
}
```

#### JWT Interface

```typescript
interface JWT extends DefaultJWT {
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpires?: number;
  error?: string;
  loginMethod?: "credentials" | "verification-code";
}
```

---

## Security Features

### 1. Token Security

- **HTTP-Only Cookies**: Prevents XSS attacks
- **Secure Cookies**: HTTPS-only in production
- **SameSite Protection**: CSRF protection
- **Token Rotation**: Refresh token rotation on each refresh

### 3. Session Management

- **Automatic Refresh**: Background token renewal
- **Session Validation**: JWT verification on each request
- **Cleanup on Error**: Automatic logout on token refresh failure

### Environment Variables Required

```env
NEXTAUTH_SECRET=your-secret-key
API=your-api-endpoint
NEXT_PUBLIC_API=your-public-api-endpoint
NODE_ENV=development|production
```

### Cookie Configuration

- **Development**: Standard cookies
- **Production**: Secure cookies with `__Secure-` prefix
- **Vercel**: Automatic secure cookie handling
