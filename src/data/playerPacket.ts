/**
 * 2026 Battle of Idaho player packet.
 *
 * The packet is the reference document a captain reads on the way to the
 * fields, so its copy follows the printed PDF section for section. Facts that
 * already live elsewhere on the site — the divisions, directors, food vendors,
 * Discord invite, and donation form — are imported rather than retyped, so the
 * web page and the PDF cannot drift apart on the details that matter.
 */

import { contact, documents, funds, images, links } from './org';
import { directors, divisions, foodVendors, tournament } from './tournament';

/** The sections of the packet, in the order the PDF presents them. */
export interface PacketSection {
  /** Anchor id on the page. */
  id: string;
  /** Heading used in the contents list and on the section itself. */
  title: string;
}

export const packetSections: PacketSection[] = [
  { id: 'welcome', title: 'Welcome Note' },
  { id: 'sponsors', title: 'Sponsor Info' },
  { id: 'details', title: 'Tournament Details' },
  { id: 'schedule', title: 'Schedule & Divisions' },
  { id: 'rules', title: 'Rules of Play & Format' },
  { id: 'communications', title: 'Communications' },
  { id: 'scores', title: 'Score Reporting' },
  { id: 'tournament-central', title: 'Tournament Central (TC)' },
  { id: 'medical', title: 'On-Site Injury Triage & Medical' },
  { id: 'venue', title: 'Field Map & Venue Rules' },
  { id: 'parking', title: 'Parking & Site Cleanup' },
  { id: 'donations', title: 'Community Support & Donations' },
  { id: 'competition', title: 'A Note on Competition and Growth' },
];

export const playerPacket = {
  path: '/battle-of-idaho/player-packet/',
  title: `${tournament.year} Player Packet`,
  eyebrow: `${tournament.edition} · ${tournament.year}`,
  lede: 'Everything a captain, coach, or player needs for the weekend: the schedule, rules, score reporting, medical support, and venue logistics.',
  pdf: documents.battlePlayerPacket,
} as const;

export const welcomeNote =
  'We’re thrilled to host the 4th Annual Battle of Idaho Ultimate Tournament! We’re focused on growing the ultimate scene in Idaho and ensuring a fantastic weekend for everyone. Please help us maintain a strong Spirit of the Game by cheering on teams and engaging in spirited play all weekend long.';

/**
 * Sponsors in the order the packet thanks them. Altitude is listed first
 * because the packet also names it as the official medical and recovery
 * partner; the remaining marks come from the tournament's sponsor list.
 */
const packetSponsorNotes: Record<string, string> = {
  'Altitude Physical Therapy': 'Official Medical & Recovery Partner',
  ICCU: 'Idaho Central Credit Union',
};

export const packetSponsors = [
  {
    name: 'Altitude Physical Therapy',
    note: packetSponsorNotes['Altitude Physical Therapy'],
  },
  ...tournament.sponsors
    .filter((sponsor) => sponsor.name !== 'Altitude Physical Therapy')
    .map((sponsor) => ({
      name: sponsor.name,
      note: packetSponsorNotes[sponsor.name],
    })),
];

export const packetDetails = {
  dates: 'Friday, November 13 – Sunday, November 15, 2026',
  location: tournament.location,
  address: tournament.address,
  startTime: '9:30 AM (Saturday & Sunday) / 2:00 PM (Friday Youth)',
} as const;

/**
 * The four directors in the packet's order, with the mobile number the packet
 * prints for the general director. Emails and roles stay tied to the shared
 * `directors` list in `data/tournament.ts`.
 */
const packetDirectorOrder = [
  'Jason Burner',
  'McKayle Burner',
  'Julian Colins',
  'David Nichols',
] as const;

const directorPhones: Partial<Record<(typeof packetDirectorOrder)[number], string>> = {
  'Jason Burner': '208-800-8853',
};

export const packetDirectors = packetDirectorOrder.map((name) => {
  const director = directors.find((entry) => entry.name === name);

  if (!director) {
    throw new Error(`Player packet lists ${name}, who is missing from data/tournament.ts`);
  }

  return { ...director, phone: directorPhones[name] };
});

/**
 * The divisions as the packet schedules them. Youth carries its U20 label, and
 * Adult Open carries the format note the PDF prints beside its start time.
 */
export const packetSchedule = divisions.map((division) => ({
  id: division.id,
  name: division.id === 'youth' ? 'Youth Open (U20)' : division.name,
  dates: division.dates,
  schedule: division.schedule,
  note:
    division.id === 'open'
      ? 'Round Robin / Single Elimination'
      : division.format,
}));

