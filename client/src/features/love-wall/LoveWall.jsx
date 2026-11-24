import { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import { Section } from '../../components/Section.jsx';

const formatWhen = (iso) =>
  new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso));

export function LoveWall({ celebrants }) {
  const [notes, setNotes] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [values, setValues] = useState({ name: '', message: '' });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    api
      .listNotes()
      .then(setNotes)
      .catch((error) => setLoadError(error.message));
  }, []);

  const update = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setSending(true);
    setFormError('');
    try {
      const note = await api.postNote(values);
      setNotes((current) => [note, ...current]);
      setValues({ name: '', message: '' });
    } catch (error) {
      setErrors(error.errors ?? {});
      setFormError(error.message);
    } finally {
      setSending(false);
    }
  };

  const names = celebrants.map((c) => c.firstName).join(' & ');

  return (
    <Section id="love-wall" eyebrow="Leave a note" title="Love Wall">
      <p className="lead">Share a prayer, a memory or a birthday wish for {names}.</p>

      <form className="card form love-form" onSubmit={submit} noValidate>
        <label className={`field ${errors.name ? 'field--error' : ''}`} htmlFor="note-name">
          <span className="field__label">Your name</span>
          <input id="note-name" name="name" value={values.name} onChange={update} maxLength={60} autoComplete="name" />
          {errors.name && <span className="field__error">{errors.name}</span>}
        </label>
        <label className={`field ${errors.message ? 'field--error' : ''}`} htmlFor="note-message">
          <span className="field__label">Your message</span>
          <textarea id="note-message" name="message" rows={4} maxLength={500} value={values.message} onChange={update} />
          {errors.message && <span className="field__error">{errors.message}</span>}
        </label>
        {formError && !Object.keys(errors).length && (
          <p className="notice notice--error" role="alert">
            {formError}
          </p>
        )}
        <button type="submit" className="btn btn--solid" disabled={sending}>
          {sending ? 'Posting…' : 'Post to the Love Wall'}
        </button>
      </form>

      {loadError && <p className="notice notice--error">{loadError}</p>}

      {notes.length === 0 && !loadError ? (
        <p className="empty">Be the first to leave a note 💜</p>
      ) : (
        <ul className="notes">
          {notes.map((note) => (
            <li key={note.id} className="note">
              <p className="note__message">{note.message}</p>
              <p className="note__meta">
                — {note.name} · {formatWhen(note.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
