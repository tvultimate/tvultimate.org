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
 * Brand assets, recovered from the previous site.
 *
 * Provenance for every file — which page it came from and where it is
 * contextually accurate — is recorded in `public/img/manifest.json`. Check
 * `contexts` before placing an image: an image is only correct on the pages
 * listed there. In particular `action` and `roster` are Sawtooth club photos
 * and must not be used as Battle of Idaho tournament imagery.
 */
export const images = {
  /** Organisation mark. Safe anywhere. */
  logo: '/img/logo-tvu.png',
  logoSmall: '/img/logo-tvu-200.png',

  /** Sawtooth mark, luminance converted to alpha. Dark grounds only. */
  sawtoothLogo: '/img/logo-sawtooth-mark.png',
  sawtoothLogoSmall: '/img/logo-sawtooth-400.png',
  /** Sawtooth mark on its original black field. For light grounds. */
  sawtoothLogoOpaque: '/img/logo-sawtooth.png',

  /** Boise skyline silhouette, inverted in CSS for the dark footer. */
  skyline: '/img/boise-skyline.png',

  /** Sawtooth roster posing on the field. Club-team context only. */
  roster: '/img/team-roster.jpg',
  /** Club team huddle with the Boise foothills behind. Club-team context. */
  huddle: '/img/team-huddle.jpg',
  /** A Sawtooth player diving for a disc. Club-team context, NOT tournament. */
  action: '/img/action-lay.jpg',
  /** Overhead aerial of a circle of players. Fits youth and media services. */
  aerialCircle: '/img/aerial-circle.jpg',
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
 * Donation destinations. `page` is where the fund is described in full;
 * `href` is the external donation form.
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