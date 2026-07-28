import { Card } from "@/components/atoms/Card";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { Icon } from "../Icon";
import type { ChecklistSection } from "../../types";

export interface PackageInfoCardProps {
  data: ChecklistSection;
}

/** Two-column feature checklist with a CTA -- used for "Package Information". */
export function PackageInfoCard({ data }: PackageInfoCardProps) {
  return (
    <Card className="flex h-full flex-col p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary-soft text-primary">
          <Icon name={data.icon} size={16} />
        </span>
        <Typography variant="h2" className="text-base">
          {data.title}
        </Typography>
      </div>

      <div className="mb-5 grid flex-1 grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
        {data.items.map((column, columnIndex) => (
          <ul key={columnIndex} className="space-y-2">
            {column.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-success-soft text-success">
                  <Icon name="check" size={10} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        ))}
      </div>

      <Button size="sm">
        {data.ctaLabel}
        <Icon name="arrowRight" size={14} />
      </Button>
    </Card>
  );
}
