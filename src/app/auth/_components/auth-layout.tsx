import Image from "next/image";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <section className="grid lg:grid-cols-2 h-screen">
      <div dir="ltr" className="overflow-y-auto">
        <div
          dir="rtl"
          className="w-full flex flex-1 items-center justify-center min-h-screen"
        >
          {children}
        </div>
      </div>
      <div className="bg-blue-600 relative hidden lg:block h-screen">
        <Image
          src="/assets/login.svg"
          alt="Image"
          width={500}
          height={500}
          className="absolute left-1/2 bottom-0 transform -translate-1/2 "
        />
      </div>
    </section>
  );
}
