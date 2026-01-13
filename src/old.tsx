/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginResponse } from "./lib/types/api";
import { cookies } from "next/headers";

// ============================================
// Fetch Profile
// ============================================

async function fetchUserProfile(accessToken: string) {
  try {
    const response = await fetch(`${process.env.API}/Shared/Profile/0`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok || !result.success || !result.data) return null;

    return result.data;
  } catch (error) {
    return null;
  }
}

// ============================================
// Refresh Token
// ============================================

async function refreshAccessToken(token: any) {
  try {
    const response = await fetch(`${process.env.API}/Resend-Access-Toekn`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      try {
        const cookieStore = await cookies();
        cookieStore.delete("next-auth.session-token");
        cookieStore.delete("__Secure-next-auth.session-token");
        cookieStore.delete("next-auth.csrf-token");
      } catch {}

      return {
        ...token,
        accessToken: null,
        refreshToken: null,
        accessTokenExpires: 0,
        error: "RefreshAccessTokenError",
      };
    }

    return {
      ...token,
      accessToken: result.data.accessToken,
      refreshToken: result.data.refreshToken,
      accessTokenExpires: Date.now() + 9 * 60 * 1000,
      error: undefined,
    };
  } catch {
    return {
      ...token,
      accessToken: null,
      refreshToken: null,
      error: "RefreshAccessTokenError",
    };
  }
}

// ============================================
// NextAuth Config
// ============================================

export const authOptions: NextAuthOptions = {
  providers: [
    // ============================================
    // Credentials Login
    // ============================================
    Credentials({
      id: "credentials",
      name: "Credentials Login",
      credentials: {
        identity: { label: "Identity", type: "text" },
        password: { label: "Password", type: "password" },
        visitorId: { label: "Visitor ID", type: "text" },
        ip: { label: "IP", type: "text" },
        country: { label: "Country", type: "text" },
        city: { label: "City", type: "text" },
        latitude: { label: "Latitude", type: "text" },
        longitude: { label: "Longitude", type: "text" },
        plusCode: { label: "Plus Code", type: "text" },
      },
      authorize: async (credentials) => {
        if (!credentials?.identity || !credentials?.password)
          throw new Error("Identity and password are required.");

        try {
          const body = {
            identity: credentials.identity,
            password: credentials.password,
            visitorId: credentials.visitorId,
            ...(credentials.ip && { ip: credentials.ip }),
            ...(credentials.country && { country: credentials.country }),
            ...(credentials.city && { city: credentials.city }),
            ...(credentials.latitude && { latitude: credentials.latitude }),
            ...(credentials.longitude && { longitude: credentials.longitude }),
            ...(credentials.plusCode && { plusCode: credentials.plusCode }),
          };

          const response = await fetch(`${process.env.API}/Login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });

          const result: LoginResponse = await response.json();

          if (!response.ok) throw new Error(result.message);

          if (result.data.verify) {
            throw new Error(
              `VERIFICATION_REQUIRED|||${result.data.token}|||${result.message}`
            );
          }

          return {
            id: result.data.token,
            token: result.data.token,
            refreshToken: result.data.refreshToken,
            message: result.message,
            loginMethod: "credentials",
            type: result.data.type,
            roles: result.data.roles,
          };
        } catch (error) {
          throw new Error(
            error instanceof Error
              ? error.message
              : "رقم الهوية الوطنية او كلمة المرور غير صحيحة"
          );
        }
      },
    }),

    // ============================================
    // Verification Code Login
    // ============================================
    Credentials({
      id: "verification-code",
      name: "Verification Code Login",
      credentials: {
        code: { label: "Verification Code", type: "text" },
        visitorId: { label: "visitorId", type: "text" },
        token: { label: "Verification Token", type: "hidden" },
      },
      authorize: async (credentials) => {
        if (!credentials?.code || !credentials?.token)
          throw new Error("Token is required.");

        try {
          const response = await fetch(`${process.env.API}/Verify/Code`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${credentials.token}`,
            },
            body: JSON.stringify({
              code: credentials.code,
              visitorId: credentials.visitorId,
              typeOfGenerate: "VerifyLogin",
            }),
          });

          const result = await response.json();

          if (!response.ok) throw new Error(result.message);

          return {
            id: result.data.token,
            token: result.data.token,
            refreshToken: result.data.refreshToken || "",
            message: result.message,
            loginMethod: "verification-code",
            type: result.data.type,
            roles: result.data.roles,
          };
        } catch (error) {
          throw new Error(
            error instanceof Error ? error.message : "كود التحقق غير صحيح"
          );
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },

  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      if (user) {
        const profileData = await fetchUserProfile(user.token || "");

        return {
          ...token,
          accessToken: user.token,
          refreshToken: user.refreshToken,
          accessTokenExpires: Date.now() + 9 * 60 * 1000,
          loginMethod: user.loginMethod,
          type: user.type,
          roles: user.roles,
          profile: profileData,
        };
      }

      if (
        trigger === "update" &&
        session?.accessToken &&
        session?.refreshToken
      ) {
        const updatedProfile = await fetchUserProfile(session.accessToken);

        return {
          ...token,
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
          accessTokenExpires: Date.now() + 9 * 60 * 1000,
          profile: updatedProfile || token.profile,
        };
      }

      if (Date.now() < (token.accessTokenExpires ?? 0) - 30 * 1000)
        return token;

      const refreshedToken = await refreshAccessToken(token);

      if (refreshedToken.error)
        return { ...token, error: "RefreshAccessTokenError" };

      return refreshedToken;
    },

    session: async ({ session, token }) => {
      if (token.error) {
        session.error = token.error;
        return session;
      }

      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.loginMethod = token.loginMethod;
      session.type = token.type;
      session.roles = token.roles;

      if (token.profile) {
        session.user = {
          ...session.user,
          id: token.profile.id,
          name: token.profile.fullName,
          email: token.profile.email,
          phoneNumber: token.profile.phoneNumber,
          dateOfBirth: token.profile.dateOfBirth,
          identity: token.profile.identity,
          emailConfirmed: token.profile.emailConfirmed,
          phoneNumberConfirmed: token.profile.phoneNumberConfirmed,
          permissions: token.profile.permissions,
          isActive: token.profile.isActive,
          type: token.type,
          roles: token.roles,
        };
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};
