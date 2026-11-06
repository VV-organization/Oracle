import type { Locale } from '../locales';
import type { RegisteredAccount } from './account';
export const accountCopy = {
 ru: { personal: 'Личный аккаунт', business: 'Для бизнеса', identity: 'Проверка личности не начата', organization: 'Проверка организации не начата', requirement: 'Пополнение и переводы будут доступны после проверки.', start: 'Начать проверку', unavailable: 'Проверка временно недоступна', blocked: 'Сначала необходимо пройти проверку личности и, для бизнеса, организации.' },
 en: { personal: 'Personal account', business: 'Business account', identity: 'Identity verification not started', organization: 'Business verification not started', requirement: 'Funding and transfers will be available after verification.', start: 'Start verification', unavailable: 'Verification is temporarily unavailable', blocked: 'Identity verification and, for businesses, organization verification are required first.' },
} as const;
export function AccountRestriction({account,locale}:{account:RegisteredAccount;locale:Locale}) {
 const t=accountCopy[locale];
 return <aside className="account-restriction" aria-label={t[account.type]}>
  <strong>{t[account.type]}</strong>{account.type === 'business' && <span>{account.organization} · {account.registrationNumber}</span>}
  <p>{t.requirement}</p>
  {(['identity',...(account.type === 'business' ? ['organization'] as const : [])] as const).map(kind=><div className="account-verification" key={kind}><span>{t[kind]}</span><button disabled aria-describedby={`verification-${kind}-unavailable`}>{t.start}</button><span id={`verification-${kind}-unavailable`}>{t.unavailable}</span></div>)}
 </aside>;
}
