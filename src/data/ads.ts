/**
 * Google Ads identifiers.
 *
 * `AW-…` is a Google Ads account — the "Google tag" that receives the
 * reporting. A conversion action inside an account carries its own label, and
 * the two travel together as `AW-<account>/<label>` so Google can credit one
 * named action rather than the account as a whole.
 *
 * The account is the site default: every public page reports to it, so Google
 * Ads can verify the tag from any URL and a remarketing audience covers the
 * whole site. A page opts out with `adsAccount={null}` — `/admin/` does — and
 * a future campaign with its own account can name that instead.
 */

export const adsAccounts = {
  /** The account running the Battle of Idaho ad campaign. */
  battle: 'AW-18501242003',
} as const;

export type AdsAccount = (typeof adsAccounts)[keyof typeof adsAccounts];
