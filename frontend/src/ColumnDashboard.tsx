import type { ReactNode } from 'react';
import type { Currency, Dashboard } from './domain';
import { formatAmount } from './domain';
import type { Locale } from './locales';
import { catalogs } from './locales';
import { Icon } from './components/Icon';
import './ColumnDashboard.css';

export type ColumnDashboardProps = {
  dashboard: Dashboard;
  selected: Currency | null;
  onSelect: (currency: Currency) => void;
  onOpen: (action: string, currency?: Currency) => void;
  history: ReactNode;
  locale: Locale;
};

const accountNodeIds: Record<Currency, string> = {
  EUR: '2716:949', USD: '2716:968', GBP: '2716:987', CHF: '2716:1006',
  USDC: '2716:1028', BTC: '2716:1047', ETH: '2716:1066', SOL: '2716:1085', XRP: '2716:1104',
};

/** Visual composition of Figma 2716:872; account state and transactions stay shared. */
export function ColumnDashboard({ dashboard, selected, onSelect, onOpen, history, locale }: ColumnDashboardProps) {
  const t = catalogs[locale];
  const account = dashboard.accounts.find(item => item.currency === selected);

  return (
    <div className="column-dashboard" data-node-id="2716:1223">
      <div className="column-accounts" data-node-id="2716:945">
        {(['fiat', 'crypto'] as const).map(kind => (
          <section className={`column-account-group ${kind}`} key={kind} aria-labelledby={`column-${kind}-heading`}>
            <h2 id={`column-${kind}-heading`}>{kind === 'fiat' ? t.money : t.crypto}</h2>
            <div className="column-account-list">
              {dashboard.accounts.filter(item => item.kind === kind).map(item => (
                <button
                  className={`column-account${selected === item.currency ? ' is-selected' : ''}`}
                  data-node-id={accountNodeIds[item.currency]}
                  data-currency={item.currency}
                  key={item.currency}
                  aria-label={`${t.selectedHistory} · ${item.currency}`}
                  aria-pressed={selected === item.currency}
                  onClick={() => onSelect(item.currency)}
                >
                  <span className="column-account-label"><span className="currency-code">{item.currency}</span><span className="currency-name"> · {t.currency[item.currency]}</span></span>
                  <span className="column-account-balance">{formatAmount(item.units, item.decimals, item.currency, locale)}</span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="column-operations" data-node-id="2716:1224" data-account-selected={Boolean(account)}>
        {account && (
          <section className="column-selected-account" aria-labelledby="column-selected-heading" data-node-id="2724:1025">
            <div className="column-selected-heading" data-node-id="2724:1009">
              <h2 id="column-selected-heading">
                {account.kind === 'crypto' ? t.selectedCryptoAccount : t.account} {account.currency} · {t.currency[account.currency]}
              </h2>
              <button className="text-link column-details" onClick={() => onOpen('receiving-details', account.currency)}>
                {account.kind === 'crypto' ? t.address : t.details}
              </button>
            </div>
            <p className="column-selected-balance" data-node-id="2724:1021">
              {formatAmount(account.units, account.decimals, account.currency, locale)}
            </p>
            <div className="column-selected-actions" data-node-id="2724:1010">
              {(['fund', 'transfer'] as const).map(action => (
                <button key={action} onClick={() => onOpen(action, account.currency)} aria-label={`${t[action]} · ${account.currency}`}>
                  <span className="column-action-circle">
                    <Icon name={action === 'fund' ? 'plus' : 'transfer'} size={16}/>
                  </span>
                  <span className="column-action-label">{t[action]}</span>
                </button>
              ))}
            </div>
          </section>
        )}
        <div className="column-history" data-node-id="2724:960">{history}</div>
      </div>
    </div>
  );
}
