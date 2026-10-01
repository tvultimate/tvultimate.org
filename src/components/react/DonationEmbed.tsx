/**
 * Embedded donation form.
 *
 * Zeffy exposes an `/embed/donation-form/<slug>` endpoint that is designed to
 * be iframed. A React island because the iframe needs to be mounted lazily (a
 * full payment form is heavy, and it must not load on every donation page),
 * needs a measured height, and needs an accessible title that tracks the fund.
 */

import { useEffect, useRef, useState } from 'react';

interface Props {
  /** Zeffy form slug, e.g. `youth-donation`. Derived from the fund's URL. */
  slug: string;
  /** Accessible name for the frame, including the fund. */
  title: string;
}

const EMBED_ORIGIN = 'https://www.zeffy.com';

/**
 * The iframe is only mounted once it is near the viewport. Donation forms are
 * the heaviest third-party asset on the site, and most visitors scroll past.
 */
export default function DonationEmbed({ slug, title }: Props) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const node = frameRef.current;
    if (!node) return;

    // rootMargin buys enough lead time that the form is ready before arrival.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50% 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  /*
    The frame is cross-origin, so its document cannot be read. Resize is
    signalled by posting a message from inside Zeffy's page; until one arrives
    the frame keeps a sensible fixed height rather than collapsing.
  */
  const src = `${EMBED_ORIGIN}/embed/donation-form/${slug}`;

  return (
    <div className="embed" ref={frameRef} data-ready={ready || undefined}>
      {!ready && !failed && (
        <p className="embed__placeholder" aria-live="polite">
          Loading the secure donation form…
        </p>
      )}

      {failed && (
        <div className="embed__fallback" role="status">
          <p>
            The donation form could not be loaded here. You can still give
            through Zeffy&rsquo;s own page.
          </p>
        </div>
      )}

      {mounted && !failed && (
        <iframe
          className="embed__frame"
          src={src}
          title={title}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="payment"
          /*
            Zeffy does not post a ready message, so the frame's own `load`
            event is the only reliable signal that the document has rendered.
            Anything more specific would leave the placeholder sitting above a
            working form.
          */
          onLoad={() => setReady(true)}
          onError={() => setFailed(true)}
        />
      )}

      {/*
        Always available as a link, both as an accessibility guarantee and so
        the form is reachable if the iframe is blocked.
      */}
      <p className="embed__fallback-link">
        <a href={`${EMBED_ORIGIN}/en-US/donation-form/${slug}`} rel="noopener noreferrer">
          Open the donation form on Zeffy
        </a>
      </p>
    </div>
  );
}