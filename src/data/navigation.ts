/**
 * Site navigation, mirroring the structure of the original site.
 *
 * This is the single source of truth for the header nav, the mobile drawer,
 * the footer index, and the sub-navigation on each page. Adding a page means
 * adding one entry to `navSections` — the header and footer both pick it up.
 *
 * The exception is the policy pages under `/policies/`. They are reference
 * material rather than a section of the site, and they are deliberately kept out
 * of this file so they stay out of the masthead, the drawer, and the
 * sub-navigation; `SiteFooter.astro` indexes them from `data/policies` instead.
 * They are reachable by direct URL or from the footer.
 */

export interface NavLink {
  /** Path relative to the site root, e.g. `/battle-of-idaho/`. */
  href: string;
  label: string;
  /** One-line description, shown in the mobile drawer and sub-nav. */
  summary?: string;
}

export interface NavSection extends NavLink {
  /** Child pages, rendered as the sub-navigation bar. */
  children?: NavLink[];
}

/**
 * Top-level sections. `href: '/'` is the home page.
 */
export const navSections: NavSection[] = [
  {
    href: '/partner-clubs/',
    label: 'Partner Clubs',
    summary: 'Club teams under our 501(c)(3) umbrella.',
    children: [
      {
        href: '/partner-clubs/sawtooth-ultimate/',
        label: 'Sawtooth Ultimate',
        summary: 'Our competitive Open club team.',
      },
    ],
  },
  {
    href: '/battle-of-idaho/',
    label: 'Battle of Idaho',
    summary: 'Idaho’s largest ultimate frisbee tournament.',
    children: [
      {
        href: '/battle-of-idaho/',
        label: '2026 Battle of Idaho',
        summary: 'Dates, divisions, schedule, and registration.',
      },
      {
        href: '/battle-of-idaho/battle-of-idaho-sponsorship/',
        label: 'Battle of Idaho Sponsorship',
        summary: 'Underwrite the tournament.',
      },
    ],
  },
  {
    href: '/youth-community/',
    label: 'Youth & Community',
    summary: 'Clinics, scholarships, and accessibility programs.',
  },
  {
    href: '/resources-and-media/',
    label: 'Resources and Media',
    summary: 'Complimentary aerial film and photography for local programs.',
  },
  {
    href: '/donations-and-dues/',
    label: 'Donations and Dues',
    summary: 'Tax-deductible funds for every part of the program.',
    children: [
      {
        href: '/donations-and-dues/general-donation/',
        label: 'General Donation',
        summary: 'General operating and community fund.',
      },
      {
        href: '/donations-and-dues/youth-donations/',
        label: 'Youth Donations',
        summary: 'U20 player scholarships and clinics.',
      },
      {
        href: '/donations-and-dues/sawtooth-donations/',
        label: 'Sawtooth Donations',
        summary: 'Team bid fees, facilities, and travel.',
      },
      {
        href: '/donations-and-dues/team-dues/',
        label: 'Team Dues',
        summary: 'Annual club dues for partner teams.',
      },
    ],
  },
];

/**
 * Builds the canonical, trailing-slash URL for a nav link.
 * Using absolute paths everywhere keeps `Astro.url` comparisons simple.
 */
export const navPaths: string[] = navSections.flatMap((section) => [
  section.href,
  ...(section.children?.map((child) => child.href) ?? []),
]);

/** Donation context, used by the donations page. */
export const donations = {
  headline: 'Support Ultimate in the Treasure Valley',
  intro:
    'Treasure Valley Ultimate, Inc. is a registered 501(c)(3) non-profit public charity dedicated to growing the sport of Ultimate Frisbee across Idaho. We provide competitive club teams, youth athletes, and school programs with essential infrastructure, coaching, instructional clinics, and financial aid to make competitive athletics accessible to all.',
  taxNote:
    'All charitable donations made to our general operating fund or designated project funds are tax-deductible to the fullest extent permitted by law. 100% of your contribution directly supports local athletes, youth development, and community programs.',
} as const;