"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  label?: string;
  date?: Date;
  setDate?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function DatePicker({ date, setDate, className }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-3 w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            data-empty={!date}
            className={cn(
              "data-[empty=true]:text-muted-foreground w-full justify-between text-left font-normal border-input flex sm:h-12 h-9",
              className
            )}
          >
            {date ? date.toLocaleDateString("en-CA") : "اختر التاريخ"}{" "}
            <CalendarIcon className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="center">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(selectedDate) => {
              setDate?.(selectedDate);
              setOpen(false);
            }}
            className="w-auto min-w-[300px]"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
