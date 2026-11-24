/** Page section with the big decorative word used by the wedding layout (e.g. "GRACE"). */
export function Section({ id, watermark, eyebrow, title, tone = 'light', children }) {
  return (
    <section id={id} className={`section section--${tone}`} aria-labelledby={`${id}-title`}>
      {watermark && (
        <span className="section__watermark" aria-hidden="true">
          {watermark}
        </span>
      )}
      <div className="section__inner">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 id={`${id}-title`} className="section__title">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}
