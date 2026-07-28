import { ReactNode } from "react";

export interface AutocompleteOption {
  label: string;
  value: string;
  disabled?: boolean;
  icon?: ReactNode;
}

export interface AutocompleteProps {
  options: readonly AutocompleteOption[];

  value?: string;

  onChange?: (value: string) => void;

  placeholder?: string;

  disabled?: boolean;

  loading?: boolean;

  searchable?: boolean;

  clearable?: boolean;

  className?: string;
}
