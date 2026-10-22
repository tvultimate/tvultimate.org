/**
 * The site-wide notice strip.
 *
 * Ulticentral runs registration for every event we host, and it is currently
 * down. This is content, not presentation: the component that renders it is
 * generic, so ending one outage and starting another is an edit here.
 */
export const notice = {
  /** Flip to `false` once the platform is back. */
  enabled: true,

  /**
   * Dismissal is remembered per device under a key built from this id, so the
   * same visitor is not told the same thing twice. Bumping it re-shows the
   * notice to everyone who had cleared it — which is what you want for a new
   * outage, since the old dismissal has nothing to do with the new one.
   */
  id: 'ulticentral-outage-2026-10',

  title: 'Registration site outage',
  body: 'Ulticentral and all related sites are down, and may stay down through the weekend. We are aware and monitoring it.',
} as const;

/** Storage key for "this device has cleared the current notice". */
export const noticeDismissKey = `tvultimate:notice-dismissed:${notice.id}`;
