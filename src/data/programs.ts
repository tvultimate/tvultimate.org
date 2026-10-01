/**
 * Youth programs, community resources, and the complimentary media
 * services offered to local programs.
 */

export const youth = {
  headline: 'Youth & Community',
  tagline: 'Making competitive Ultimate accessible to every young athlete in the Treasure Valley.',
} as const;

export const programs = [
  {
    id: 'sponsorship',
    title: 'Competitive Club Sponsorship',
    body: 'Providing local teams and players with the support they need to compete regionally and nationally.',
  },
  {
    id: 'youth',
    title: 'Youth Development',
    body: 'Supporting local youth players through financial and training opportunities.',
  },
  {
    id: 'events',
    title: 'Events',
    body: 'Organizing regional tournaments like the annual Battle of Idaho that bring athletes and community together.',
  },
  {
    id: 'clubs',
    title: 'Partner Club Spotlight',
    body: 'We proudly support local competitive teams representing Idaho across the country.',
  },
] as const;

export const clinics = {
  title: 'Clinics',
  body: 'Treasure Valley Ultimate coordinates with partner club teams to provide coaching at clinics that youth can attend. Reach out if you are interested in working with us to get a clinic off the ground.',
} as const;

export const youthFund = {
  title: 'Youth Donation Fund',
  body: 'Support youth ultimate frisbee in the Treasure Valley. All funds are used to support U20 youth players in their ultimate frisbee careers, including travel for tournaments, league and tournament fees, and gear.',
} as const;

export const media = {
  headline: 'Resources & Media',
  eyebrow: 'Aerial game film & event media',
  lede: 'High-quality video and photography should not be a financial barrier for growing sports programs.',
  intro:
    'Treasure Valley Ultimate provides complimentary aerial drone videography and photography to local high school teams, youth programs, community leagues, and partner club teams across the Treasure Valley.',
  body: 'Whether your team needs tactical game film to break down strategy, or your organization wants aerial photos of a local community event, we offer our equipment and time to help elevate local sports.',
} as const;

/** The three media services, each with a title and description. */
export const mediaOfferings = [
  {
    title: 'Tactical Game Film',
    body: 'Full-field, elevated aerial footage of scrimmages, regular-season games, and tournament matchups. Perfect for analyzing spacing, defensive structures, and offensive flow.',
  },
  {
    title: 'Event Photography & Highlights',
    body: 'Aerial photography and video coverage for local tournaments, youth clinics, and showcase events to help programs promote their events and celebrate their players.',
  },
  {
    title: '100% Free for Local Programs',
    body: 'Provided completely free of charge to local schools, youth athletic organizations, and non-profit community sports groups.',
  },
] as const;

export const filmRequest = {
  title: 'How to request film coverage',
  lede: 'Are you a high school coach, youth director, or event organizer interested in getting your game or event filmed?',
  note: 'Because our services are volunteer-operated, coverage is scheduled on a first-come, first-served basis around weather and pilot availability.',
  steps: [
    'Submit our quick request form with your event date, location, and team details.',
    'We confirm pilot availability and coordinate arrival and field logistics.',
    'Raw footage or uploaded YouTube links are delivered directly to team leadership following the event.',
  ],
} as const;