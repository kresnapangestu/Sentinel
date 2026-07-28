import { HTMLAttributes } from "react";
import Image from "next/image";
import { cn } from "@/utils/cn";

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  src?: string;
  alt: string;
  size?: number;
}

/** Circular avatar atom. Falls back to initials when no image is given. */
export function Avatar({ src, alt, size = 40, className, ...rest }: AvatarProps) {
  const initials = alt
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-background text-sm font-semibold text-text-secondary",
        className,
      )}
      style={{ width: size, height: size }}
      {...rest}
    >
      {src ? (
        <Image src={src} alt={alt} fill sizes={`${size}px`} className="object-cover" />
      ) : (
        initials
      )}
    </span>
  );
}
