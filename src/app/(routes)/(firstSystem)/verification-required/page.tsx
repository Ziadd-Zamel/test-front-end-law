import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import VerificationRequired from "./_components/verification-required";

export default async function VerificationRequiredPage() {
  const session = await getServerSession(authOptions);
  const profile = session?.user;
  const emailConfirmed = profile?.emailConfirmed ?? false;
  const phoneNumberConfirmed = profile?.phoneNumberConfirmed ?? false;

  return (
    <VerificationRequired
      emailConfirmed={emailConfirmed}
      phoneNumberConfirmed={phoneNumberConfirmed}
    />
  );
}
