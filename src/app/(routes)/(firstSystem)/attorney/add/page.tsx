import AddAttorneyForm from "./_components/add-attorney-form";

export default async function AddAttorneyPage() {
  return (
    <div className="flex-center py-10">
      <div className="w-full box-container ">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-700 mb-4">
            إضافة وكالة جديدة
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            قم بملء النموذج أدناه لإضافة وكالة قانونية جديدة إلى النظام. تأكد من
            إدخال رقم الوكالة بشكل صحيح وإرفاق ملف PDF الخاص بالوكالة.
          </p>
        </div>

        {/* Form Component */}
        <AddAttorneyForm />
      </div>
    </div>
  );
}
