"use client";

import { RefreshCw } from "lucide-react";
import Autocomplete from "@/components/atoms/Autocomplete";
import { Label } from "@/components/atoms/Label";
import { DateRangePicker } from "@/components/molecules/DateRangePicker";
import { KPI_OPTIONS, type KPIKey } from "@/features/dashboard/types";
import { formatWibClock, todayInWib } from "@/lib/wib";
import { cn } from "@/utils/cn";
import type { Contamination } from "../../types";

/** Preset contamination options; "auto" is the Liu et al. (2008) offset. */
const CONTAMINATION_OPTIONS: { value: "auto" | number; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: 0.01, label: "1%" },
  { value: 0.05, label: "5%" },
  { value: 0.1, label: "10%" },
];

export interface KpiFiltersProps {
  /** Rendered WIB day (`YYYY-MM-DD`); resolved by the gateway when unset. */
  date: string;
  onDateChange: (value: string) => void;
  selectedKpis: KPIKey[];
  onSelectedKpisChange: (value: KPIKey[]) => void;
  /** null = ML service default (3.0). */
  zscoreThreshold: number | null;
  onZscoreThresholdChange: (value: number | null) => void;
  /** null = ML service default ("auto"). */
  contamination: Contamination | null;
  onContaminationChange: (value: Contamination | null) => void;
  isRefreshing: boolean;
  lastUpdatedAt: string | null;
  onRefresh: () => void;
  refreshIntervalMinutes: number;
}

/**
 * Dashboard filter bar. Filters are the single source of the dashboard state
 * and survive every auto-refresh -- polling never resets them.
 */
export function KpiFilters({
  date,
  onDateChange,
  selectedKpis,
  onSelectedKpisChange,
  zscoreThreshold,
  onZscoreThresholdChange,
  contamination,
  onContaminationChange,
  isRefreshing,
  lastUpdatedAt,
  onRefresh,
  refreshIntervalMinutes,
}: KpiFiltersProps) {
  const today = todayInWib();

  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-wrap items-end gap-4">
        {/* DateRangePicker renders its own <Label>; adding one here duplicates it. */}
        <div className="flex flex-col gap-1">
          <DateRangePicker mode="single" value={date} onChange={onDateChange} />
          <span className="text-xs text-text-secondary">
            {date !== today ? (
              <button
                type="button"
                onClick={() => onDateChange(today)}
                className="rounded-sm text-primary transition duration-DEFAULT hover:underline"
              >
                Jump to today
              </button>
            ) : (
              "Current WIB day"
            )}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <Label>KPIs</Label>
          <Autocomplete
            multiple
            options={KPI_OPTIONS}
            value={selectedKpis}
            onChange={(value) => onSelectedKpisChange(value as KPIKey[])}
            placeholder="Select KPIs"
            className="w-64"
          />
          <span className="text-xs text-text-secondary">
            Select 2 or more to enable Isolation Forest (multivariate)
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <Label>Z-Score threshold</Label>
          <input
            type="number"
            min={0.1}
            step={0.1}
            placeholder="3.0 (default)"
            value={zscoreThreshold ?? ""}
            onChange={(event) => {
              const raw = event.target.value;
              onZscoreThresholdChange(raw === "" ? null : Number(raw));
            }}
            className="h-9 w-32 rounded-sm border border-border bg-transparent px-2.5 text-sm text-text outline-none transition duration-DEFAULT placeholder:text-text-secondary focus:border-border-hover"
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label>Contamination</Label>
          <select
            value={contamination ?? ""}
            onChange={(event) => {
              const raw = event.target.value;
              onContaminationChange(raw === "" ? null : raw === "auto" ? "auto" : Number(raw));
            }}
            className="h-9 w-32 rounded-sm border border-border bg-transparent px-2.5 text-sm text-text outline-none transition duration-DEFAULT focus:border-border-hover"
          >
            <option value="">Default</option>
            {CONTAMINATION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="text-right text-xs text-text-secondary">
          <p className="m-0">Auto-refresh every {refreshIntervalMinutes} min</p>
          <p className="m-0 tabular-nums">
            {lastUpdatedAt
              ? `Updated ${formatWibClock(lastUpdatedAt)}`
              : "Waiting for data…"}
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          aria-label="Refresh now"
          className={cn(
            "inline-flex h-9 w-9 items-center justify-center rounded-sm border border-border text-text-secondary transition duration-DEFAULT",
            "hover:border-border-hover hover:text-text disabled:cursor-not-allowed disabled:opacity-60",
          )}
        >
          <RefreshCw
            size={15}
            className={cn(isRefreshing && "motion-safe:animate-spin")}
          />
        </button>
      </div>
    </div>
  );
}
