import { ReactNode } from "react";
import AuthLayout from "./_components/auth-layout";

export default function Layout({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
