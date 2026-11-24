import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { SubmitRsvp } from '../src/application/use-cases/SubmitRsvp.js';
import { ConflictError, ValidationError } from '../src/domain/errors.js';
import { createRsvp } from '../src/domain/rsvp.js';

const validInput = {
  firstName: '  Ada ',
  lastName: 'Obi',
  email: 'ADA@Example.com',
  phone: '+234 812 345 6789',
  comingFor: 'taiwo',
  relationship: 'Family friend',
  attendance: 'attending',
};

const allowedComingFor = ['taiwo', 'kehinde', 'both'];

describe('createRsvp', () => {
  it('normalises a valid RSVP', () => {
    const rsvp = createRsvp(validInput, { allowedComingFor });
    assert.equal(rsvp.firstName, 'Ada');
    assert.equal(rsvp.email, 'ada@example.com');
    assert.ok(rsvp.id);
  });

  it('reports every invalid field', () => {
    assert.throws(
      () => createRsvp({ email: 'nope', comingFor: 'someone' }, { allowedComingFor }),
      (err) => {
        assert.ok(err instanceof ValidationError);
        for (const field of ['firstName', 'lastName', 'email', 'phone', 'comingFor', 'relationship', 'attendance']) {
          assert.ok(err.errors[field], `expected an error for ${field}`);
        }
        return true;
      },
    );
  });
});

describe('SubmitRsvp', () => {
  const makeUseCase = () => {
    const stored = [];
    const rsvpRepository = {
      findByEmail: async (email) => stored.find((r) => r.email === email),
      add: async (rsvp) => void stored.push(rsvp),
      list: async () => stored,
    };
    const eventContent = { get: () => ({ celebrants: [{ id: 'taiwo' }, { id: 'kehinde' }] }) };
    return { stored, useCase: new SubmitRsvp({ rsvpRepository, eventContent }) };
  };

  it('stores a new RSVP', async () => {
    const { stored, useCase } = makeUseCase();
    const result = await useCase.execute(validInput);
    assert.equal(stored.length, 1);
    assert.equal(result.firstName, 'Ada');
  });

  it('rejects a second RSVP for the same email', async () => {
    const { useCase } = makeUseCase();
    await useCase.execute(validInput);
    await assert.rejects(() => useCase.execute({ ...validInput, email: 'ada@example.com' }), ConflictError);
  });
});
