import Link from "next/link";
import SendVerificationCodeForm from "./_components/send-verification-code-form";

export default async function Page() {
  return (
    <div className="flex flex-col w-full items-center px-6 py-10">
      <h1 className="mb-5 text-4xl font-bold text-blue-700">
        إرسال رمز التحقق
      </h1>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        أدخل رقم الهوية الوطنية لإرسال رمز التحقق الذي يمكنك استخدامه لتسجيل
        الدخول
      </p>
      <SendVerificationCodeForm />
      <span className="text-sm text-gray-600 mt-5">
        لديك بيانات تسجيل الدخول؟
        <Link
          className="text-blue-700 font-semibold hover:underline mr-1"
          href="/auth/login"
        >
          تسجيل الدخول بكلمة المرور
        </Link>
      </span>
    </div>
  );
}
