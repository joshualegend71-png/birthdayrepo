import { Nav } from './components/Nav.jsx';
import { Celebrants } from './features/celebrants/Celebrants.jsx';
import { EventDetails } from './features/event-details/EventDetails.jsx';
import { Faq } from './features/faq/Faq.jsx';
import { Gallery } from './features/gallery/Gallery.jsx';
import { Gifts } from './features/gifts/Gifts.jsx';
import { Hero } from './features/hero/Hero.jsx';
import { LoveWall } from './features/love-wall/LoveWall.jsx';
import { RsvpForm } from './features/rsvp/RsvpForm.jsx';
import { useEventContent } from './hooks/useEventContent.js';

export default function App() {
  const { content, error, loading } = useEventContent();

  if (loading) {
    return (
      <div className="splash" aria-busy="true">
        <p className="splash__mark">💜</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="splash">
        <p>{error.message}</p>
        <button type="button" className="btn" onClick={() => window.location.reload()}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <>
      <Nav hashtag={content.hashtag} />
      <main>
        <Hero content={content} />
        <Celebrants content={content} />
        <EventDetails content={content} />
        <Gallery images={content.gallery} />
        <RsvpForm content={content} />
        <Faq items={content.faq} />
        <Gifts gifts={content.gifts} contact={content.contact} />
        <LoveWall celebrants={content.celebrants} />
      </main>
      <footer className="footer">
        <p className="footer__hashtag">{content.hashtag}</p>
        <p>
          Enquiries: <a href={`tel:${content.contact.phoneInternational}`}>{content.contact.phone}</a>
        </p>
      </footer>
    </>
  );
}
