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
   * Sponsors, thanked at the foot of the tournament page. Most logos were
   * recovered from the archived tournament page; ICCU is newer artwork supplied
   * by the sponsor. Provenance for every file — which page it came from, what it
   * depicts, and where it is contextually accurate — is recorded in
   * `public/img/manifest.json`. Intrinsic dimensions are carried with each mark
   * so the wall reserves the right space before the files land.
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
      href: 'https://stevensonrealestateboise.com/',
    },
    {
      name: 'ERTH Beverage Co.',
      logo: images.sponsorErth,
      width: 232,
      height: 134,
      href: 'https://erthbeveragecompany.com/',
    },
    {
      name: 'ICCU',
      logo: images.sponsorIccu,
      width: 960,
      height: 400,
    },
    {
      /*
        Supplied as a cropped PNG with an alpha channel, sized at twice the
        height the wall renders it at so it stays sharp on a retina display.
        It replaced an auto-traced SVG export that was ~920KB.
      */
      name: 'Beeline Sprinkler Repair',
      logo: images.sponsorBeeline,
      width: 418,
      height: 192,
      href: 'https://www.beelinesprinklerrepair.com/',
    },
  ],
  intro:
    'An ultimate frisbee tournament dedicated to growing the sport in our state. This event is perfect for all levels of teams looking for a fun and competitive weekend on the field.',
} as const;

/** Headline numbers surfaced as stat tiles. */
export const stats = [
  { value: '16', unit: 'teams', label: 'Max per division' },
  { value: '3', unit: 'divisions', label: 'Youth, Open, Mixed' },
  { value: '5', unit: 'games', label: 'Guaranteed per team' },
  { value: '$250', unit: 'per team', label: 'Registration' },
] as const;

/**
 * Entry fees.
 *
 * The early-bird tier ran to the end of September and is gone now that we are
 * in October, so general registration is the only team fee. The free-agent fee
 * is not stated on the old page — it only says free agents are placed on a
 * dedicated team — so that figure comes from the tournament directors and is
 * flagged as current-only in the sources doc. The youth free-agent rate is
 * likewise a directors' figure.
 */
export const pricing = [
  { label: 'General Registration', amount: '$250', note: 'per team' },
  {
    label: 'Free Agents',
    amount: '$20',
    note: 'placed on a dedicated free agent team',
  },
  {
    label: 'Youth Free Agents',
    amount: '$15',
    note: 'placed on a dedicated youth team',
  },
] as const;

/**
 * Youth teams pay a reduced rate. A note under the price list rather than a
 * third price card, so the headline a captain reads is the one they pay.
 */
export const youthPricingNote = 'Youth Open teams register for $200 per team.';

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
      { day: 'Friday', detail: 'Swiss rounds begin at 2:00 PM' },
      { day: 'Saturday', detail: 'Bracket play begins at 9:30 AM' },
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
      { day: 'Saturday', detail: 'Swiss rounds begin at 9:30 AM' },
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
    schedule: [{ day: 'Saturday', detail: 'Play begins at 9:30 AM' }],
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

/**
 * Food vendors booked for the weekend. They are on site for the whole
 * tournament, so a team can buy a meal between games on any day.
 */
export const foodVendors = [
  { name: 'Pizza Piou', detail: 'Wood-fired artisan pizza' },
  { name: 'Gyro Shack', detail: 'Greek gyros and Mediterranean' },
] as const;

export const foodIntro =
  'Food trucks are on site for the whole tournament, so you can buy breakfast, lunch, and dinner between games on any day of the weekend.';

export const housing =
  'There are plenty of affordable Airbnbs and hotels in the Treasure Valley, and local traffic will be minimal. Anywhere in the valley works well. If you don’t mind floors, couches, or air mattresses, reach out to the tournament coordinators and we will do our best to match your team with a local host family.';

export const fundraising =
  'The Battle of Idaho is a bring-your-own-team, fundraising tournament where all proceeds are reinvested directly into the Idaho ultimate frisbee community. Your team fee covers tournament costs, and any additional amount helps local clubs and provides resources to make the sport more accessible.';

/**
 * The four tournament directors, with the address a captain should use for
 * that person rather than the general tournament inbox.
 */
export const directors = [
  { name: 'McKayle Burner', role: 'Mixed', detail: 'FMP', email: 'Mckayle@tvultimate.org' },
  { name: 'Julian Colins', role: 'Mixed', detail: 'MMP', email: 'julian@tvultimate.org' },
  { name: 'David Nichols', role: 'Youth', detail: 'MMP', email: 'david@tvultimate.org' },
  { name: 'Jason Burner', role: 'General', detail: 'MMP', email: 'jason@tvultimate.org' },
] as const;