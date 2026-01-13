import VerifyCodeForm from "../_components/otp-login-form";

export default function Page() {
  return (
    <div className="flex flex-col w-full items-center px-6 py-10">
      <h1 className="mb-5 text-4xl font-bold text-blue-700">
        تسجيل الدخول برمز التحقق
      </h1>
      <VerifyCodeForm />
    </div>
  );
}
