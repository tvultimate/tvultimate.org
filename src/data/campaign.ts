/**
 * Copy for the four Google Ads landing pages under `/battle-of-idaho/`.
 *
 * These pages are deliberately absent from `data/navigation.ts`: they exist
 * only to answer one audience each — a solo player, a young solo player, a
 * parent, a team captain — so every block below is written for that one
 * reader and skimmable on a phone. Both destinations on each page (the
 * registration form and the full tournament page) are fixed by the ad
 * campaigns.
 *
 * Registration is split by who is signing up: a team captain goes to the team
 * form, a solo player to the individual form. Both are Zeffy forms we run
 * ourselves while Ulticentral is unavailable, so the `href` lives on each
 * page's `cta` rather than being shared.
 *
 * Facts are drawn from `data/tournament`; nothing here restates a date, a fee,
 * or a venue that the tournament module already owns unless the campaign
 * framing needs its own wording.
 */

import { contact, links } from './org';
import { adsAccounts } from './ads';
import { amenities, divisions, freeAgentPolicy, pricing, tournament } from './tournament';

/** Icons come from `ui/Icon.astro`, so a benefit cannot invent its own. */
export type CampaignIcon =
  | 'disc'
  | 'users'
  | 'heart'
  | 'video'
  | 'trophy'
  | 'calendar'
  | 'shield'
  | 'sparkle'
  | 'document';

export interface CampaignBenefit {
  title: string;
  body: string;
  icon: CampaignIcon;
}

export interface CampaignBenefits {
  eyebrow: string;
  title: string;
  lede: string;
  items: readonly CampaignBenefit[];
}

export interface CampaignDetail {
  label: string;
  value: string;
  note?: string;
}

export interface CampaignHighlight {
  eyebrow: string;
  title: string;
  body: string;
  /** Optional email or link action under the body. */
  link?: { label: string; href: string };
}

export interface CampaignCta {
  eyebrow: string;
  title: string;
  lede: string;
  /** Label for the primary registration button, reused in the hero. */
  primary: string;
  /**
   * Where that button goes. A team page points at the team form, a solo page
   * at the individual one; nothing here is shared, so a page cannot inherit
   * the wrong destination.
   */
  href: string;
  note?: string;
}

export interface CampaignLanding {
  /** Route this page is published at. */
  path: string;
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  lede: string;
  intro: string;
  benefits: CampaignBenefits;
  highlight: CampaignHighlight;
  details: readonly CampaignDetail[];
  /** `division` names the squad on a page that offers more than one. */
  schedule: readonly { day: string; detail: string; division?: string }[];
  rules: readonly string[];
  cta: CampaignCta;
  /**
   * The Google Ads account this page reports to. Every landing page here is
   * reached from the same ad campaign, so they share one account; a page that
   * names none would carry no ads tag at all.
   */
  adsAccount?: string;
  /**
   * Set on a page whose registration clicks should report a Google Ads
   * conversion. Only the free agent page is configured for this today.
   */
  conversion?: CampaignConversion;
}

/** Shared by all four pages: the "full info" link and the address to reply to. */
export const campaignLinks = {
  teamRegister: links.battleTeamRegistration,
  individualRegister: links.battleIndividualRegistration,
  info: 'https://tvultimate.org/battle-of-idaho/',
  email: contact.battle.email,
} as const;

/**
 * A Google Ads conversion to report when a visitor leaves for a registration
 * form.
 */
export interface CampaignConversion {
  /** The account the conversion is reported to. */
  account: string;
  /**
   * The label of the conversion action inside that account. Optional: a
   * `send_to` of the account alone credits the account's global tag, which is
   * what the campaign reports today. Fill in the label from Google Ads
   * (Goals > Conversions > Tag setup) to credit one named action instead.
   */
  label?: string;
  /** In the units `currency` names, so this counts as one USD registration. */
  value: number;
  currency: string;
}

/**
 * The registration conversion for the Battle of Idaho campaign.
 */
export const battleConversion: CampaignConversion = {
  account: adsAccounts.battle,
  value: 1,
  currency: 'USD',
};

/** The secondary link, identical on every page by ad-campaign requirement. */
export const campaignSecondary = {
  label: 'For more tournament info, click here',
  href: campaignLinks.info,
} as const;

