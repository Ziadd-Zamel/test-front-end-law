import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    refreshToken?: string;
    error?: string;
    loginMethod?: "credentials" | "verification-code";
    type?: string;
    roles?: string[];

    user: {
      id?: number;
      phoneNumber?: string;
      dateOfBirth?: string;
      identity?: string;
      permissions?: { id: number; name: string }[];
      emailConfirmed?: boolean;
      phoneNumberConfirmed?: boolean;
      isActive?: boolean;
      type?: string;
      roles?: string[];
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    token?: string;
    refreshToken?: string;
    message?: string;
    loginMethod?: "credentials" | "verification-code";
    type?: string;
    roles?: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
    loginMethod?: "credentials" | "verification-code";
    type?: string;
    roles?: string[];
    profile?: UserData;
  }
}

export interface ExtendedUser extends DefaultUser {
  token?: string;
  refreshToken?: string;
  message?: string;
  loginMethod?: "credentials" | "verification-code";
  type?: string;
  roles?: string[];
}
