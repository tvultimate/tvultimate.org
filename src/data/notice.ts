/**
 * The site-wide notice strip.
 *
 * Ulticentral runs registration for every event we host, and it is currently
 * down. This is content, not presentation: the component that renders it is
 * generic, so ending one outage and starting another is an edit here.
 *
 * The message does two jobs: it says what is broken, and it says what a reader
 * can still do about it. Both registration forms are ours, so the notice links
 * them directly rather than sending anyone to a site that is not answering.
 */

import { links } from './org';

/** A run of notice text, or a link inside it. */
export type NoticePart = string | { label: string; href: string };

export const notice = {
  /** Flip to `false` once the platform is back. */
  enabled: true,

  /**
   * Dismissal is remembered per device under a key built from this id, so the
   * same visitor is not told the same thing twice. Bumping it re-shows the
   * notice to everyone who had cleared it — which is what you want when the
   * message changes, since the old dismissal was an answer to older copy.
   */
  id: 'ulticentral-outage-2026-10-registration-open',

  title: 'Ulticentral is down',
  body: [
    'All Ulticentral sites are down, possibly through the weekend. You can still register with us — as a ',
    { label: 'team', href: links.battleTeamRegistration },
    ', or as an ',
    { label: 'individual', href: links.battleIndividualRegistration },
    '. Players joining an existing team have to wait for Ulticentral.',
  ] as readonly NoticePart[],
} as const;

/** Storage key for "this device has cleared the current notice". */
export const noticeDismissKey = `tvultimate:notice-dismissed:${notice.id}`;
