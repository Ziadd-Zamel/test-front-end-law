/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo } from "react";
import { MultiSelect } from "@/components/ui/multi-select";
import { useContacts } from "@/hooks/use-contacts";

interface ContactsShareInputProps {
  refId?: string;
  refType?: "case" | "task";
  value: string[];
  onChange: (ids: string[]) => void;
  maxCount?: number;
  disabled?: boolean;
}

export function ContactsShareInput({
  refId,
  refType,
  value,
  onChange,
  maxCount = 6,
  disabled,
}: ContactsShareInputProps) {
  const canFetch = Boolean(refId && refType);

  const { data, isLoading } = useContacts(
    canFetch
      ? { refId: refId!, refType: refType! }
      : { refId: "", refType: "case" },
  );

  const options = useMemo(
    () =>
      data?.data?.contacts?.map((contact: any) => ({
        value: contact.id,
        label: contact.name,
      })) ?? [],
    [data],
  );

  const isDisabled = disabled || isLoading || !canFetch || options.length === 0;

  return (
    <MultiSelect
      options={options}
      value={value}
      defaultValue={value}
      onValueChange={onChange}
      maxCount={maxCount}
      disabled={isDisabled}
      placeholder="اختر جهات الاتصال"
    />
  );
}
