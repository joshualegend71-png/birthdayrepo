import { Section } from '../../components/Section.jsx';

export function Gallery({ images }) {
  if (!images?.length) return null;

  return (
    <Section id="gallery" eyebrow="The photo wall" title="Moments">
      <ul className="gallery">
        {images.map((image) => (
          <li key={image.url} className="gallery__item">
            <a href={image.url} target="_blank" rel="noreferrer">
              <img src={image.url} alt={image.alt} loading="lazy" />
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
