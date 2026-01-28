import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { CustomTooltip } from "./custom-tooltip";
export default function AttachmentDetailsDialog({
  file,
}: {
  file: MainAttachment;
}) {
  return (
    <Dialog>
      <CustomTooltip content="عرض التفاصيل">
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-2  text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </DialogTrigger>
      </CustomTooltip>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="mt-8">
          <DialogTitle className="text-right">تفاصيل المرفق</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-right">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">اسم الملف:</h3>
            <p className="text-gray-900 bg-gray-50 p-3 rounded-md break-words">
              {file.originalName}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">الوصف:</h3>
            <p className="text-gray-900 bg-gray-50 p-3 rounded-md whitespace-pre-wrap break-words min-h-[100px]">
              {file.description}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
