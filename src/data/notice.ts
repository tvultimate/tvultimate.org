/**
 * The site-wide notice strip.
 *
 * Ulticentral runs registration for every event we host. This is content, not
 * presentation: the component that renders it is generic, so ending one
 * outage and starting another is an edit here.
 *
 * Off now that Ulticentral is answering again. The copy below is the last
 * notice we ran; rewrite `title` and `body`, and bump `id`, before setting
 * `enabled` again, or the strip will repeat a message that is no longer true.
 */

import { links } from './org';

/** A run of notice text, or a link inside it. */
export type NoticePart = string | { label: string; href: string };

export const notice = {
  /** Off: Ulticentral is answering again. */
  enabled: false,

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
    { label: 'team', href: links.battleRegistration },
    ', or as an ',
    { label: 'individual', href: links.battleRegistration },
    '. Players joining an existing team have to wait for Ulticentral.',
  ] as readonly NoticePart[],
} as const;

/** Storage key for "this device has cleared the current notice". */
export const noticeDismissKey = `tvultimate:notice-dismissed:${notice.id}`;
