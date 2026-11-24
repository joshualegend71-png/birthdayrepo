import { useEffect, useState } from 'react';

const UNITS = [
  ['days', 86_400_000],
  ['hours', 3_600_000],
  ['mins', 60_000],
  ['secs', 1_000],
];

function split(ms) {
  let rest = Math.max(0, ms);
  return UNITS.map(([label, size]) => {
    const value = Math.floor(rest / size);
    rest -= value * size;
    return { label, value };
  });
}

export function Countdown({ start, end }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (now >= end.getTime()) {
    return <p className="countdown__done">Thank you for celebrating with us 💜</p>;
  }
  if (now >= start.getTime()) {
    return <p className="countdown__done">The celebration is happening now!</p>;
  }

  return (
    <div className="countdown" role="timer" aria-label="Time until the celebration">
      {split(start.getTime() - now).map(({ label, value }) => (
        <div key={label} className="countdown__unit">
          <span className="countdown__value">{String(value).padStart(2, '0')}</span>
          <span className="countdown__label">{label}</span>
        </div>
      ))}
    </div>
  );
}
