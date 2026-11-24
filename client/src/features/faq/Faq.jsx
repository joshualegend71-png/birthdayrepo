import { Section } from '../../components/Section.jsx';

export function Faq({ items }) {
  return (
    <Section id="faq" eyebrow="Good to know" title="Questions">
      <div className="faq">
        {items.map((item) => (
          <details key={item.question} className="faq__item">
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
