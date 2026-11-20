const monthAndYear = new Intl.DateTimeFormat("en-GB", { month:"long", year:"numeric", timeZone:"UTC" });
const dayMonthAndYear = new Intl.DateTimeFormat("en-GB", { day:"numeric", month:"long", year:"numeric", timeZone:"UTC" });

/** Archive dates may specify a year, month or calendar day; never invent the missing parts. */
export function formatArchiveDate(value: string): string {
  if (value.length === 4) return value;
  const date = new Date(`${value.length === 7 ? `${value}-01` : value}T00:00:00Z`);
  return (value.length === 7 ? monthAndYear : dayMonthAndYear).format(date);
}
