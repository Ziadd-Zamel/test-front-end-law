import { PageErrorState } from "@/components/common/page-states";
import AddSettlementRequestForm from "./_components/add-settlement-request-form";
import {
  getSettlementById,
  getSettlementCategories,
} from "@/lib/api/Settlement.api";
import catchError from "@/lib/utils/catch-error";

export default async function Page({
  params,
}: {
  params: { slugs?: string[] };
}) {
  // Params
  const settlementId = params.slugs?.[0];
  const isEdit = Boolean(settlementId);

  //Fetch Categories
  const [categoriesPayload, categoriesError] = await catchError(() =>
    getSettlementCategories({
      pageNumber: 1,
      pageSize: 1000,
      onlyActive: true,
    })
  );

  if (!categoriesPayload || categoriesError) {
    return <PageErrorState />;
  }

  // Fetch Settlement
  let settlementPayload = null;

  if (isEdit) {
    const [payload, error] = await catchError(() =>
      getSettlementById(settlementId!)
    );

    if (!payload || error) {
      return <PageErrorState />;
    }

    settlementPayload = payload;
  }

  return (
    <section className="w-full box-container mb-20">
      <div className="text-center mt-20 mb-5">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">
          {isEdit ? "تعديل طلب الصلح" : "إضافة طلب صلح جديد"}
        </h1>

        <p className="text-gray-600">
          {isEdit
            ? "قم بتعديل بيانات طلب الصلح"
            : "قم بإدخال تفاصيل طلب الصلح الجديد وبيانات الأطراف"}
        </p>
      </div>

      <AddSettlementRequestForm
        categories={categoriesPayload.data}
        settlementRequest={settlementPayload?.data}
      />
    </section>
  );
}
