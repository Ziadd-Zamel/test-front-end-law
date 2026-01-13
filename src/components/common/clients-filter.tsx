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
import { useClientOrCompany } from "@/hooks/use-client-or-company";

type ClientType = "client" | "company";

type Client = {
  id: number;
  fullName: string;
  phoneNumber: string;
  additionalInformation: string | null;
  email: string;
  city: string;
  dateOfBirth: string;
};

export default function ClientsFilter({
  placeholder = "ابحث عن اسم...",
}: {
  placeholder?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const pathName = usePathname();
  const router = useRouter();
  const [clientId, setClientId] = useQueryState("clientId");

  const [filterType, setFilterType] = React.useState<ClientType>("client");

  const { data, isLoading } = useClientOrCompany(filterType);

  const selectedItem = data?.data?.find(
    (item: Client) => item.id.toString() === clientId
  );

  const handleTypeChange = (value: string) => {
    setFilterType(value as ClientType);
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
                <TabsTrigger value="client">عملاء</TabsTrigger>
                <TabsTrigger value="company">شركات</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "جاري التحميل..." : "لا يوجد نتيجة."}
            </CommandEmpty>
            <CommandGroup>
              {data?.data?.map((item: Client) => (
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
