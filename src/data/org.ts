/**
 * Organisation-wide facts: identity, contact points, and the external
 * destinations that appear throughout the site. Anything referenced from
 * more than one page lives here so a URL is only ever written once.
 */

export const org = {
  name: 'Treasure Valley Ultimate',
  legalName: 'Treasure Valley Ultimate Inc.',
  tagline: 'Growing Ultimate Frisbee in the Treasure Valley',
  /** Hero headline, split so the emphasised phrase can be styled. */
  headline: {
    lead: 'Growing Ultimate Frisbee',
    accent: 'in the Treasure Valley',
  },
  description:
    'Supporting competitive club teams, youth development, and community athletic competition across Idaho.',
  status: '501(c)(3) non-profit',
  domain: 'tvultimate.org',
} as const;

/**
 * Brand and editorial assets, recovered from the archived previous site.
 *
 * Provenance for every file — which page it came from, what it depicts, and
 * where it is contextually accurate — is recorded in `public/img/manifest.json`.
 *
 * Check `contexts` before placing an image. In particular `action` and
 * `roster` are Sawtooth club-team photos and must NOT be used as Battle of
 * Idaho tournament imagery: the old site captioned them generically, which is
 * how that mislabelling happened in the first place.
 */
export const images = {
  /** Organisation mark. Safe anywhere. */
  logo: '/img/logo-tvu.png',
  logoSmall: '/img/logo-tvu-200.png',
  /** Circular rainbow badge, alternative treatment. */
  logoRoundel: '/img/logo-tvu-roundel.png',

  /** Sawtooth mark, luminance converted to alpha. Dark grounds only. */
  sawtoothLogo: '/img/logo-sawtooth-mark.png',
  sawtoothLogoSmall: '/img/logo-sawtooth-400.png',
  /** Circular Sawtooth mountain-and-disc line mark. Black strokes. */
  sawtoothDisc: '/img/sawtooth-disc-mark.png',
  /** Boise cityscape beneath a hand and mountain, in line art. */
  boiseLandscape: '/img/boise-landscape-mark.png',

  /** Boise skyline silhouette, inverted in CSS for the dark footer. */
  skyline: '/img/boise-skyline.png',
  /**
   * Boise cityscape line art, background knocked out to alpha, for the
   * full-width band screened across the foot of the footer.
   */
  cityscape: '/img/cityscape-band.png',

  /** Battle of Idaho sponsors. */
  sponsorErth: '/img/logo-erth-beverage-co.png',
  sponsorStevenson: '/img/logo-stevenson-real-estate.png',
  sponsorGoldsteins: '/img/logo-goldsteins-bagels.png',

  /** Sawtooth roster on grass. Club-team context only. */
  roster: '/img/team-roster.jpg',
  /** Sawtooth roster with the Boise foothills behind. Club-team context. */
  rosterBoise: '/img/team-roster-boise.jpg',
  /** Players in numbered jerseys in a huddle. Club-team context. */
  huddle: '/img/team-huddle.jpg',
  /** A Sawtooth player diving for a disc. Club-team context, NOT tournament. */
  action: '/img/action-lay.jpg',
  /** Same dive, published on the team-dues page. */
  actionDues: '/img/action-lay-team-dues.jpg',

  /** Overhead aerial of a circle of players. Media-services context. */
  aerialCircle: '/img/aerial-circle.jpg',
  /** Aerial of a group spelling letters on turf. Youth-programme context. */
  aerialYouth: '/img/aerial-youth.jpg',
  /** Wide aerial of a crowd in team colours. Media-services context. */
  aerialTournament: '/img/aerial-tournament.jpg',

  /** Youth players and coaches in a huddle. Youth-programme context. */
  youthHuddle: '/img/youth-team-huddle.jpg',
  /** A youth player taking instruction from teammates. Clinic context. */
  youthCoaching: '/img/youth-coaching.jpg',
} as const;

