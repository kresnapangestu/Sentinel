import { useEffect } from "react";
import { cn } from "@/utils/cn";
import AutocompleteOption from "./AutocompleteOption";
import {
  AutocompleteOption as Option,
  AutocompleteProps,
} from "./Autocomplete.types";
import { useAutocomplete } from "./useAutocomplete";
import { ChevronDown } from "lucide-react";

export default function Autocomplete(props: AutocompleteProps) {
  const {
    options,
    value,
    onChange,
    placeholder = "Select...",
    clearable = true,
    searchable = true,
    disabled,
    loading,
    className,
  } = props;
  const multiple = props.multiple ?? false;
  const {
    rootRef,

    open,
    setOpen,

    query,
    setQuery,

    filtered,

    highlighted,
    setHighlighted,

    selectedOptions,
  } = useAutocomplete(options, value);

  useEffect(() => {
    setHighlighted(0);
  }, [query, setHighlighted]);

  function isSelected(optionValue: string) {
    return selectedOptions.some((o) => o.value === optionValue);
  }

  function choose(option: Option) {
    if (multiple) {
      const next = isSelected(option.value)
        ? selectedOptions
            .filter((o) => o.value !== option.value)
            .map((o) => o.value)
        : [...selectedOptions.map((o) => o.value), option.value];

      (onChange as ((value: string[]) => void) | undefined)?.(next);
      return;
    }

    (onChange as ((value: string) => void) | undefined)?.(option.value);

    setQuery("");

    setOpen(false);
  }

  function clear(e: React.MouseEvent) {
    e.stopPropagation();

    if (multiple) {
      (onChange as ((value: string[]) => void) | undefined)?.([]);
    } else {
      (onChange as ((value: string) => void) | undefined)?.("");
    }
  }

  const displayLabel = multiple
    ? selectedOptions.length
      ? `${selectedOptions.length} selected`
      : ""
    : (selectedOptions[0]?.label ?? "");

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <div
        onClick={() => !disabled && setOpen(true)}
        className={cn(
          "flex h-11 cursor-pointer items-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 transition",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        {searchable ? (
          <input
            value={open ? query : displayLabel}
            onChange={(e) => {
              setQuery(e.target.value);

              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (!filtered.length) return;

              if (e.key === "ArrowDown") {
                e.preventDefault();

                setHighlighted((p) => Math.min(filtered.length - 1, p + 1));
              }

              if (e.key === "ArrowUp") {
                e.preventDefault();

                setHighlighted((p) => Math.max(0, p - 1));
              }

              if (e.key === "Enter") {
                e.preventDefault();

                choose(filtered[highlighted]);
              }

              if (e.key === "Escape") {
                setOpen(false);
              }
            }}
            className="flex-1 bg-transparent outline-none"
            placeholder={placeholder}
          />
        ) : (
          <span className="flex-1 outline-none">
            {displayLabel || placeholder}
          </span>
        )}

        {clearable && selectedOptions.length > 0 && (
          <button
            onClick={clear}
            className="mr-2 text-sm opacity-60 hover:opacity-100"
          >
            ×
          </button>
        )}

        <span className={cn("transition", open && "rotate-180")}>
          <ChevronDown size={18} />
        </span>
      </div>

      {open && (
        <div className="absolute z-50 mt-2 max-h-72 w-full overflow-auto rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-md)]">
          {loading && (
            <div className="p-3 text-sm text-[var(--text-secondary)]">
              Loading...
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="p-3 text-sm text-[var(--text-secondary)]">
              No results found
            </div>
          )}

          {!loading &&
            filtered.map((option, index) => (
              <AutocompleteOption
                key={option.value}
                option={option}
                selected={isSelected(option.value)}
                highlighted={highlighted === index}
                multiple={multiple}
                onClick={() => choose(option)}
              />
            ))}
        </div>
      )}
    </div>
  );
}
