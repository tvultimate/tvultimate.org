/**
 * Partner club teams, and the Sawtooth Ultimate club team with its
 * 2025 season retrospective.
 */

export const partnerClubs = {
  headline: 'Partner Club Teams',
  intro:
    'Treasure Valley Ultimate provides professional infrastructure for teams so players and coaches can focus on competition and player growth.',
  cta: {
    title: 'Interested in partnering?',
    body: 'Are you organizing a club ultimate team in the Treasure Valley? Learn how to affiliate with our 501(c)(3) umbrella.',
  },
} as const;

export const sawtooth = {
  name: 'Sawtooth Ultimate',
  based: 'Boise, Idaho',
  tagline: "The peak of men's competitive frisbee in Idaho",
  intro:
    'Named after the Sawtooth mountain range, Sawtooth competes in the Big Sky Section and the Northwest Region. Our roster is a mix of veteran Treasure Valley players, professional athletes, and local coaches dedicated to elevating the sport in our community.',
  mission:
    'We strive for excellence on the field and regional impact off of it. As we climb the national rankings, we invite players to join our mission of high-level competition and community development.',
} as const;

/** Headline numbers from the 2025 season. */
export const sawtoothStats = [
  { value: '8-8', label: 'Season record' },
  { value: '51', label: 'Players supported' },
  { value: '32', label: 'Practices held' },
  { value: '$1,200', label: 'Donated back to the community' },
] as const;

export interface ReportSection {
  id: string;
  title: string;
  summary: string;
  highlights: { label: string; value: string; note: string }[];
  details?: string[];
}

/** The 2025 year-in-review, grouped by its three narrative acts. */
export const sawtoothReport: ReportSection[] = [
  {
    id: 'competition',
    title: 'I. Sawtooth Competition',
    summary: 'From the first practice to the final point at Regionals, we pushed ourselves.',
    highlights: [
      { label: 'The Roster', value: '51', note: 'Players across the practice squad and roster' },
      { label: 'The Next Gen', value: '8', note: 'Rookies welcomed to the tournament scene' },
      { label: 'The Gap', value: '22 yrs', note: 'Age gap between oldest and youngest scorers' },
      { label: 'The Work', value: '32', note: 'Practices held through the 2025 season' },
      { label: 'The Record', value: '8-8', note: 'Final season record' },
    ],
    details: [
      'Eugene Summer Solstice (3-3): opened the season with a statement, breaking the reigning national champion and #1 ranked Rhino Slam to go up to start the game.',
      'SFI (4-2): a deep run into the bracket, battling into quarters and securing a 5th place finish.',
      'Regionals (1-3): a tough, injury-laden weekend to close the year, but we fought until the last cap.',
    ],
  },
  {
    id: 'community',
    title: 'II. The Local Community',
    summary:
      'Sawtooth is more than a tournament roster; we believe in supporting the community in the Treasure Valley.',
    highlights: [
      { label: 'League', value: '6', note: 'League teams captained by Sawtooth players' },
      { label: 'Youth', value: '5', note: 'High school teams coached by our players' },
      { label: 'Pickup', value: '50+', note: 'Pickup games facilitated year-round' },
    ],
    details: [
      'Sawtooth players captained 6 league teams in 2025, representing 37.5% of all local teams.',
      'Brawl Support: coordinated with Brawl TD to make sure the tournament had what it needed, providing additional matchups and staffing the medical tent.',
      'Film: used our team drone to capture professional-grade shots of local leagues, teams, and community games, including a full tournament recording for our local women’s team and film for a college team.',
    ],
  },
  {
    id: 'bottom-line',
    title: 'III. The Bottom Line',
    summary: 'We believe in investing in the future of the sport.',
    highlights: [{ label: 'Giving Back', value: '$1,200', note: 'Donated to local teams and organizations' }],
    details: [
      'Because of your support, Sawtooth donated over $1,200 to local ultimate teams and organizations in 2025.',
      '2025 was about more than the 8-8 record — the 32 practices, the 8 rookies finding their stride, and the $1,200 put back into the community we love.',
      'Huge thanks to the 51 players who put in the work. Excited to see how 2026 builds on 2025.',
    ],
  },
];