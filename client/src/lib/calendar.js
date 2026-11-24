import { eventEnd, eventStart } from './eventTime.js';

const utcStamp = (date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const icsEscape = (text) => text.replace(/([\\,;])/g, '\\$1').replace(/\n/g, '\\n');

const describe = (content) => ({
  title: `${content.hashtag} · ${content.event.name}`,
  location: `${content.event.venue}, ${content.event.address}`,
  details: `${content.tagline}. ${content.entryRules.join(' ')}`,
});

export function googleCalendarUrl(content) {
  const { title, location, details } = describe(content);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${utcStamp(eventStart(content.event))}/${utcStamp(eventEnd(content.event))}`,
    location,
    details,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

export function downloadIcs(content) {
  const { title, location, details } = describe(content);
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GracefullySixty//EN',
    'BEGIN:VEVENT',
    `UID:${content.event.date}-gracefullysixty`,
    `DTSTAMP:${utcStamp(new Date())}`,
    `DTSTART:${utcStamp(eventStart(content.event))}`,
    `DTEND:${utcStamp(eventEnd(content.event))}`,
    `SUMMARY:${icsEscape(title)}`,
    `LOCATION:${icsEscape(location)}`,
    `DESCRIPTION:${icsEscape(details)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  const link = Object.assign(document.createElement('a'), { href: url, download: 'gracefully-sixty.ics' });
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