export const contact = {
  general: { label: 'General inquiries', email: 'help@tvultimate.org' },
  admin: { label: 'Media & operations', email: 'admin@tvultimate.org' },
  youth: { label: 'Youth programs', email: 'youth@tvultimate.org' },
  battle: { label: 'Battle of Idaho', email: 'battleofidaho@tvultimate.org' },
  sawtooth: { label: 'Sawtooth Ultimate', email: 'sawtoothultimateboise@gmail.com' },
} as const;

export const links = {
  discord: 'https://discord.gg/bhBhYUZ82D',
  youtube: 'https://www.youtube.com/@tv-ultimate',
  youtubeFilm: 'https://www.youtube.com/embed/47sKaHp_PuY',
  sawtoothTryout: 'https://tooth.s.gy/tryout',
  battleRegister:
    'https://ultimatecentral.com/en_au/e/2026-battle-of-idaho/register?new=new',
  maps: 'https://maps.google.com/?q=Heroes+Park+Meridian+Idaho',
} as const;

/**
 * Donation destinations. `page` is where the fund is described in full and
 * `href` is the canonical Zeffy donation form URL.
 */
export const funds = {
  general: {
    slug: 'general',
    name: 'General Operating & Community Fund',
    blurb:
      'Contributions to our General Fund provide shared field equipment (cones, scoreboards, medical kits), clinic supplies, community showcase events, and essential non-profit operating support.',
    href: 'https://www.zeffy.com/en-US/donation-form/treasure-valley-ultimate-donation-2',
    page: '/donations-and-dues/general-donation/',
  },
  youth: {
    slug: 'youth',
    name: 'U-20 Youth Development Fund',
    blurb:
      '100% of youth donations are restricted to provide need-based player scholarships, tournament travel subsidies, free introductory clinics, and school equipment starter kits for middle and high school players across the valley.',
    href: 'https://www.zeffy.com/en-US/donation-form/youth-donation',
    page: '/donations-and-dues/youth-donations/',
  },
  sawtooth: {
    slug: 'sawtooth',
    name: 'Sawtooth Ultimate Team Fund',
    blurb:
      'Support Sawtooth as they represent the Treasure Valley at regional and national USA Ultimate tournaments. Fan and supporter contributions directly offset team bid fees, practice facilities, and travel costs.',
    href: 'https://www.zeffy.com/en-US/donation-form/sawtooth-donation',
    page: '/donations-and-dues/sawtooth-donations/',
  },
  sponsorship: {
    slug: 'sponsorship',
    name: 'Battle of Idaho Sponsorship',
    blurb:
      'Underwrites tournament operations so entry fees stay low and the event stays open to every team in the region.',
    href: 'https://www.zeffy.com/en-US/donation-form/battle-of-idaho-sponsorship',
    page: '/battle-of-idaho/battle-of-idaho-sponsorship/',
  },
  dues: {
    slug: 'dues',
    name: 'Team Dues',
    blurb: 'Annual club dues for partner teams under the Treasure Valley Ultimate umbrella.',
    href: 'https://www.zeffy.com/en-US/donation-form/treasure-valley-ultimate-donation',
    page: '/donations-and-dues/team-dues/',
  },
} as const;

export type Fund = (typeof funds)[keyof typeof funds];

/** Presentation order for fund cards. */
export const fundOrder = ['general', 'youth', 'sawtooth', 'sponsorship', 'dues'] as const;

/**
 * The Zeffy form slug for a fund, extracted from its canonical donation URL.
 *
 * Zeffy is addressed by this slug in both the embed endpoint and the hosted
 * page, so deriving it keeps one source of truth: a fund's `href` is written
 * once and everything else follows. Deriving rather than storing a second copy
 * is what stops the embedded form and the outbound link from drifting apart —
 * they once did, when an internal slug was passed here by mistake.
 */
export const zeffySlug = (href: string): string =>
  new URL(href).pathname.replace(/^\/(?:[a-z]{2}-[A-Z]{2}\/)?donation-form\//, '');