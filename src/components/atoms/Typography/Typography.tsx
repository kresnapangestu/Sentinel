import { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

export type TypographyVariant =
  | "display"
  | "h1"
  | "h2"
  | "body"
  | "bodySmall"
  | "caption";

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  as?: ElementType;
  children: ReactNode;
}

const defaultElement: Record<TypographyVariant, ElementType> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  body: "p",
  bodySmall: "p",
  caption: "span",
};

const variantStyles: Record<TypographyVariant, string> = {
  display: "m-0 text-3xl font-bold leading-tight tracking-tight text-text-inverse",
  h1: "m-0 text-2xl font-bold leading-snug text-text",
  h2: "m-0 text-xl font-semibold text-text",
  body: "m-0 text-md leading-relaxed text-text",
  bodySmall: "m-0 text-sm leading-relaxed text-text-secondary",
  caption: "text-xs text-text-secondary",
};

/** Typography atom centralizing the type scale so styles never drift. */
export function Typography({
  variant = "body",
  as,
  className,
  children,
  ...rest
}: TypographyProps) {
  const Component = as ?? defaultElement[variant];

  return (
    <Component className={cn(variantStyles[variant], className)} {...rest}>
      {children}
    </Component>
  );
}
