import { useEffect, useMemo, useRef, useState } from "react";
import { AutocompleteOption } from "./Autocomplete.types";

export function useAutocomplete(
  options: readonly AutocompleteOption[],
  value?: string,
) {
  const rootRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);

  const [query, setQuery] = useState("");

  const [highlighted, setHighlighted] = useState(0);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    window.addEventListener("mousedown", handler);

    return () => window.removeEventListener("mousedown", handler);
  }, []);

  const filtered = useMemo(() => {
    if (!query) return options;

    return options.filter((o) =>
      o.label.toLowerCase().includes(query.toLowerCase()),
    );
  }, [options, query]);

  const selected = options.find((x) => x.value === value);

  return {
    rootRef,

    open,
    setOpen,

    query,
    setQuery,

    highlighted,
    setHighlighted,

    filtered,

    selected,
  };
}
