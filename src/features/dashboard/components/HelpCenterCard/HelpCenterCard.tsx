import { Card } from "@/components/atoms/Card";
import { Typography } from "@/components/atoms/Typography";
import { Icon } from "../Icon";
import type { HelpLink } from "../../types";

export interface HelpCenterCardProps {
  links: HelpLink[];
}

/** "Help Center" card: FAQ / Blog / Notice Board quick links. */
export function HelpCenterCard({ links }: HelpCenterCardProps) {
  return (
    <Card className="p-5">
      <Typography variant="h2" className="mb-4 text-base">
        Help Center
      </Typography>
      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link.id}>
            <button
              type="button"
              className="flex w-full items-start gap-3 rounded-md text-left transition duration-DEFAULT hover:bg-background"
            >
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary">
                <Icon name={link.icon} size={16} />
              </span>
              <span>
                <Typography variant="body" className="text-sm font-semibold">
                  {link.title}
                </Typography>
                <Typography variant="caption" as="p">
                  {link.description}
                </Typography>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}
