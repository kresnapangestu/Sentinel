import { Typography } from "@/components/atoms/Typography";
import Image from "next/image";

/**
 * Left-hand brand/marketing panel. Static presentational content --
 * copy and slide count are the only things likely to change here.
 * Fixed dark background by brand identity: does not respond to theme.
 */
export function MarketingPanel() {
  return (
    <section
      className="relative flex h-full flex-col justify-between overflow-hidden p-6 md:p-8 lg:p-12"
      style={{
        background:
          "radial-gradient(120% 100% at 20% 0%, #5c1030 0%, transparent 55%), linear-gradient(160deg, var(--surface-dark-from), var(--surface-dark-to))",
      }}
      aria-label="Product highlights"
    >
      <div className="relative z-[2] flex items-center gap-3">
        <Typography variant="h2" as="span" className="text-text-inverse">
          Sentinel
        </Typography>
      </div>

      <div className="relative z-[2] flex max-w-[460px] flex-col gap-4">
        <Typography variant="display" className="text-white">
          Monitor Network. <br />
          Detect Anomalies. <br />
          Make Better Decisions.
        </Typography>
      </div>
      <div
        className="absolute inset-0 z-[1] flex items-center justify-center opacity-50"
        aria-hidden="true"
      >
        <BrandIllustration />
      </div>
    </section>
  );
}

function BrandIllustration() {
  return (
    <Image
      src="/img/background-login-light.webp"
      width={500}
      height={500}
      alt="Brand"
      className="h-auto w-[90%] max-w-[480px]"
    />
  );
}
