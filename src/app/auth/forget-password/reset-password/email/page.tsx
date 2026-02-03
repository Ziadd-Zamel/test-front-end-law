import Link from "next/link";
import ResetEmailPasswordForm from "../_components/reset-email-form";

export default async function Page() {
  return (
    <div className="flex flex-col w-full items-center px-6 py-10">
      <h1 className="mb-5 text-4xl font-bold text-blue-700">
        إعادة تعيين كلمة المرور
      </h1>
      <p className="mb-6 text-sm text-gray-600 text-center max-w-md">
        أدخل كلمة المرور الجديدة لإعادة تعيين حسابك
      </p>
      <ResetEmailPasswordForm />
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
