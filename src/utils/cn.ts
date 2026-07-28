type ClassValue = string | number | null | boolean | undefined | ClassValue[];

/**
 * Minimal className combiner (no external dependency). Falsy values are
 * dropped; arrays are flattened. Components are structured so conflicting
 * Tailwind utilities (e.g. two different `h-*`) are never passed together,
 * so a dedupe/merge library like tailwind-merge isn't required.
 */
export function cn(...inputs: ClassValue[]): string {
  const flatten = (values: ClassValue[]): string[] =>
    values.flatMap((value) => {
      if (!value) return [];
      if (Array.isArray(value)) return flatten(value);
      return [String(value)];
    });

  return flatten(inputs).join(" ");
}
