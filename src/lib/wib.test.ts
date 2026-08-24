import { formatWibClock, formatWibDayLabel, formatWibTimestamp, todayInWib } from "./wib";

/**
 * The dashboard is timezone-fixed to WIB. These tests run under a deliberately
 * hostile TZ so a regression to the viewer's local timezone fails loudly
 * instead of passing on a machine that happens to be in Asia/Jakarta.
 */
describe("WIB formatting (fixed to Asia/Jakarta)", () => {
  const originalTz = process.env.TZ;

  beforeAll(() => {
    // UTC-5: any timestamp after 12:00 UTC lands on a different calendar day
    // here than in WIB, so a leaked local offset changes the rendered date.
    process.env.TZ = "America/New_York";
  });

  afterAll(() => {
    process.env.TZ = originalTz;
  });

  it("renders an instant at its WIB wall clock, not UTC", () => {
    // 2026-07-19T01:55:00Z is 08:55 WIB -- GT-01's start.
    expect(formatWibClock("2026-07-19T01:55:00.000Z")).toBe("08:55 WIB");
    expect(formatWibTimestamp("2026-07-19T01:55:00.000Z")).toBe("19 Jul, 08:55 WIB");
  });

  it("keeps the WIB calendar day across the UTC midnight boundary", () => {
    // 2026-07-19T17:00:00Z is already 00:00 WIB on the 20th.
    expect(formatWibTimestamp("2026-07-19T17:00:00.000Z")).toBe("20 Jul, 00:00 WIB");
    // ...and 23:55 WIB on the 19th is still the 19th in WIB.
    expect(formatWibTimestamp("2026-07-19T16:55:00.000Z")).toBe("19 Jul, 23:55 WIB");
  });

  it("labels a WIB date without rolling the day", () => {
    expect(formatWibDayLabel("2026-07-19")).toBe("Sun 19 Jul");
    expect(formatWibDayLabel("2026-07-29")).toBe("Wed 29 Jul");
  });

  it("reports the current day in WIB terms", () => {
    // 03:00 UTC on the 19th = 10:00 WIB on the 19th, but 23:00 on the 18th
    // in the local (UTC-5) zone this suite runs under.
    jest.useFakeTimers().setSystemTime(new Date("2026-07-19T03:00:00.000Z"));
    expect(todayInWib()).toBe("2026-07-19");
    jest.useRealTimers();
  });
});
