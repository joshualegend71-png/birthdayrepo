import { Countdown } from '../../components/Countdown.jsx';
import { eventEnd, eventStart, formatLongDate } from '../../lib/eventTime.js';

export function Hero({ content }) {
  const { event, celebrants, coverImage } = content;
  const start = eventStart(event);
  const names = celebrants.map((c) => c.firstName).join(' & ');

  return (
    <section id="top" className="hero" style={{ '--hero-image': `url("${coverImage.url}")` }}>
      <div className="hero__overlay" />
      <div className="hero__content">
        <p className="hero__hashtag">{content.hashtag}</p>
        <p className="hero__line">{content.heroLine}</p>
        <h1 className="hero__names">{names}</h1>
        <p className="hero__tagline">{content.tagline}</p>
        <p className="hero__date">{formatLongDate(start, event.timeZone)}</p>
        <Countdown start={start} end={eventEnd(event)} />
        <a className="btn btn--light" href="#rsvp">
          RSVP NOW
        </a>
      </div>
    </section>
  );
}
