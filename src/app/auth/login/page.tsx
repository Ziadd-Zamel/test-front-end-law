import Link from "next/link";
import LoginForm from "./_components/login-form";

export default async function Page() {
  return (
    <div className="flex flex-col w-full items-center px-6">
      <h1 className="mb-5 text-4xl font-bold text-blue-700"> مرحباً بعودتك</h1>
      <LoginForm />
      <span className="text-sm text-gray-600 mt-5">
        ليس لديك حساب؟{" "}
        <Link
          className="text-blue-700 font-semibold hover:underline"
          href="/auth/register"
        >
          إنشاء حساب جديد{" "}
        </Link>
      </span>
    </div>
  );
}
