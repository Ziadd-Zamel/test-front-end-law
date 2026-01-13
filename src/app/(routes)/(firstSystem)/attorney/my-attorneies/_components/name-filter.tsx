"use client";
import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";

type Company = {
  id: number;
  fullName: string;
  phoneNumber: string;
  additionalInformation: string | null;
  email: string;
  city: string;
  dateOfBirth: string;
};

type Client = {
  id: number;
  fullName: string;
  phoneNumber: string;
  additionalInformation: string | null;
  email: string;
  city: string;
  dateOfBirth: string;
};

export default function NameFilter({
  placeholder = "ابحث عن اسم...",
  companies,
  clients,
}: {
  placeholder?: string;
  companies: Company[];
  clients: Client[];
}) {
  const [open, setOpen] = React.useState(false);
  const pathName = usePathname();
  const router = useRouter();
  const [clientId, setClientId] = useQueryState("clientId");
  const [filterType, setFilterType] = React.useState<"clients" | "companies">(
    "clients"
  );

  const currentList = filterType === "clients" ? clients : companies;
  const selectedItem = currentList.find(
    (item) => item.id.toString() === clientId
  );

  const handleTypeChange = (value: string) => {
    setFilterType(value as "clients" | "companies");
    setClientId(null);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"trigger"}
          role="combobox"
          aria-expanded={open}
          className="w-full sm:w-[200px] lg:w-[300px] justify-between"
        >
          {selectedItem?.fullName || placeholder}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full sm:w-[200px] lg:w-[300px] p-0">
        <Command>
          <div className="p-2 border-b">
            <Tabs
              value={filterType}
              onValueChange={handleTypeChange}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="clients">عملاء</TabsTrigger>
                <TabsTrigger value="companies">شركات</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>لا يوجد نتيجة.</CommandEmpty>
            <CommandGroup>
              {currentList.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.fullName}
                  onSelect={() => {
                    const newVal =
                      item.id.toString() === clientId
                        ? null
                        : item.id.toString();

                    const newParams = new URLSearchParams(
                      window.location.search
                    );

                    if (newVal) {
                      newParams.set("clientId", newVal);
                    } else {
                      newParams.delete("clientId");
                    }

                    setClientId(newVal);
                    router.push(`${pathName}?${newParams.toString()}`, {
                      scroll: false,
                    });

                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      clientId === item.id.toString()
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {item.fullName}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
