/**
 * Long-form copy for each donation fund.
 *
 * The donation form URL and short blurb live in `org.ts` alongside every other
 * link. This module holds only the page prose, keyed by the same slug. A fund
 * gains a page by adding one object here plus one route wrapper.
 */

import { funds } from './org';

/** Page-specific prose. Every fund with a page has all three fields. */
interface FundProse {
  /** Section heading on the fund page. */
  heading: string;
  /** The main body paragraph. */
  body: string;
  /** Bullet list of what the fund pays for. */
  uses: string[];
}

const prose = {
  general: {
    heading: 'General Operating & Community Fund',
    body: 'Contributions to our General Fund provide shared field equipment (cones, scoreboards, medical kits), clinic supplies, community showcase events, and essential non-profit operating support. Because this fund is unrestricted, it is what lets us fill the gaps that no single programme can cover.',
    uses: [
      'Shared field equipment — cones, scoreboards, and medical kits',
      'Clinic supplies for youth and community events',
      'Community showcase events',
      'Essential non-profit operating support',
    ],
  },
  youth: {
    heading: 'U-20 Youth Development Fund',
    body: '100% of youth donations are restricted to provide need-based player scholarships, tournament travel subsidies, free introductory clinics, and school equipment starter kits for middle and high school players across the valley.',
    uses: [
      'Need-based player scholarships',
      'Tournament travel subsidies',
      'Free introductory clinics',
      'School equipment starter kits for middle and high school players',
    ],
  },
  sawtooth: {
    heading: 'Sawtooth Ultimate Team Fund',
    body: 'Support Sawtooth as they represent the Treasure Valley at regional and national USA Ultimate tournaments. Fan and supporter contributions directly offset team bid fees, practice facilities, and travel costs, which lets a volunteer-run club compete at a level it could not otherwise afford.',
    uses: ['Team bid fees for regional and national tournaments', 'Practice facilities', 'Travel costs'],
  },
  dues: {
    heading: 'Team Dues',
    body: 'Annual club dues for partner teams operating under the Treasure Valley Ultimate 501(c)(3) umbrella. Dues support the infrastructure that is shared across every partner club team.',
    uses: [
      'Umbrella administration for partner clubs',
      'Shared equipment and facilities',
      'Tournament and coaching coordination',
    ],
  },
} as const satisfies Record<string, FundProse>;

export type FundSlug = keyof typeof prose;

/**
 * A fund page: the shared record (name, blurb, form URL) merged with its prose.
 * The mapped type keeps `slug` narrow rather than widening it to `string`.
 */
export type FundDetail = (typeof funds)[FundSlug] & FundProse;

/*
 * Merged lazily through a proxy so the result keeps precise per-fund types
 * (including the narrowed `slug`) instead of collapsing to a widened union.
 * A direct `Object.fromEntries` + cast would erase both.
 */
export const fundDetails = new Proxy({} as Record<FundSlug, FundDetail>, {
  get: (_target, slug: string) => {
    if (!(slug in prose)) return undefined;
    return { ...funds[slug as FundSlug], ...prose[slug as FundSlug] };
  },
  has: (_target, slug) => slug in prose,
  ownKeys: () => Object.keys(prose),
  getOwnPropertyDescriptor: () => ({ enumerable: true, configurable: true }),
});