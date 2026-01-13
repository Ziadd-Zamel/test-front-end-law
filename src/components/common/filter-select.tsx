"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type FilterSelectProps = {
  filterItems: {
    label: string;
    value: string;
  }[];
  filterName: string;
  placeholder: string;
};

export default function FilterSelect({
  filterItems,
  filterName,
  placeholder,
}: FilterSelectProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const applyFilter = (value: string) => {
    if (value === "all") {
      router.push(pathname, { scroll: false });
      return;
    }

    router.push(`${pathname}?${filterName}=${value}`, {
      scroll: false,
    });
  };
  // Keep the Select in sync with current URL query on refresh/navigation
  const currentValue = searchParams.get(filterName) || "all";

  return (
    <Select value={currentValue} onValueChange={applyFilter}>
      <SelectTrigger className="w-fit gap-2 border border-[#8492A6] bg-white h-9!">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="border-[#8492A6]/50">
        <SelectItem value="all" className="py-2">
          الكل
        </SelectItem>
        {filterItems.map((item, i) => (
          <SelectItem key={i} value={item.value} className="py-2">
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
