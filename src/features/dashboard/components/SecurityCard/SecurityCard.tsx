import { Card } from "@/components/atoms/Card";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { Icon } from "../Icon";
import type { SecurityInfo } from "../../types";

export interface SecurityCardProps {
  data: SecurityInfo;
}

/** "2-Factor Authentication" prompt card with an illustrated shield. */
export function SecurityCard({ data }: SecurityCardProps) {
  return (
    <Card className="grid grid-cols-1 gap-6 p-5 sm:grid-cols-[1fr_auto]">
      <div className="flex flex-col">
        <div className="mb-3 flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary-soft text-primary">
            <Icon name={data.icon} size={16} />
          </span>
          <Typography variant="h2" className="text-base">
            {data.title}
          </Typography>
        </div>

        <Typography variant="bodySmall" as="p" className="mb-4">
          {data.description}
        </Typography>

        <ul className="mb-5 flex-1 space-y-2">
          {data.items.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
              <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-success-soft text-success">
                <Icon name="check" size={10} />
              </span>
              {item}
            </li>
          ))}
        </ul>

        <Button size="sm">
          {data.ctaLabel}
          <Icon name="arrowRight" size={14} />
        </Button>
      </div>

      <div className="hidden items-center justify-center sm:flex">
        <span className="inline-flex h-28 w-28 items-center justify-center rounded-full bg-primary-soft text-primary">
          <Icon name="shield" size={56} strokeWidth={1.2} />
        </span>
      </div>
    </Card>
  );
}