/*
 * Fees and start times are read out of `data/tournament` rather than retyped,
 * so a correction to the fee schedule or a division schedule cannot land on the
 * landing pages as a stale second copy. The tournament page renders the same
 * values from the same source.
 */
const freeAgentFee = pricing.find((tier) => tier.label === 'Free Agents')?.amount ?? '$20';

/** One division out of the shared division data. */
const division = (id: string) => divisions.find((entry) => entry.id === id);

/** That division's schedule. */
const scheduleFor = (id: string) => division(id)?.schedule ?? [];

/**
 * The clock time out of a schedule detail: "Swiss rounds begin at 2:00 PM"
 * becomes "2:00 PM". Used where the landing page repeats a time the schedule
 * already spells out in full.
 */
const timeOf = (detail: string | undefined) =>
  detail?.match(/\d{1,2}:\d{2}\s?[AP]M/)?.[0] ?? '';

/** "2:00 PM · 10:00 AM" for the compact facts strip. */
const startTimes = (id: string) =>
  scheduleFor(id)
    .map((slot) => timeOf(slot.detail))
    .join(' · ');

/** Abbreviations for the day-by-day labels and the compact date range. */
const WEEKDAYS = {
  Monday: 'Mon',
  Tuesday: 'Tue',
  Wednesday: 'Wed',
  Thursday: 'Thu',
  Friday: 'Fri',
  Saturday: 'Sat',
  Sunday: 'Sun',
} as const;

