/**
 * Battle of Idaho — the league's flagship tournament. Facts are separated
 * from presentation so the detail grid, schedule, and rules list can each
 * render from the same source without copy-paste drift.
 */

import { images } from './org';

export const tournament = {
  name: 'Battle of Idaho',
  edition: '4th Annual',
  year: '2026',
  tagline: "Idaho's Largest Ultimate Frisbee Tournament",
  dates: 'November 13–15, 2026',
  location: 'Heroes Park',
  address: '3064 W Malta Dr, Meridian, ID 83646',
  /**
   * Sponsors, thanked at the foot of the tournament page. Logos recovered from
   * the archived tournament page — see `public/img/manifest.json` for
   * provenance. Intrinsic dimensions are carried with each mark so the wall
   * reserves the right space before the files land.
   */
  sponsors: [
    {
      name: "Goldstein's Bagels & Bialys",
      logo: images.sponsorGoldsteins,
      width: 1280,
      height: 492,
    },
    {
      name: 'Stevenson Real Estate',
      logo: images.sponsorStevenson,
      width: 424,
      height: 100,
    },
    {
      name: 'ERTH Beverage Co.',
      logo: images.sponsorErth,
      width: 232,
      height: 134,
    },
  ],
  intro:
    'An ultimate frisbee tournament dedicated to growing the sport in our state. This event is perfect for all levels of teams looking for a fun and competitive weekend on the field.',
} as const;

/** Headline numbers surfaced as stat tiles. */
export const stats = [
  { value: '16', unit: 'teams', label: 'Max per division' },
  { value: '3', unit: 'divisions', label: 'Youth, Open, Mixed' },
  { value: '6', unit: '+ games', label: 'Guaranteed per team' },
  { value: '$225', unit: 'early', label: 'Per-team entry' },
] as const;

/**
 * Entry fees.
 *
 * The two team fees are quoted verbatim from the old site. The free-agent fee
 * is not stated there — the old page only says free agents are placed on a
 * dedicated team — so this figure comes from the tournament directors and is
 * flagged as current-only in the sources doc.
 */
export const pricing = [
  { label: 'End of September', amount: '$225', note: 'per team' },
  { label: 'General Registration', amount: '$250', note: 'per team' },
  {
    label: 'Free Agents',
    amount: '$30',
    note: 'placed on a dedicated free agent team',
  },
] as const;

export const freeAgentPolicy =
  'Don’t have a team? Sign up as a free agent and you will be placed on a dedicated free agent team. If there aren’t enough players to fill a roster, we will notify you by the Wednesday before the tournament and issue a full refund.';

export interface Division {
  id: string;
  name: string;
  dates: string;
  who: string;
  rules: string;
  /** How this division is run, which differs from division to division. */
  format: string;
  schedule: { day: string; detail: string }[];
}

/**
 * Three divisions, each with its own eligibility rules, format, and start
 * times. Order is the order they are presented in, which is the order a
 * captain reads them in: youth first, then the two adult divisions.
 */
export const divisions: Division[] = [
  {
    id: 'youth',
    name: 'Youth Open',
    dates: 'Friday, Nov 13 – Saturday, Nov 14',
    who: 'Open to players under 20 years of age. Open format, but mixed roster composition is preferred.',
    rules: 'Gender ratios are discussed and agreed upon by captains and coaches prior to games.',
    format:
      'Swiss rounds on Friday seed the division, then play moves into a single-elimination bracket on Saturday.',
    schedule: [
      { day: 'Friday', detail: 'Swiss rounds begin at 3:00 PM' },
      { day: 'Saturday', detail: 'Bracket play begins at 10:00 AM' },
    ],
  },
  {
    id: 'mixed',
    name: 'Adult Mixed',
    dates: 'Saturday, Nov 14 – Sunday, Nov 15',
    who: 'Open to all skill levels at any age.',
    rules: 'Standard ABBA gender ratio system, or ratio rules agreed by captains prior to games.',
    format:
      'Swiss rounds on Saturday seed the division, then play moves into a single-elimination bracket on Sunday.',
    schedule: [
      { day: 'Saturday', detail: 'Swiss rounds begin at 9:00 AM' },
      { day: 'Sunday', detail: 'Bracket play begins at 10:00 AM' },
    ],
  },
  {
    id: 'open',
    name: 'Adult Open',
    dates: 'Saturday, Nov 14',
    who: 'Open to players of any age and any gender composition.',
    rules: 'Standard ABBA gender ratio system, or ratio rules agreed by captains prior to games.',
    format:
      'Round robin, so every team meets every other team. If the division fills to eight teams, play goes straight to a single-elimination bracket instead.',
    schedule: [{ day: 'Saturday', detail: 'Play begins at 9:00 AM' }],
  },
];

/**
 * Game rules that hold in every division. Rendered inside the division widget,
 * once per panel, because they apply whichever division a captain is reading
 * about.
 */
export const gameRules = [
  'Regular games: 75-minute rounds, games to 13 points, hard cap in effect.',
  'Semi-finals and finals: 75-minute rounds, games to 13 points, hard cap in effect.',
  'Between rounds: 15 minutes built in for rest and field transition.',
] as const;

export const amenities = [
  'Water provided on-site for all fields.',
  'Field snacks provided for all players.',
  'Bathrooms available on location.',
  'Trained recovery staff available for player care.',
] as const;

export const housing =
  'There are plenty of affordable Airbnbs and hotels in the Treasure Valley, and local traffic will be minimal. Anywhere in the valley works well. If you don’t mind floors, couches, or air mattresses, reach out to the tournament coordinators and we will do our best to match your team with a local host family.';

export const fundraising =
  'The Battle of Idaho is a bring-your-own-team, fundraising tournament where all proceeds are reinvested directly into the Idaho ultimate frisbee community. Your team fee covers tournament costs, and any additional amount helps local clubs and provides resources to make the sport more accessible.';

export const directors = [
  { name: 'McKayle Burner', role: 'Mixed', detail: 'FMP' },
  { name: 'Julian Colins', role: 'Mixed', detail: 'MMP' },
  { name: 'David Nichols', role: 'Youth', detail: 'MMP' },
  { name: 'Jason Burner', role: 'General', detail: 'MMP' },
] as const;