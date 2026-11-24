import { useState } from 'react';
import { Section } from '../../components/Section.jsx';

function AccountCard({ account }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(account.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the number is still visible to copy by hand.
    }
  };

  return (
    <article className="card account">
      <p className="account__bank">{account.bankName}</p>
      <p className="account__number">{account.accountNumber}</p>
      <p className="account__name">{account.accountName}</p>
      <button type="button" className="btn" onClick={copy}>
        {copied ? 'Copied!' : 'Copy number'}
      </button>
    </article>
  );
}

export function Gifts({ gifts, contact }) {
  const hasAccounts = gifts.accounts.length > 0;

  return (
    <Section id="gifts" eyebrow="With love" title="Gifts" tone="tint">
      <p className="lead">{gifts.message}</p>

      {hasAccounts && (
        <div className="accounts">
          {gifts.accounts.map((account) => (
            <AccountCard key={account.accountNumber} account={account} />
          ))}
        </div>
      )}

      <div className="btn-row btn-row--center">
        {gifts.wishlistUrl && (
          <a className="btn" href={gifts.wishlistUrl} target="_blank" rel="noreferrer">
            View wishlist
          </a>
        )}
        {!hasAccounts && (
          <a className="btn" href={`tel:${contact.phoneInternational}`}>
            Call {contact.phone} for gift details
          </a>
        )}
      </div>
    </Section>
  );
}
