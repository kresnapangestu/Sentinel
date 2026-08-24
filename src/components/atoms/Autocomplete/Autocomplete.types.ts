import { ReactNode } from "react";

export interface AutocompleteOption {
  label: string;
  value: string;
  disabled?: boolean;
  icon?: ReactNode;
}

interface AutocompleteBaseProps {
  options: readonly AutocompleteOption[];

  placeholder?: string;

  disabled?: boolean;

  loading?: boolean;

  searchable?: boolean;

  clearable?: boolean;

  className?: string;
}

export interface AutocompleteSingleProps extends AutocompleteBaseProps {
  multiple?: false;
  value?: string;
  onChange?: (value: string) => void;
}

export interface AutocompleteMultipleProps extends AutocompleteBaseProps {
  multiple: true;
  value?: string[];
  onChange?: (value: string[]) => void;
}

export type AutocompleteProps =
  | AutocompleteSingleProps
  | AutocompleteMultipleProps;
