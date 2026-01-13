"use client";

import { Button } from "@/components/ui/button";
import { useGenerateFile } from "@/hooks/mutation/use-generate-file";
import { Download } from "lucide-react";

export function FileGeneratorButton({ path }: { path: string }) {
  const { generateFile, isPending } = useGenerateFile();

  const handleGenerate = () => {
    generateFile(path);
  };

  return (
    <Button
      onClick={handleGenerate}
      disabled={isPending}
      loading={isPending}
      variant="default"
      size="default"
      className="gap-2"
    >
      {!isPending && <Download size={18} />}
      {isPending ? "جاري التحميل..." : "تحميل الملف"}
    </Button>
  );
}
