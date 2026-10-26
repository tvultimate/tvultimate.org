/**
 * The index behind `/admin/`: every page and destination the organisation
 * runs, including the ones that never appear in the menu or the sitemap.
 *
 * Assembled from the same modules the site renders from — the navigation, the
 * policy list, the campaign landings, the registration links — so a new page
 * shows up here by existing, not by someone remembering to add it twice.
 *
 * A handful of paths are listed by hand because nothing else owns them: the
 * home page, the 404, the sitemap and robots files.
 */

import { campaignLandings } from './campaign';
import { navSections } from './navigation';
import { policies, policyPath } from './policies';
import { contact, documents, funds, links } from './org';

export interface AdminLink {
  label: string;
  href: string;
  /** Why it is here, or what it is for. */
  note?: string;
}

export interface AdminGroup {
  id: string;
  title: string;
  summary: string;
  links: readonly AdminLink[];
}

/** Landing pages that are reached from ads only, never from the menu. */
const campaignGroup: AdminGroup = {
  id: 'campaigns',
  title: 'Ad landing pages',
  summary:
    'Published for paid search and absent from the sitemap on purpose. Noindex, and not linked from navigation.',
  links: campaignLandings.map((page) => ({
    label: page.title,
    href: page.path,
    note: 'Not in the sitemap · noindex',
  })),
};

/** The published pages, in the order the navigation presents them. */
const pageGroup: AdminGroup = {
  id: 'pages',
  title: 'Site pages',
  summary: 'Everything in the main navigation, plus the home page.',
  links: [
    { label: 'Home', href: '/' },
    ...navSections.flatMap((section) => [
      { label: section.label, href: section.href },
      ...(section.children ?? []).map((child) => ({
        label: `${section.label} · ${child.label}`,
        href: child.href,
      })),
    ]),
    {
      label: '404',
      href: '/404/',
      note: 'The not-found page, served for any missing URL',
    },
  ],
};

const policyGroup: AdminGroup = {
  id: 'policies',
  title: 'Policies and agreements',
  summary: 'Reached from the footer index and by direct URL, not from the menu.',
  links: policies.map((policy) => ({
    label: policy.title,
    href: policyPath(policy.slug),
  })),
};

/**
 * Off-site destinations: the registration page and the tools we point people
 * at. Ulticentral runs registration again, so one link covers teams, free
 * agents and players joining a roster.
 */
const destinationGroup: AdminGroup = {
  id: 'destinations',
  title: 'Registration and platforms',
  summary: 'The forms and platforms our buttons send people to.',
  links: [
    {
      label: 'Battle of Idaho registration',
      href: links.battleRegistration,
      note: 'Teams, free agents, youth and adult — all start here',
    },
    { label: 'Discord', href: links.discord },
    { label: 'YouTube', href: links.youtube },
    { label: 'Heroes Park on Google Maps', href: links.maps },
  ],
};

const fundGroup: AdminGroup = {
  id: 'funds',
  title: 'Donation forms',
  summary: 'One Zeffy form per fund, each also described on its own page.',
  links: Object.values(funds).map((fund) => ({
    label: `${fund.name} — Zeffy form`,
    href: fund.href,
  })),
};

const contactGroup: AdminGroup = {
  id: 'contacts',
  title: 'Contact addresses',
  summary: 'Who to send a reader to, by subject.',
  links: Object.values(contact).map((address) => ({
    label: address.label,
    href: `mailto:${address.email}`,
    note: address.email,
  })),
};

const fileGroup: AdminGroup = {
  id: 'files',
  title: 'Files and machine-readable',
  summary: 'Fixed URLs a crawler or a reader may be given directly.',
  links: [
    {
      label: 'Sitemap index',
      href: '/sitemap-index.xml',
      note: 'Generated at build time, minus the ad pages',
    },
    { label: 'robots.txt', href: '/robots.txt' },
    {
      label: documents.clubPartnershipAgreement.label,
      href: documents.clubPartnershipAgreement.file,
      note: documents.clubPartnershipAgreement.detail,
    },
  ],
};

export const adminGroups: readonly AdminGroup[] = [
  campaignGroup,
  pageGroup,
  policyGroup,
  destinationGroup,
  fundGroup,
  contactGroup,
  fileGroup,
];

/** Total rows, for the counter in the panel. */
export const adminLinkCount = adminGroups.reduce(
  (total, group) => total + group.links.length,
  0,
);

/**
 * The unlock phrase for `/admin/`.
 *
 * This is a client-side gate, not authentication. The page is static HTML on a
 * CDN: anyone who reads the bundle can find this string, and every link below
 * is already public. It keeps the index out of the way of a visitor who
 * guesses the URL — nothing more. Do not put anything private behind it.
 */
export const adminPassword = 'This is a test password.';

/** Remembers that this browser has unlocked the index. */
export const adminUnlockKey = 'tvultimate:admin-unlocked';
