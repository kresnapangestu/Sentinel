import { Card } from "@/components/atoms/Card";
import { Button } from "@/components/atoms/Button";
import { Typography } from "@/components/atoms/Typography";
import { Icon } from "../Icon";

/**
 * "Get It Free" promo card. Copy is short marketing chrome (not domain
 * data), so it's kept inline here rather than routed through the mock
 * service -- consistent with how MarketingPanel's copy is handled in the
 * auth feature.
 */
export function PromoCard() {
  return (
    <Card
      className="relative overflow-hidden p-5"
      style={{
        background:
          "linear-gradient(160deg, var(--primary), var(--surface-dark-to))",
      }}
    >
      <div className="relative z-[1] flex flex-col items-center text-center">
        <span className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/15 text-white">
          <Icon name="gift" size={32} />
        </span>
        <Typography variant="h2" className="text-lg text-text-inverse">
          Get It Free
        </Typography>
        <Typography variant="bodySmall" as="p" className="mb-4 text-text-inverse-secondary">
          Get started with your 1GB Free Proxy Trial. Quick &amp; Easy in just
          2 minutes!
        </Typography>
        <Button variant="inverted" size="sm" fullWidth>
          Try It Free
          <Icon name="arrowRight" size={14} />
        </Button>
      </div>
    </Card>
  );
}
