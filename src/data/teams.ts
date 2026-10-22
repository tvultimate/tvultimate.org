/**
 * The field for the 2026 Battle of Idaho.
 *
 * Ulticentral is down, so this is a snapshot a director keeps by hand rather
 * than a live registration feed. Adding a team is one line here; the page
 * renders every division from this list, in the order given, and the counts
 * are derived rather than typed, so they cannot drift from the names.
 */
export interface TeamDivision {
  /** Anchor id and the key the admin index links to. */
  id: string;
  name: string;
  summary: string;
  teams: readonly string[];
}

export const teamDivisions: readonly TeamDivision[] = [
  {
    id: 'mixed',
    name: 'Mixed Teams',
    summary: 'Saturday and Sunday, to a standard ABBA ratio.',
    teams: [
      'Bitterroot',
      'Dungeon Masters',
      'Wheat Wave',
      'MossyCows',
      'Reigning Champs',
      'Trexburg Alumni',
      'Spud Buds',
    ],
  },
  {
    id: 'open',
    name: 'Open Teams',
    summary: 'Saturday only, any roster composition.',
    teams: ["Brandle's Targets", 'Twin Falls', 'Montana', 'Meridian B Team'],
  },
  {
    id: 'youth',
    name: 'Youth Teams',
    summary: 'Under 20 — Friday Swiss rounds, Saturday bracket play.',
    teams: ['SkyView High School', 'Lone Peak High School', 'Sage International', 'Angels'],
  },
];

/** Total across every division, for the headline on the page. */
export const teamCount = teamDivisions.reduce(
  (total, division) => total + division.teams.length,
  0,
);
