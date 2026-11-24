import { Section } from '../../components/Section.jsx';

function CelebrantCard({ celebrant }) {
  const fullName = `${celebrant.title} ${celebrant.firstName} ${celebrant.lastName}`;
  return (
    <article className="celebrant">
      {celebrant.image ? (
        <img className="celebrant__photo" src={celebrant.image} alt={fullName} loading="lazy" />
      ) : (
        <div className="celebrant__monogram" aria-hidden="true">
          {celebrant.firstName[0]}
        </div>
      )}
      <h3 className="celebrant__name">{fullName}</h3>
      <p className="celebrant__age">60 years</p>
    </article>
  );
}

export function Celebrants({ content }) {
  return (
    <Section
      id="celebrants"
      watermark={content.sectionTitles.celebrants}
      eyebrow="The celebrants"
      title={content.title}
    >
      <div className="celebrants">
        {content.celebrants.map((celebrant, index) => (
          <div key={celebrant.id} className="celebrants__item">
            {index > 0 && (
              <span className="celebrants__amp" aria-hidden="true">
                &amp;
              </span>
            )}
            <CelebrantCard celebrant={celebrant} />
          </div>
        ))}
      </div>
      <p className="lead">{content.tagline}</p>
    </Section>
  );
}
