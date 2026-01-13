import Link from "next/link";
import RegisterForm from "./_components/register-form";

export default async function Page() {
  return (
    <div className="flex flex-col w-full items-center px-6 py-10">
      <h1 className="mb-5 text-4xl font-bold text-blue-700"> انشاء حساب</h1>
      <RegisterForm />
      <span className="text-sm text-gray-600">
        لديك حساب بالفعل؟
        <Link
          className="text-blue-700 font-semibold hover:underline"
          href="/auth/login"
        >
          تسجيل الدخول
        </Link>
      </span>
    </div>
  );
}
