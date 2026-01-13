/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link2, AlertTriangle } from "lucide-react";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Alert, AlertDescription } from "@/components/ui/alert";

import { useUpdateMessage } from "@/app/(routes)/email-hub/_hooks/use-mail";
import { useTaskOrCase } from "@/hooks/use-task-or-case";

export default function UpdateMessageDialog({
  messageId,
}: {
  messageId: string;
}) {
  const { updateMessage, isPending } = useUpdateMessage();
  const [refType, setRefType] = useState<"task" | "case" | undefined>(
    undefined
  );
  const [refId, setRefId] = useState<string>("");

  const { data: refData, isPending: refPending } = useTaskOrCase(refType);

  const selectedItem = refData?.data?.find(
    (item: any) => item.encryptedId === refId
  );

  function handleSubmit() {
    if (!refType || !refId) return;

    console.log({
      messageId,
      refType,
      refId,
    });
    updateMessage({
      messageId,
      refType,
      refId,
    });
  }

  return (
    <Dialog>
      {/* TRIGGER BUTTON */}
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Link2 className="h-4 w-4 ml-2" />
          ربط المرجع
        </Button>
      </DialogTrigger>

      {/* CONTENT */}
      <DialogContent className="sm:max-w-lg overflow-y-auto max-h-[90vh] hide-scrollbar min-h-[60vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center text-gray-800">
            ربط البريد بمرجع
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* REF TYPE */}
          <div>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              نوع المرجع
            </label>
            <Select
              onValueChange={(value) => {
                setRefType(value as "task" | "case");
                setRefId(""); // Reset refId when refType changes
              }}
              value={refType}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="اختر المرجع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="task">مهمة</SelectItem>
                <SelectItem value="case">قضية</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* REF ID */}
          <div>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              المعرف المرجعي
            </label>
            <Select
              onValueChange={setRefId}
              value={refId}
              disabled={!refType || refPending}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="اختر المعرف" />
              </SelectTrigger>
              <SelectContent>
                {refData?.data?.map((item: any) => (
                  <SelectItem key={item.encryptedId} value={item.encryptedId}>
                    {refType === "task" ? item.nameOfWork : item.caseTitle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* SELECTED ITEM DETAILS */}
          {selectedItem && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-800">
                تفاصيل {refType === "task" ? "المهمة" : "القضية"}:
              </h3>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">
                    {refType === "task" ? "اسم المهمة:" : "عنوان القضية:"}
                  </span>
                  <p className="text-gray-600 mt-1">
                    {refType === "task"
                      ? selectedItem.nameOfWork
                      : selectedItem.caseTitle}
                  </p>
                </div>

                <div>
                  <span className="font-medium text-gray-700">اسم العميل:</span>
                  <p className="text-gray-600 mt-1">{selectedItem.fullName}</p>
                </div>

                {selectedItem.attachments &&
                  selectedItem.attachments.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-700">
                        المرفقات ({selectedItem.attachments.length}):
                      </span>
                      <ul className="list-disc list-inside text-gray-600 mt-1">
                        {selectedItem.attachments
                          .slice(0, 3)
                          .map((att: any, idx: number) => (
                            <li key={idx} className="truncate">
                              {att.fileName}
                            </li>
                          ))}
                        {selectedItem.attachments.length > 3 && (
                          <li className="text-gray-500">
                            و {selectedItem.attachments.length - 3} مرفقات
                            أخرى...
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                {refType === "case" && selectedItem.sessions && (
                  <div>
                    <span className="font-medium text-gray-700">
                      عدد الجلسات:
                    </span>
                    <p className="text-gray-600 mt-1">
                      {selectedItem.sessions.length}
                    </p>
                  </div>
                )}
              </div>

              {/* WARNING ALERT */}
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-red-800">
                  تحذير: هذا الإجراء لا يمكن التراجع عنه. سيتم ربط البريد بشكل
                  دائم مع هذا المرجع.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* SUBMIT BUTTON - Only show when item is selected */}
          {selectedItem && (
            <Button
              onClick={handleSubmit}
              className="w-full h-12"
              disabled={isPending}
            >
              {isPending ? "جاري الحفظ..." : "تأكيد وحفظ المرجع"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
