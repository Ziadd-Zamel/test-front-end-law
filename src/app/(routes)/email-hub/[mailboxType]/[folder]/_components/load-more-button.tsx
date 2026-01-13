"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface LoadMoreButtonProps {
  skipToken?: string;
}

export default function LoadMoreButton({ skipToken }: LoadMoreButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  // Hide button if no skipToken
  if (!skipToken) {
    return null;
  }

  const handleLoadMore = () => {
    setIsLoading(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set("skipToken", skipToken);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex justify-center py-6 px-4">
      <Button
        onClick={handleLoadMore}
        disabled={isLoading}
        variant="outline"
        className="min-w-[120px]"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 me-2 animate-spin" />
            <span>جاري التحميل...</span>
          </>
        ) : (
          <span>تحميل المزيد</span>
        )}
      </Button>
    </div>
  );
}
