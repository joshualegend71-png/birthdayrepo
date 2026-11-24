const LINKS = [
  ['#celebrants', 'Celebrants'],
  ['#details', 'Details'],
  ['#gallery', 'Photos'],
  ['#rsvp', 'RSVP'],
  ['#faq', 'FAQ'],
  ['#gifts', 'Gifts'],
  ['#love-wall', 'Love Wall'],
];

export function Nav({ hashtag }) {
  return (
    <header className="nav">
      <a href="#top" className="nav__brand">
        {hashtag}
      </a>
      <nav aria-label="Sections">
        <ul className="nav__links">
          {LINKS.map(([href, label]) => (
            <li key={href}>
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