export const packetRules = [
  { label: 'Governing rules', detail: 'USAU Official Rules apply.' },
  { label: 'Round length', detail: '75-minute rounds.' },
  { label: 'Game target', detail: 'Games to 13 points.' },
  { label: 'Caps', detail: 'Hard cap in effect at 75 minutes.' },
  {
    label: 'Between rounds',
    detail: '15 minutes built in for rest and field transition.',
  },
  {
    label: 'Gender ratios (Mixed & Youth)',
    detail:
      'Standard ABBA gender ratio system, or ratio rules agreed upon by captains and coaches prior to games.',
  },
];

export const communications = {
  intro:
    'For all real-time updates — weather, schedule changes, and score tracking — join our Discord channel.',
  href: links.discord,
} as const;

export const scoreReporting = {
  intro: 'Please report scores immediately after your game, in order of preference:',
  methods: [
    {
      label: 'Discord',
      detail: 'Post in the #battle-of-idaho-scores channel.',
      href: links.discord,
      action: 'Open Discord',
    },
    {
      label: 'Text',
      detail: '208-800-8853',
      href: 'tel:+12088008853',
      action: 'Send a text',
    },
    {
      label: 'In person',
      detail: 'Report to Tournament Central.',
      href: undefined,
      action: undefined,
    },
    {
      label: 'Email',
      detail: contact.battle.email,
      href: `mailto:${contact.battle.email}`,
      action: 'Send an email',
    },
  ],
} as const;

export const tournamentCentral = {
  location: 'TC will be staffed by community volunteers and tournament staff.',
  services:
    'Score recording, disc sales, water refills, field snacks, and general assistance.',
  foodIntro: 'Food trucks on site:',
  food: foodVendors,
} as const;

/** Google Maps destination for a street address. */
const mapsFor = (address: string) =>
  `https://maps.google.com/?q=${encodeURIComponent(address)}`;

export const medical = {
  trainer:
    'A trainer, generously sponsored by Altitude Physical Therapy, will be on-site at Tournament Central during gameplay. In the case of head contact or collision, please see the tent for concussion screening before returning to play.',
  emergency: 'Call 911 immediately.',
  coldPacks: 'Available at Tournament Central.',
  urgentCare: {
    name: 'Primary Health off of Chinden',
    address: '1900 W Chinden Blvd, Meridian, ID 83646',
    href: mapsFor('1900 W Chinden Blvd, Meridian, ID 83646'),
  },
  emergencyRoom: {
    name: 'St. Luke’s off of Eagle Rd',
    address: '520 S Eagle Rd, Meridian, ID 83642',
    href: mapsFor('520 S Eagle Rd, Meridian, ID 83642'),
  },
} as const;

export const venueRules = [
  {
    label: 'Tents',
    detail:
      'Please place all shade tents and belongings along the perimeter of the fields.',
  },
  {
    label: 'Alcohol policy',
    detail:
      'Since youth players and youth divisions are at the event, Meridian Parks and Recreation strictly requires that no alcohol be brought or consumed at the venue.',
  },
];

export const fieldMap = {
  src: images.fieldMap,
  alt: 'Aerial field map of Heroes Park showing Fields 1 through 10, possible Fields 11 and 12, Tournament Central, the medical tent, AED locations, restrooms, the food truck, water stations, and parking.',
  caption:
    'Heroes Park field layout: Fields 1–10, with possible Fields 11 and 12 on the east side. Tournament Central, the medical tent, AEDs, restrooms, the food truck, and water stations are marked, with parking along the south edge.',
} as const;

export const parkingAndCleanup = [
  {
    label: 'Parking at Heroes Park',
    detail:
      'Parking is ample. Please be observant as many of the rows are one-way traffic.',
  },
  {
    label: 'Field cleanup',
    detail:
      'Each team will receive a trash bag daily. Please ensure your sideline is completely clean and all trash is picked up before you leave the fields each day.',
  },
];

export const communitySupport = {
  body: 'Treasure Valley Ultimate Inc. is dedicated to reinvesting 100% of tournament proceeds back into growing the local Idaho ultimate frisbee community. If you would like to make a tax-deductible donation to support local youth leagues, club teams, and field access, use the donation link below:',
  href: funds.general.href,
  label: 'Donate to Treasure Valley Ultimate',
} as const;

export const competitionNote =
  'This tournament is growing fast and welcomes a diverse group of players. We’ve done our best to create fun and competitive matchups. Please prioritize a spirited and fun game. If there is a large skill difference, we ask that you do your best to be supportive and encouraging of all players doing their best.';

export const packetClosing = {
  feedback: 'Your feedback is always welcome at',
  feedbackEmail: contact.battle.email,
  thanks: 'Thank you, and have a great weekend!',
  signature: '— Jason Burner, TD',
} as const;
