/**
 * Asia/Jakarta (WIB) formatting helpers.
 *
 * The dashboard is timezone-fixed: every label, date default, and timestamp is
 * rendered in WIB regardless of the viewer's browser timezone. All formatting
 * goes through `Intl` with an explicit `timeZone`, so nothing here reads the
 * local offset. Day/slot arithmetic itself lives in the gateway
 * (nest-gateway/src/common/time/wib.ts) -- the frontend only displays it.
 */

export const WIB_TIMEZONE = "Asia/Jakarta";
export const WIB_LABEL = "WIB";

const DATE_PARTS = new Intl.DateTimeFormat("en-CA", {
  timeZone: WIB_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const DAY_LABEL = new Intl.DateTimeFormat("en-GB", {
  timeZone: WIB_TIMEZONE,
  weekday: "short",
  day: "2-digit",
  month: "short",
});

/** Same as DAY_LABEL without the weekday, for timestamps that show a clock. */
const DATE_LABEL = new Intl.DateTimeFormat("en-GB", {
  timeZone: WIB_TIMEZONE,
  day: "2-digit",
  month: "short",
});

const TIME_LABEL = new Intl.DateTimeFormat("en-GB", {
  timeZone: WIB_TIMEZONE,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** Current WIB calendar day as `YYYY-MM-DD`. */
export function todayInWib(): string {
  return DATE_PARTS.format(new Date());
}

/** `2026-07-31` -> `Fri 31 Jul`. Parsed at noon WIB so the day never rolls. */
export function formatWibDayLabel(isoDate: string): string {
  return DAY_LABEL.format(new Date(`${isoDate}T12:00:00+07:00`));
}

/**
 * ISO instant -> `31 Jul, 14:37 WIB`.
 *
 * Formats from a weekday-less pattern rather than stripping the weekday off
 * DAY_LABEL: the separator `en-GB` puts after a short weekday differs between
 * ICU builds, so a regex strip silently leaks "Fri " into the label on some
 * runtimes.
 */
export function formatWibTimestamp(isoInstant: string): string {
  const instant = new Date(isoInstant);
  return `${DATE_LABEL.format(instant)}, ${TIME_LABEL.format(instant)} ${WIB_LABEL}`;
}

/** ISO instant -> `14:37 WIB`. */
export function formatWibClock(isoInstant: string): string {
  return `${TIME_LABEL.format(new Date(isoInstant))} ${WIB_LABEL}`;
}
