import { Section } from '../../components/Section.jsx';
import { downloadIcs, googleCalendarUrl } from '../../lib/calendar.js';
import { eventStart, formatLongDate, formatTimeRange } from '../../lib/eventTime.js';

export function EventDetails({ content }) {
  const { event, dressCode, entryRules } = content;

  return (
    <Section id="details" watermark={content.sectionTitles.event} eyebrow="Save the date" title="The Celebration" tone="tint">
      <div className="details-grid">
        <article className="card event-card">
          <p className="event-card__type">{event.name}</p>
          <dl className="event-card__facts">
            <div>
              <dt>When</dt>
              <dd>
                {formatLongDate(eventStart(event), event.timeZone)}
                <br />
                {formatTimeRange(event)}
              </dd>
            </div>
            <div>
              <dt>Where</dt>
              <dd>
                {event.venue}
                <br />
                {event.address}
              </dd>
            </div>
          </dl>
          <div className="btn-row">
            <a className="btn" href={event.mapsUrl} target="_blank" rel="noreferrer">
              Open in maps
            </a>
            <a className="btn" href={googleCalendarUrl(content)} target="_blank" rel="noreferrer">
              Google Calendar
            </a>
            <button type="button" className="btn" onClick={() => downloadIcs(content)}>
              Add to calendar (.ics)
            </button>
          </div>
        </article>

        <article className="card">
          <h3 className="card__title">Colours of the day</h3>
          <ul className="swatches">
            {dressCode.colours.map((colour) => (
              <li key={colour.hex} className="swatch">
                <span className="swatch__chip" style={{ background: colour.hex }} />
                <span>{colour.name}</span>
              </li>
            ))}
          </ul>
          <p>{dressCode.note}</p>
        </article>

        <article className="card">
          <h3 className="card__title">On arrival</h3>
          <ul className="rules">
            {entryRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </article>
      </div>
    </Section>
  );
}
