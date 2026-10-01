/**
 * Division schedule as an interactive tab set.
 *
 * A React island because only one division's details should be in the DOM
 * at a time on mobile, and the tab pattern is far cleaner with real state
 * than with radio inputs and CSS.
 */

import { useId, useState } from 'react';
import type { Division } from '../../data/tournament';

interface Props {
  divisions: Division[];
}

export default function DivisionTabs({ divisions }: Props) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const current = divisions[active];

  if (!current) return null;

  return (
    <div className="tabs">
      <div className="tabs__list" role="tablist" aria-label="Tournament divisions">
        {divisions.map((division, index) => (
          <button
            key={division.id}
            type="button"
            role="tab"
            id={`${baseId}-tab-${division.id}`}
            aria-selected={active === index}
            aria-controls={`${baseId}-panel-${division.id}`}
            tabIndex={active === index ? 0 : -1}
            className={`tabs__tab ${active === index ? 'is-active' : ''}`}
            onClick={() => setActive(index)}
            onKeyDown={(event) => {
              const last = divisions.length - 1;
              let next: number | null = null;
              if (event.key === 'ArrowRight') next = active === last ? 0 : active + 1;
              if (event.key === 'ArrowLeft') next = active === 0 ? last : active - 1;
              if (event.key === 'Home') next = 0;
              if (event.key === 'End') next = last;
              if (next === null) return;
              event.preventDefault();
              setActive(next);
              document.getElementById(`${baseId}-tab-${divisions[next].id}`)?.focus();
            }}
          >
            <span className="tabs__tab-name">{division.name}</span>
            <span className="tabs__tab-dates">{division.dates}</span>
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel-${current.id}`}
        aria-labelledby={`${baseId}-tab-${current.id}`}
        className="tabs__panel"
        tabIndex={0}
      >
        <dl className="tabs__details">
          <div className="tabs__row">
            <dt>Who can play</dt>
            <dd>{current.who}</dd>
          </div>
          <div className="tabs__row">
            <dt>Division rules</dt>
            <dd>{current.rules}</dd>
          </div>
        </dl>

        <div className="tabs__schedule">
          <p className="tabs__schedule-heading">Schedule</p>
          <ul className="tabs__schedule-list">
            {current.schedule.map((slot) => (
              <li key={slot.day}>
                <span className="tabs__day">{slot.day}</span>
                <span className="tabs__time">{slot.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}