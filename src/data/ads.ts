/**
 * Google Ads identifiers.
 *
 * `AW-…` is a Google Ads account — the "Google tag" that receives the
 * reporting. A conversion action inside an account carries its own label, and
 * the two travel together as `AW-<account>/<label>` so Google can credit one
 * named action rather than the account as a whole.
 *
 * The tag is opt-in per page: a page names the account it reports to, and a
 * page that names none carries no ads tag at all. It used to be hardcoded
 * across the whole site, which meant every page reported to one account no
 * matter which campaign sent the visitor there.
 */

export const adsAccounts = {
  /** The account running the Battle of Idaho ad campaign. */
  battle: 'AW-18501242003',
} as const;

export type AdsAccount = (typeof adsAccounts)[keyof typeof adsAccounts];
