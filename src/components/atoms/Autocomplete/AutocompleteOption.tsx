import { cn } from "@/utils/cn";
import { Checkbox } from "@/components/atoms/Checkbox";
import { AutocompleteOption as Option } from "./Autocomplete.types";

interface Props {
  option: Option;
  selected: boolean;
  highlighted: boolean;
  multiple?: boolean;
  onClick(): void;
}

export default function AutocompleteOption({
  option,
  selected,
  highlighted,
  multiple,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      disabled={option.disabled}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition",
        highlighted && "bg-[var(--primary-soft)]",
        selected &&
          !multiple &&
          "bg-[var(--primary)] text-[var(--primary-contrast)]",
        option.disabled && "cursor-not-allowed opacity-40",
      )}
    >
      {multiple && (
        <Checkbox
          checked={selected}
          readOnly
          tabIndex={-1}
          className="pointer-events-none"
        />
      )}

      {option.icon}

      <span>{option.label}</span>
    </button>
  );
}
