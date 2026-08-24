export interface DateRange {
  from: string;
  to: string;
}

interface DateRangePickerBaseProps {
  className?: string;
  disabled?: boolean;
}

export interface SingleDateProps extends DateRangePickerBaseProps {
  mode: "single";
  value?: string;
  onChange: (value: string) => void;
}

export interface RangeDateProps extends DateRangePickerBaseProps {
  mode: "range";
  value?: DateRange;
  onChange: (value: DateRange) => void;
}

export interface MultipleDateProps extends DateRangePickerBaseProps {
  mode: "multiple";
  value?: string[];
  onChange: (value: string[]) => void;
}

export type DateRangePickerProps =
  | SingleDateProps
  | RangeDateProps
  | MultipleDateProps;
