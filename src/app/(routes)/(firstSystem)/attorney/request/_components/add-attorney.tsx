/* eslint-disable @typescript-eslint/no-unused-vars */
import { getAttorneyCategories } from "@/lib/api/attorney.api";
import catchError from "@/lib/utils/catch-error";
import AddForm from "./add-form";

export default async function AddAttorney() {
  const [data, error] = await catchError(() => getAttorneyCategories());

  if (!data) {
    return;
  }
  return (
    <div className="flex-center py-10">
      <div className="w-full box-container !max-w-5xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-700 mb-4">
            طلب وكالة جديد
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            قم بملء النموذج أدناه لإنشاء طلب وكالة. تأكد من اختيار نوع العميل
            المناسب وتحديد الصفة وبنود الوكالة المطلوبة بدقة لضمان معالجة
            الطلب بشكل صحيح.
          </p>
        </div>

        {/* Form Component */}
        <AddForm data={data?.data} />
      </div>
    </div>
  );
}
