import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginResponse } from "./lib/types/api";
import { cookies } from "next/headers";

// Fetch user profile using access token
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
  } catch {
    return null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
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
        if (!credentials?.identity || !credentials?.password) {
          throw new Error("Identity and password are required.");
        }

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

          if (!response.ok) {
            throw new Error(result.message || `HTTP error! ${response.status}`);
          }

          if (result.data.verify) {
            throw new Error(
              `VERIFICATION_REQUIRED|||${result.data.token}|||${result.message}`,
            );
          }

          const cookiesStore = await cookies();
          const expiresAt = Date.now() + 2 * 60 * 1000;
          const expiresAtServer = Date.now() + 9 * 60 * 1000;

          cookiesStore.set("token-expires-at", expiresAt.toString(), {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 5 * 60,
          });
          cookiesStore.set("token-expires-at-server", expiresAt.toString(), {
            expires: new Date(expiresAtServer),
            path: "/",
            sameSite: "lax",
          });
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
              : "رقم الهوية الوطنية او كلمة المرور غير صحيحة",
          );
        }
      },
    }),

    Credentials({
      id: "verification-code",
      name: "Verification Code Login",
      credentials: {
        code: { label: "Verification Code", type: "text" },
        visitorId: { label: "visitorId", type: "visitorId" },
        token: { label: "Verification Token", type: "hidden" },
      },
      authorize: async (credentials) => {
        if (!credentials?.code || !credentials?.token) {
          throw new Error("Token is required.");
        }

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

          if (!response.ok) {
            throw new Error(
              result.message || `HTTP error! status: ${response.status}`,
            );
          }

          const cookiesStore = await cookies();
          const expiresAt = Date.now() + 2 * 60 * 1000;
          const expiresAtServer = Date.now() + 9 * 60 * 1000;

          cookiesStore.set("token-expires-at", expiresAt.toString(), {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 5 * 60,
          });
          cookiesStore.set("token-expires-at-server", expiresAt.toString(), {
            expires: new Date(expiresAtServer),
            path: "/",
            sameSite: "lax",
          });
          return {
            id: result.data.token,
            token: result.data.token,
            refreshToken: result.data.refreshToken || "",
            message: result.message || "Verification successful",
            loginMethod: "verification-code",
            type: result.data.type,
            roles: result.data.roles,
          };
        } catch (error) {
          throw new Error(
            error instanceof Error ? error.message : "كود التحقق غير صحيح",
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
      const now = Date.now();

      // First login
      if (user) {
        const profileData = await fetchUserProfile(user.token || "");

        return {
          ...token,
          accessToken: user.token,
          refreshToken: user.refreshToken,
          loginMethod: user.loginMethod,
          accessTokenExpires: now + 10 * 60 * 1000,
          type: user.type,
          roles: user.roles,
          profile: profileData,
        };
      }

      // Manual session update
      if (trigger === "update" && session?.accessToken) {
        const updatedProfile = await fetchUserProfile(session.accessToken);
        return {
          ...token,
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
          accessTokenExpires: now + 10 * 60 * 1000,
          profile: updatedProfile || token.profile,
        };
      }

      // ✅ CHECK SERVER TOKEN EXPIRY - Auto refresh if expired
      const cookiesStore = await cookies();
      const serverExpiresAt = cookiesStore.get(
        "token-expires-at-server",
      )?.value;

      if (serverExpiresAt) {
        const expiresAt = parseInt(serverExpiresAt, 10);
        const timeLeft = expiresAt - now;

        // If server token expired, refresh it
        if (timeLeft <= 0) {
          console.log("Server token expired, refreshing in JWT callback...");

          try {
            const response = await fetch(
              `${process.env.API}/Resend-Access-Toekn`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  refreshToken: token.refreshToken,
                }),
              },
            );

            const result = await response.json();

            if (response.ok && result.success) {
              const newAccessToken = result.data.accessToken;
              const newRefreshToken = result.data.refreshToken;

              // Update cookies with new expiry times
              const newExpiresAt = now + 2 * 60 * 1000; // 2 minutes
              const newExpiresAtServer = now + 9 * 60 * 1000; // 9 minutes

              cookiesStore.set("token-expires-at", newExpiresAt.toString(), {
                httpOnly: false,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 5 * 60,
              });

              cookiesStore.set(
                "token-expires-at-server",
                newExpiresAtServer.toString(),
                {
                  httpOnly: false,
                  secure: process.env.NODE_ENV === "production",
                  sameSite: "lax",
                  path: "/",
                  maxAge: 10 * 60,
                },
              );

              // Fetch updated profile
              const updatedProfile = await fetchUserProfile(newAccessToken);

              console.log("Server token refreshed successfully");

              return {
                ...token,
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                accessTokenExpires: now + 10 * 60 * 1000,
                profile: updatedProfile || token.profile,
              };
            } else {
              console.error("Server token refresh failed");
              return {
                ...token,
                error: "RefreshAccessTokenError",
              };
            }
          } catch (error) {
            console.error("Error refreshing server token:", error);
            return {
              ...token,
              error: "RefreshAccessTokenError",
            };
          }
        }
      }

      return token;
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
