import { useState } from 'react';
import { api } from '../../api/client.js';
import { Section } from '../../components/Section.jsx';

const EMPTY = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  comingFor: '',
  relationship: '',
  attendance: '',
  message: '',
};

function Field({ label, name, error, optional, children }) {
  return (
    <label className={`field ${error ? 'field--error' : ''}`} htmlFor={name}>
      <span className="field__label">
        {label}
        {optional && <span className="field__optional"> (optional)</span>}
      </span>
      {children}
      {error && (
        <span className="field__error" role="alert">
          {error}
        </span>
      )}
    </label>
  );
}

export function RsvpForm({ content }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const comingForOptions = [
    ...content.celebrants.map((c) => ({ value: c.id, label: `${c.title} ${c.firstName}` })),
    { value: 'both', label: content.celebrants.map((c) => c.firstName).join(' & ') },
  ];

  const update = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setStatus({ state: 'sending', message: '' });
    try {
      const result = await api.submitRsvp(values);
      setStatus({
        state: 'done',
        message:
          result.attendance === 'attending'
            ? `Thank you, ${result.firstName}! We can't wait to celebrate with you. Please come with your invitation.`
            : `Thank you for letting us know, ${result.firstName}. You will be missed.`,
      });
      setValues(EMPTY);
    } catch (error) {
      setErrors(error.errors ?? {});
      setStatus({ state: 'error', message: error.message });
    }
  };

  const input = (name, props = {}) => (
    <input id={name} name={name} value={values[name]} onChange={update} aria-invalid={Boolean(errors[name])} {...props} />
  );

  return (
    <Section id="rsvp" eyebrow="Kindly respond" title="RSVP" tone="tint">
      <p className="lead">
        RSVP is required. This invitation admits <strong>one guest only</strong>.
      </p>

      {status.state === 'done' ? (
        <div className="card notice notice--success" role="status">
          <p>{status.message}</p>
          <button type="button" className="btn" onClick={() => setStatus({ state: 'idle', message: '' })}>
            Submit another RSVP
          </button>
        </div>
      ) : (
        <form className="card form" onSubmit={submit} noValidate>
          <div className="form__grid">
            <Field label="First name" name="firstName" error={errors.firstName}>
              {input('firstName', { autoComplete: 'given-name', placeholder: 'E.g. Funmi' })}
            </Field>
            <Field label="Last name" name="lastName" error={errors.lastName}>
              {input('lastName', { autoComplete: 'family-name', placeholder: 'E.g. Adeyemi' })}
            </Field>
            <Field label="Email address" name="email" error={errors.email}>
              {input('email', { type: 'email', autoComplete: 'email', placeholder: 'yourname@gmail.com' })}
            </Field>
            <Field label="Phone number" name="phone" error={errors.phone}>
              {input('phone', { type: 'tel', autoComplete: 'tel', placeholder: '+234 812 345 6789' })}
            </Field>
            <Field label="Coming for" name="comingFor" error={errors.comingFor}>
              <select id="comingFor" name="comingFor" value={values.comingFor} onChange={update} aria-invalid={Boolean(errors.comingFor)}>
                <option value="" disabled>
                  Select who you are coming for
                </option>
                {comingForOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Relationship" name="relationship" error={errors.relationship}>
              {input('relationship', { placeholder: 'E.g. Family friend, church member, colleague' })}
            </Field>
            <Field label="Address" name="address" error={errors.address} optional>
              {input('address', { autoComplete: 'street-address', placeholder: 'For delivery of access cards and more' })}
            </Field>
          </div>

          <fieldset className={`attendance ${errors.attendance ? 'field--error' : ''}`}>
            <legend className="field__label">Will you attend?</legend>
            <label className="choice">
              <input type="radio" name="attendance" value="attending" checked={values.attendance === 'attending'} onChange={update} />
              Joyfully attending
            </label>
            <label className="choice">
              <input type="radio" name="attendance" value="declined" checked={values.attendance === 'declined'} onChange={update} />
              Regretfully declining
            </label>
            {errors.attendance && (
              <span className="field__error" role="alert">
                {errors.attendance}
              </span>
            )}
          </fieldset>

          <Field label="Note to the celebrants or dietary needs" name="message" error={errors.message} optional>
            <textarea id="message" name="message" rows={3} maxLength={300} value={values.message} onChange={update} />
          </Field>

          {status.state === 'error' && (
            <p className="notice notice--error" role="alert">
              {status.message}
            </p>
          )}

          <button type="submit" className="btn btn--solid" disabled={status.state === 'sending'}>
            {status.state === 'sending' ? 'Sending…' : 'Send RSVP'}
          </button>
        </form>
      )}
    </Section>
  );
}
