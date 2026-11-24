const at = (event, time) => new Date(`${event.date}T${time}:00${event.utcOffset}`);

export const eventStart = (event) => at(event, event.startTime);
export const eventEnd = (event) => at(event, event.endTime);

export const formatLongDate = (date, timeZone) =>
  new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone,
  }).format(date);

export const formatTime = (date, timeZone) =>
  new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone }).format(date);

export const formatTimeRange = (event) =>
  `${formatTime(eventStart(event), event.timeZone)} – ${formatTime(eventEnd(event), event.timeZone)}`;
