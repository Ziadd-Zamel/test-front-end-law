import VerifywhatsappForm from "./_components/verify-whatsapp-form";

export default function Page() {
  return (
    <div className="flex flex-col w-full items-center px-6 py-10">
      <h1 className="mb-5 text-4xl font-bold text-blue-700">
        تأكيد رقم واتساب
      </h1>
      <VerifywhatsappForm />
    </div>
  );
}
