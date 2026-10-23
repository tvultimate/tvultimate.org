/**
 * The field for the 2026 Battle of Idaho.
 *
 * Ulticentral is down, so this is a snapshot a director keeps by hand rather
 * than a live registration feed. Adding a team is one line here; the page
 * renders every division from this list, in the order given, and the counts
 * are derived rather than typed, so they cannot drift from the names.
 *
 * `teamDivisions` is the published field. `pendingTeams` is the directors'
 * working list and appears only in `/admin/`: a team that is still deciding
 * has not entered, so it must not turn up as registered on the public page.
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
    teams: ["Brandle's Targets", 'Twin Falls', 'Montana', 'Meridian B Team', 'Pocatello Pangz'],
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

/**
 * A team the directors are still tracking. `note` is whatever is true right
 * now — a contact name, how likely the bid is, whether the roster will need to
 * combine with another school.
 */
export interface PendingTeam {
  name: string;
  /**
   * The name the team is published under, when the directors' shorthand
   * differs. Used only to keep one team out of the registered list.
   */
  registeredAs?: string;
  note?: string;
}

export interface PendingGroup {
  id: string;
  name: string;
  /** Anything that applies to the whole group. */
  note?: string;
  teams: readonly PendingTeam[];
}

/**
 * Teams that have not entered yet. Internal only: shown at the foot of
 * `/admin/`, never on the public teams page.
 */
export const pendingTeams: readonly PendingGroup[] = [
  {
    id: 'mixed-pending',
    name: 'Mixed',
    teams: [
      { name: 'Utah Team', note: 'Devin contact' },
      { name: 'Reigning Champs', note: 'Andrew/Rusts' },
    ],
  },
  {
    id: 'open-pending',
    name: 'Open',
    note: 'No info from other colleges yet.',
    teams: [
      /* A different team from "Trexburg Alumni", which is already in Mixed. */
      { name: 'Trexburg' },
      { name: 'BSU + Extras', note: 'Less likely' },
    ],
  },
  {
    id: 'youth-pending',
    name: 'Youth Open',
    teams: [
      { name: 'Green Canyon A' },
      { name: 'Green Canyon B' },
      { name: 'Green Canyon C', note: 'Less likely' },
      { name: 'Eagle', note: 'Should be good' },
      { name: 'Sage', registeredAs: 'Sage International', note: 'Likely will need to combine' },
      { name: 'MTN View', note: 'Likely will need to combine' },
      { name: 'Rocky', note: 'Likely will need to combine' },
      { name: 'Centennial', note: 'Likely will need to combine' },
    ],
  },
  {
    id: 'not-coming',
    name: 'Likely not coming',
    teams: [
      { name: 'Twin Falls Youth' },
      { name: 'Timberline' },
      { name: 'BBBK' },
      { name: 'Riverstone' },
    ],
  },
];

/** Every pending name, so a team cannot be listed as both. */
export const pendingTeamNames = new Set(
  pendingTeams.flatMap((group) =>
    group.teams.map((team) => team.registeredAs ?? team.name),
  ),
);
