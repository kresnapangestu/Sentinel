"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { Badge } from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";
import type { DateRangePickerProps } from "./DateRangePicker.types";

/**
 * Native `<input type="date">`-based date picker supporting single,
 * range, and multiple selection. No calendar UI is built from scratch --
 * the platform date input already handles picking, validation, and
 * keyboard/mobile support; multiple mode adds picked dates to a list.
 */
export function DateRangePicker(props: DateRangePickerProps) {
  const [draft, setDraft] = useState("");
  const { className, disabled } = props;

  if (props.mode === "single") {
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        <Label htmlFor="date-single">Date</Label>
        <Input
          id="date-single"
          type="date"
          disabled={disabled}
          value={props.value ?? ""}
          onChange={(e) => props.onChange(e.target.value)}
        />
      </div>
    );
  }

  if (props.mode === "range") {
    const range = props.value ?? { from: "", to: "" };

    return (
      <div className={cn("flex flex-wrap items-end gap-3", className)}>
        <div className="flex flex-col gap-1">
          <Label htmlFor="date-from">From</Label>
          <Input
            id="date-from"
            type="date"
            disabled={disabled}
            value={range.from}
            max={range.to || undefined}
            onChange={(e) =>
              props.onChange({ ...range, from: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="date-to">To</Label>
          <Input
            id="date-to"
            type="date"
            disabled={disabled}
            value={range.to}
            min={range.from || undefined}
            onChange={(e) => props.onChange({ ...range, to: e.target.value })}
          />
        </div>
      </div>
    );
  }

  const dates = props.value ?? [];
  const onMultipleChange = props.onChange;

  function addDate(date: string) {
    if (!date || dates.includes(date)) return;
    onMultipleChange([...dates, date].sort());
    setDraft("");
  }

  function removeDate(date: string) {
    onMultipleChange(dates.filter((d) => d !== date));
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor="date-multiple">Dates</Label>
      <Input
        id="date-multiple"
        type="date"
        disabled={disabled}
        value={draft}
        onChange={(e) => addDate(e.target.value)}
      />
      {dates.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {dates.map((date) => (
            <Badge key={date} tone="primary" className="gap-1">
              {date}
              <button
                type="button"
                aria-label={`Remove ${date}`}
                onClick={() => removeDate(date)}
                className="inline-flex rounded-pill p-0.5 hover:bg-black/10"
              >
                <X size={12} />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
