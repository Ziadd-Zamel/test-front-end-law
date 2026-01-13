import Link from "next/link";
import ForgetPasswordForm from "./_components/forget-password-form";

export default function Page() {
  return (
    <div className="flex flex-col w-full items-center px-6 py-10">
      <h1 className="mb-5 text-4xl font-bold text-blue-700">
        نسيت كلمة المرور
      </h1>
      <ForgetPasswordForm />
      <span className="text-sm text-gray-600 mt-5">
        تذكرت كلمة المرور؟
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
