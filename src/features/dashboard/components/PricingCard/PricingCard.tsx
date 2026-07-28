import { Card } from "@/components/atoms/Card";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { Icon } from "../Icon";
import type { PricingOption } from "../../types";
import { cn } from "@/utils/cn";

export interface PricingCardProps {
  options: PricingOption[];
}

/** "Starts From" pricing summary card with a Buy Now CTA. */
export function PricingCard({ options }: PricingCardProps) {
  return (
    <Card className="p-5">
      <Typography variant="h2" className="mb-4 text-base">
        Starts From
      </Typography>

      <div className="mb-5 grid grid-cols-2 gap-3">
        {options.map((option, index) => (
          <div
            key={option.id}
            className={cn(
              "rounded-md border p-3",
              index === 0
                ? "border-primary bg-primary-soft"
                : "border-border bg-background",
            )}
          >
            <Typography variant="caption" as="p" className="mb-1">
              {option.label}
            </Typography>
            <Typography variant="h1" className="text-lg">
              {option.price}
              <span className="text-sm font-semibold text-text-secondary">
                {option.unit}
              </span>
            </Typography>
            <Typography variant="caption">{option.period}</Typography>
          </div>
        ))}
      </div>

      <Button size="sm" fullWidth>
        <Icon name="cart" size={16} />
        Buy Now
      </Button>
    </Card>
  );
}