const shorten = (text: string) =>
  text.replace(
    /\b(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/g,
    (day) => WEEKDAYS[day as keyof typeof WEEKDAYS],
  );

/**
 * "Fri, Nov 13 – Sat, Nov 14" — the division's `dates` with weekday names
 * abbreviated, for the facts strip where the long form is too wide.
 */
const shortDates = (id: string) => shorten(division(id)?.dates ?? '');

/** The Mixed Adult date range, spelled out in the benefit copy. */
const mixedDates = division('mixed')?.dates ?? '';

/** The youth Swiss and bracket start times, for the highlight copy. */
const youthStart = timeOf(scheduleFor('youth')[0]?.detail);
const youthBracket = timeOf(scheduleFor('youth')[1]?.detail);

/**
 * The schedule as the landing page renders it, with the day names shortened the
 * same way as the facts strip.
 */
const daySchedule = (id: string) =>
  scheduleFor(id).map((slot) => ({ day: shorten(slot.day), detail: slot.detail }));

/* ------------------------------------------------------------------ *
 * Page 1 — Free agents
 * ------------------------------------------------------------------ */

export const freeAgentLanding: CampaignLanding = {
  path: '/battle-of-idaho/free-agent/',
  adsAccount: adsAccounts.battle,
  conversion: battleConversion,
  title: `${tournament.name} ${tournament.year} — Free Agent Signup`,
  description: `Sign up solo for the ${tournament.name} ${tournament.year} and get drafted onto a dedicated free agent squad — Mixed Adult (Sat–Sun) or Adult Open (Sat). Enter the raffle for a full refund.`,
  eyebrow: `${tournament.edition} · Free Agents · Mixed or Open`,
  heading: 'Play the Tourney for Free?',
  lede: 'No team? No problem. Register solo and the directors draft you onto a dedicated Free Agent squad — Mixed Adult for the full weekend, or Adult Open for Saturday only.',
  intro:
    'One of the best weekends of the fall happens at Heroes Park, and you do not need a roster to be part of it. Sign up as a free agent and we will place you on a squad built for players who came without one, in whichever division suits you.',
  benefits: {
    eyebrow: 'Why play here',
    title: 'No roster, no problem, no catch',
    lede: 'Everything you get when you sign up solo and we put you on a team.',
    items: [
      {
        icon: 'users',
        title: 'Sign up solo, get drafted',
        body: 'Register as an individual and we place you on a dedicated free agent squad — Mixed Adult or Adult Open. You show up, we play.',
      },
      {
        icon: 'trophy',
        title: 'Raffle: 10 ways to win',
        body: 'Five winners get a 100% refund and five more get 50% back. Ten chances to play for nothing.',
      },
      {
        icon: 'disc',
        title: 'All skill levels, all roles',
        body: 'Handlers, cutters, defenders, rookies — every roster is built to win and every roster needs bodies. Come as you are.',
      },
      {
        icon: 'calendar',
        title: 'One day or both',
        body: `Saturday only in Adult Open, or the full weekend in Mixed Adult on ${mixedDates}.`,
      },
    ],
  },
  highlight: {
    eyebrow: 'Free Agent Raffle',
    title: 'Ten winners. Every entry refunded.',
    body: `Five free agents win a 100% refund and five more win 50% back. Register as a Free Agent, then email ${contact.battle.email} to lock your raffle entry in.`,
    link: {
      label: 'Email us to enter the raffle',
      href: `mailto:${contact.battle.email}?subject=${encodeURIComponent('Free Agent Raffle entry — 2026 Battle of Idaho')}`,
    },
  },
  details: [
    {
      label: 'Divisions',
      value: 'Mixed Adult or Adult Open',
      note: 'ABBA ratio in Mixed · any composition in Open',
    },
    { label: 'Dates', value: shortDates('mixed'), note: 'Open plays Saturday only' },
    { label: 'Where', value: tournament.location, note: tournament.address },
    { label: 'Entry', value: freeAgentFee, note: 'per free agent' },
  ],
  schedule: [
    ...daySchedule('mixed').map((slot) => ({ ...slot, division: 'Mixed Adult' })),
    ...daySchedule('open').map((slot) => ({ ...slot, division: 'Adult Open' })),
  ],
  rules: [
    'Mixed Adult plays Saturday and Sunday, to a standard ABBA gender ratio.',
    'Adult Open plays Saturday only, open to any gender composition.',
    '75-minute rounds, games to 13, hard cap in effect.',
    '15 minutes between rounds for rest and field transition.',
  ],
  cta: {
    eyebrow: 'Free Agent signups are open',
    title: 'Take the field with a team that needs you',
    lede: 'Register as a free agent, then email us to enter the raffle. We will take care of the rest.',
    primary: 'Register as a Free Agent',
    href: campaignLinks.individualRegister,
    note: `Free agents are ${freeAgentFee}. Email ${contact.battle.email} after you register to lock in your raffle entry.`,
  },
};

/* ------------------------------------------------------------------ *
 * Page 2 — Youth free agents
 * ------------------------------------------------------------------ */

/**
 * The entry fee for a youth free agent, read out of the shared price list so
 * the landing page and the tournament page cannot disagree about it.
 */
const youthFreeAgentFee =
  pricing.find((tier) => tier.label === 'Youth Free Agents')?.amount ?? '$15';

/**
 * The youth free agent rules: the game format that holds in every division,
 * the division's own eligibility rule, and what is on site for the weekend.
 */
const youthFreeAgentRules = [
  '75-minute rounds, games to 13, hard cap in effect.',
  '15 minutes between rounds for rest and field transition.',
  division('youth')?.rules ?? '',
  ...amenities,
].filter(Boolean);

export const youthFreeAgentLanding: CampaignLanding = {
  path: '/battle-of-idaho/youth-free-agent/',
  adsAccount: adsAccounts.battle,
  conversion: battleConversion,
  title: `${tournament.name} ${tournament.year} — Youth Free Agent Signup`,
  description: `Sign up solo for the ${tournament.name} ${tournament.year} Youth Open and get drafted onto a dedicated youth free agent squad — Friday Swiss rounds and Saturday bracket play, for players under 20. ${youthFreeAgentFee} to play.`,
  eyebrow: `${tournament.edition} · Youth Free Agents · Under 20`,
  heading: 'Play the Tourney — No Team Needed',
  lede: 'No team? No problem. Register solo and the directors draft you onto a dedicated Youth Open squad — Friday Swiss rounds, Saturday bracket play, for players under 20.',
  intro:
    'One of the best weekends of the fall happens at Heroes Park, and you do not need a roster to be part of it. Sign up as a youth free agent and we will place you on a squad built for players who came without one.',
  benefits: {
    eyebrow: 'Why play here',
    title: 'No roster, no problem, no catch',
    lede: 'Everything a youth player gets when they sign up solo and we put them on a team.',
    items: [
      {
        icon: 'users',
        title: 'Sign up solo, get drafted',
        body: 'Register as an individual and we place you on a dedicated Youth Open squad. You show up, we play.',
      },
      {
        icon: 'shield',
        title: 'Under 20, open format',
        body: 'Open to players under 20. Mixed roster composition is welcome, and gender ratios are agreed by the captains and coaches before the first game.',
      },
      {
        icon: 'heart',
        title: 'Recovery staff on site',
        body: 'Trained recovery staff all weekend, plus water, field snacks, and bathrooms on location the whole time.',
      },
      {
        icon: 'calendar',
        title: 'Friday and Saturday',
        body: `Swiss rounds Friday at ${youthStart}, then single-elimination bracket play Saturday at ${youthBracket}.`,
      },
    ],
  },
  highlight: {
    eyebrow: 'How free agents work',
    title: 'We find you a squad',
    body: freeAgentPolicy,
    link: {
      label: 'Email us about youth registration',
      href: `mailto:${contact.youth.email}?subject=${encodeURIComponent('Youth Free Agent — 2026 Battle of Idaho')}`,
    },
  },
  details: [
    { label: 'Division', value: 'Youth Open', note: 'Open to players under 20' },
    { label: 'Dates', value: shortDates('youth'), note: 'Friday Swiss · Saturday bracket' },
    { label: 'Where', value: tournament.location, note: tournament.address },
    { label: 'Entry', value: youthFreeAgentFee, note: 'per youth free agent' },
  ],
  schedule: daySchedule('youth'),
  rules: youthFreeAgentRules,
  cta: {
    eyebrow: 'Youth free agent signups are open',
    title: 'Take the field with a team that needs you',
    lede: 'Register as a youth free agent, then email us if you have any questions about the division.',
    primary: 'Register as a Youth Free Agent',
    href: campaignLinks.individualRegister,
    note: `Youth free agents are ${youthFreeAgentFee}. Players under 20 — email ${contact.youth.email} if you need help registering.`,
  },
};

/* ------------------------------------------------------------------ *
 * Page 3 — Youth Open
 * ------------------------------------------------------------------ */

export const youthLanding: CampaignLanding = {
  path: '/battle-of-idaho/youth-open/',
  adsAccount: adsAccounts.battle,
  title: `${tournament.name} ${tournament.year} — Youth Open (U20)`,
  description: `Youth Open ultimate at Heroes Park, Meridian: Swiss rounds Friday Nov 13, bracket play Saturday Nov 14, for players under 20.`,
  eyebrow: `${tournament.edition} · Youth Open · Under 20`,
  heading: 'Level Up Their Frisbee Game',
  lede: 'A fun, competitive weekend dedicated to growing youth sports in Idaho — and a place where young players level up in front of a real crowd.',
  intro:
    'The Youth Open is our under-20 division, and it is the most direct way we have to grow the sport in this state. Two days of tournament ultimate, played by teenagers, coached on the sideline, in front of families and friends.',
  benefits: {
    eyebrow: 'Why this one',
    title: 'A weekend built for young players',
    lede: 'Real competition, real care, and a sideline full of parents.',
    items: [
      {
        icon: 'trophy',
        title: 'Real tournament play',
        body: 'Friday’s Swiss rounds seed the field. Saturday is a single-elimination bracket, because earning a Saturday spot should mean something.',
      },
      {
        icon: 'shield',
        title: 'A safe, supported field',
        body: 'Trained recovery staff on site all weekend, field snacks and water for the players, and bathrooms on location the whole time.',
      },
      {
        icon: 'sparkle',
        title: 'Players under 20',
        body: 'Open format, so mixed rosters are welcome. Gender ratios are agreed by the captains and coaches before the first game.',
      },
      {
        icon: 'heart',
        title: 'Parents on the sideline',
        body: 'Cheer, watch, and take your kid home with two days of new friends and a much better cut mark.',
      },
    ],
  },
  highlight: {
    eyebrow: 'Weekend schedule',
    title: 'Friday afternoon in, Saturday morning out',
    body: `Swiss rounds start at ${youthStart} on Friday. Bracket play starts at ${youthBracket} on Saturday. Two days that fit a school weekend.`,
    link: {
      label: 'Ask us about the youth division',
      href: `mailto:${contact.youth.email}?subject=${encodeURIComponent('Youth Open — 2026 Battle of Idaho')}`,
    },
  },
  details: [
    { label: 'Division', value: 'Youth Open', note: 'Open to players under 20' },
    { label: 'Dates', value: shortDates('youth'), note: 'Two days' },
    { label: 'Where', value: tournament.location, note: tournament.address },
    { label: 'Start times', value: startTimes('youth'), note: 'Swiss · Bracket' },
  ],
  schedule: daySchedule('youth'),
  rules: [
    '75-minute rounds, games to 13, hard cap in effect.',
    '15 minutes between rounds for rest and field transition.',
    'Water and field snacks provided for every player.',
    'Bathrooms and trained recovery staff on site all weekend.',
  ],
  cta: {
    eyebrow: 'Youth Open signups are open',
    title: 'Give them a weekend worth talking about',
    lede: 'Register your player for the Youth Open, or bring the whole squad and enter a team.',
    primary: 'Register for the Youth Division',
    href: campaignLinks.teamRegister,
    note: 'Youth teams register for $200. Players without a squad can sign up as a youth free agent at tvultimate.org/battle-of-idaho/youth-free-agent/.',
  },
};

/* ------------------------------------------------------------------ *
 * Page 4 — Team registration
 * ------------------------------------------------------------------ */

export const teamLanding: CampaignLanding = {
  path: '/battle-of-idaho/register-a-team/',
  adsAccount: adsAccounts.battle,
  title: `${tournament.name} ${tournament.year} — Register a Team`,
  description: `Register your Mixed Adult team for the ${tournament.name} ${tournament.year} at Heroes Park: $200 team bid with a $50 discount, 16 spots per division, five games guaranteed.`,
  eyebrow: `${tournament.edition} · Mixed Adult · Team Registration`,
  heading: 'Keep Your Season Going',
  lede: 'Gather your squad for the premier fall destination tournament in Idaho, then take home five games and a full weekend of film.',
  intro:
    'The fall season is long and the weather is not. Battle of Idaho is the weekend that keeps a team together when the grass turns brown — a full tournament schedule, a real bracket, and one of the strongest fields in the region.',
  benefits: {
    eyebrow: 'Why this one',
    title: 'The fall destination tournament',
    lede: 'What a captain gets for putting a roster on the line in November.',
    items: [
      {
        icon: 'sparkle',
        title: '$200 with a reply',
        body: 'General Registration is $250. Reply to us and we apply the $50 discount, so your team bids $200.',
      },
      {
        icon: 'calendar',
        title: 'Five games guaranteed',
        body: 'Swiss rounds on Saturday seed the division into a single-elimination bracket on Sunday. Nobody rides home with one game.',
      },
      {
        icon: 'users',
        title: '16 teams, per division',
        body: 'Capped at 16 teams so every team plays a real schedule. Once a division fills, it is a waitlist.',
      },
      {
        icon: 'disc',
        title: 'Mixed Adult, ABBA',
        body: 'Standard ABBA gender ratio system, or ratio rules your captains agree on before the first game.',
      },
    ],
  },
  highlight: {
    eyebrow: 'Captains only',
    title: 'Claim the $50 discount',
    body: `Reply to ${contact.battle.email} and we will confirm your $200 team bid before registration closes.`,
    link: {
      label: 'Reply to claim $50 off',
      href: `mailto:${contact.battle.email}?subject=${encodeURIComponent('$50 team bid discount — 2026 Battle of Idaho')}`,
    },
  },
  details: [
    { label: 'Division', value: 'Mixed Adult', note: 'Standard ABBA gender ratio' },
    { label: 'Dates', value: shortDates('mixed'), note: 'Two full days' },
    { label: 'Where', value: tournament.location, note: tournament.address },
    { label: 'Bid', value: '$200', note: '$250 general · $50 off with reply' },
  ],
  schedule: daySchedule('mixed'),
  rules: [
    '75-minute rounds, games to 13, hard cap in effect.',
    '15 minutes between rounds for rest and field transition.',
    'Five games guaranteed for every team.',
    '16 teams max per division, waitlist after.',
  ],
  cta: {
    eyebrow: 'Team bids are limited',
    title: 'Sixteen spots. No waitlist if you move now.',
    lede: 'Register your team, or reply to us first to lock in the $50 discount.',
    primary: "Secure Your Team's Spot",
    href: campaignLinks.teamRegister,
    note: `Reply to ${contact.battle.email} to claim the $50 discount and we will confirm your $200 rate.`,
  },
};
/**
 * Every campaign landing page, in the order the staff index lists them. Kept
 * beside the pages themselves so a new landing page cannot be missing from
 * `/admin/`.
 */
export const campaignLandings: readonly CampaignLanding[] = [
  freeAgentLanding,
  youthFreeAgentLanding,
  youthLanding,
  teamLanding,
];
