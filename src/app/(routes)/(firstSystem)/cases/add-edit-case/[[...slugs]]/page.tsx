import { PageErrorState } from "@/components/common/page-states";
import AddCaseForm from "./_components/add-case-form";

import { GetCaseById } from "@/lib/api/cases";
import { getSettlementById } from "@/lib/api/Settlement.api";

import catchError from "@/lib/utils/catch-error";

export default async function Page({
  params,
  searchParams,
}: {
  params: { slugs?: string[] };
  searchParams: { from?: string };
}) {
  // ==================== PARAMS ====================
  const id = params.slugs?.[0];
  const isFromSettlement = searchParams.from === "settlement";

  // ==================== STATE ====================
  let Case = null;
  let Settlement = null;
  let fetchError = null;

  // ==================== FETCH LOGIC ====================

  // ✅ Create case FROM settlement (NOT edit)
  if (id && isFromSettlement) {
    const [payload, err] = await catchError(() => getSettlementById(id));

    Settlement = payload?.data || null;
    fetchError = err;
  }

  // ✅ Normal edit case
  if (id && !isFromSettlement) {
    const [payload, err] = await catchError(() => GetCaseById(id));

    Case = payload?.data || null;
    fetchError = err;
  }

  // ==================== MODE ====================
  const isEdit = Boolean(id && !isFromSettlement);

  // ==================== ERROR HANDLING ====================
  if (fetchError) {
    return <PageErrorState />;
  }

  // ==================== RENDER ====================
  return (
    <section className="w-full box-container mb-20">
      <div className="text-center mt-20 mb-5">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">
          {isEdit ? "تعديل القضية" : "إضافة قضية جديدة"}
        </h1>

        <p className="text-gray-600">
          {isEdit
            ? "قم بتعديل بيانات هذه القضية وتحديث الموظفين المسؤولين عنها"
            : "قم بإدخال تفاصيل القضية الجديدة وتعيين الموظفين المسؤولين عن متابعتها"}
        </p>
      </div>

      <AddCaseForm Case={Case} settlement={Settlement} />
    </section>
  );
}
