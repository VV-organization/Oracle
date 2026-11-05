import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/inter/cyrillic-400.css';
import '@fontsource/inter/cyrillic-500.css';
import '@fontsource/inter/cyrillic-600.css';
import { filterOperations, formatAmount, toggleAccount } from './domain';
import type { Account, Currency, Dashboard, Operation } from './domain';
import { catalogs, readLocale } from './locales';
import { mockDashboardService } from './services';
import { WalletDashboard } from './wallet/WalletDashboard';
import { ColumnDashboard } from './ColumnDashboard';
import { Icon } from './components/Icon';
import { ReceivingDialog } from './components/ReceivingDialog';
import './styles.css';
import './themes.css';

const locale = readLocale();
const t = catalogs[locale];
const bundledVariant = document.documentElement.dataset.variant;
const requestedLayout = bundledVariant === 'orange' ? 'columns' : bundledVariant === 'green' ? 'cards' : new URLSearchParams(location.search).get('layout');
const layout = requestedLayout === 'columns' ? 'columns' : requestedLayout === 'baseline' ? 'baseline' : 'cards';
const requestedTheme = bundledVariant ?? new URLSearchParams(location.search).get('theme');
const theme = layout!=='baseline' && (requestedTheme==='green'||requestedTheme==='orange'||requestedTheme==='mixed') ? (layout==='columns'?'orange':'green') : 'neutral';
document.documentElement.dataset.theme = theme;
if(requestedTheme && requestedTheme!==theme && theme!=='neutral'){
  const canonicalUrl=new URL(location.href);canonicalUrl.searchParams.set('theme',theme);
  history.replaceState(null,'',canonicalUrl);
}
const compactCardNodes: Record<Currency,string> = {EUR:'2723:1899',USD:'2723:1916',GBP:'2723:1933',CHF:'2723:1950',USDC:'2723:1970',BTC:'2723:1987',ETH:'2723:2004',SOL:'2723:2021',XRP:'2723:2038'};
const navigation = ['home','payments','cards','history','help','settings'] as const;
function openDependency(action: string, currency?: Currency) {
  window.dispatchEvent(new CustomEvent('oraclepay:open-transition', {detail: {action, currency}}));
  // Temporary development boundary. No invented destination or simulated payment.
}
function AccountCard({account, selected, onSelect}: {account:Account; selected:boolean; onSelect:()=>void}) {
  return <article className={`account-card${selected ? ' selected' : ''}`} data-node-id={layout==='cards'?compactCardNodes[account.currency]:account.nodeId} data-currency={account.currency}>
    <button className="account-select" aria-label={`${t.selectedHistory} · ${account.currency}`} aria-pressed={selected} onClick={onSelect}/>
    <div className="account-top"><span className="account-currency"><span className="currency-code">{account.currency}</span><span className="currency-name"> · {t.currency[account.currency]}</span></span>
      <button className="text-link account-details" onClick={()=>openDependency('receiving-details', account.currency)}>{account.kind === 'fiat' ? t.details : t.address}</button>
    </div>
    {layout==='baseline' && <p className="balance">{formatAmount(account.units,account.decimals,account.currency,locale)}</p>}
    {(layout==='baseline'||selected) && <div className="account-actions">
      {(['fund','transfer'] as const).map(action=><button key={action} onClick={()=>openDependency(action,account.currency)} aria-label={`${t[action]} · ${account.currency}`}>
        <span className="action-circle"><Icon name={action==='fund'?'plus':'transfer'} size={layout==='cards'?16:24}/></span><span>{t[action]}</span>
      </button>)}
    </div>}
    {layout==='cards' && <p className="balance"><span>{formatAmount(account.units,account.decimals,account.currency,locale).slice(0,-account.currency.length)}</span><span className="balance-unit">{account.currency}</span></p>}
  </article>;
}
function operationTitle(operation:Operation) {
  if(operation.kind==='receiving') return `${t.receiving} ${operation.currency}`;
  if(operation.kind==='transfer') return `${t.sending} · ${operation.recipient}`;
  return `${t.funding} · ${operation.id}`;
}
function operationDate(operation:Operation) {
  const [date,time] = operation.date.split('T');
  const [year,,day] = date.split('-');
  const month = new Intl.DateTimeFormat(locale==='ru'?'ru-RU':'en-US',{month:'short',timeZone:'UTC'}).format(new Date(`${date}T00:00:00Z`));
  return locale==='ru' ? `${Number(day)} ${month}${operation.showId ? ` ${year}` : ''} · ${time.slice(0,5)}` : `${month} ${Number(day)}${operation.showId ? `, ${year}` : ''} · ${time.slice(0,5)}`;
}
function TransactionList({operations}: {operations:Operation[]}) {
  return <div className="transaction-list" data-node-id="80:552">
    <div className="table-header transaction-grid" aria-hidden="true"><span>{t.operation}</span><span>{t.date}</span><span className="amount">{t.amount}</span><span>{t.status}</span></div>
    {operations.length ? operations.map(operation=><button key={operation.id} className="transaction-row transaction-grid" data-node-id={operation.nodeId} onClick={()=>openDependency(`operation:${operation.id}`,operation.currency)}>
      <span className="operation-identity"><span>{operationTitle(operation)}</span>{operation.showId && <span className="operation-id">{operation.id}</span>}</span>
      <span className="date-cell">{operationDate(operation)}{operation.showAccount && <><br/>{!['EUR','USD','GBP','CHF'].includes(operation.currency)?t.cryptoAccount:t.account} {operation.currency}</>}</span>
      <span className="amount">{operation.positive?'+':''}{formatAmount(operation.units,operation.decimals,operation.currency,locale)}</span><span className="status-cell" data-status={operation.status}><span className="status-label">{operation.status==='completed' && operation.kind==='transfer'?t.executed:t[operation.status]}</span></span>
    </button>) : <div className="empty-history" role="status"><strong>{t.empty}</strong><p>{t.emptyHelp}</p></div>}
  </div>;
}
function App({dashboard}: {dashboard:Dashboard}) {
  const [selected,setSelected] = useState<Currency|null>(layout==='baseline'?null:'USDC');
  const [outlined,setOutlined] = useState<Currency|null>(layout==='baseline'?null:'USDC');
  const [notice,setNotice] = useState('');
  const [receiving,setReceiving] = useState<Currency|null>(null);
  useEffect(()=>{
    let timer: ReturnType<typeof setTimeout>;
    const showBoundary = (event:Event)=>{
      const {action,currency}=(event as CustomEvent<{action:string;currency?:Currency}>).detail;
      clearTimeout(timer);
      if(action==='receiving-details'&&currency){setNotice('');setReceiving(currency);return;}
      setNotice(t.boundary);timer=setTimeout(()=>setNotice(''),6000);
    };
    window.addEventListener('oraclepay:open-transition',showBoundary);
    return ()=>{clearTimeout(timer);window.removeEventListener('oraclepay:open-transition',showBoundary);};
  },[]);
  const selectAccount = (currency:Currency)=>{const next=toggleAccount(selected,currency);setSelected(next);setOutlined(next);};
  const history = <><div className="history-title" data-node-id="2723:1810"><h2>{selected?(layout==='baseline'?`${t.selectedHistory} · ${selected}`:`${t.selectedRecent} ${selected} · ${t.currency[selected]}`):t.recent}</h2><button className="text-link" onClick={()=>openDependency('history',selected??undefined)}>{t.allHistory}</button></div><TransactionList operations={filterOperations(dashboard.operations,selected).slice(0,4)}/></>;
  if(theme!=='neutral') return <>
    <WalletDashboard dashboard={dashboard} locale={locale} layout={layout==='columns'?'columns':'cards'} selected={selected} onSelect={selectAccount} onReset={()=>{setSelected(null);setOutlined(null);}} onOpen={openDependency}/>
    <div className={`build-notice${notice?' visible':''}`} role="status">{notice}</div>
    {receiving&&<ReceivingDialog key={receiving} currency={receiving} owner={dashboard.owner} locale={locale} onDismiss={()=>setReceiving(null)}/>}
  </>;
  return <div className={`app-shell layout-${layout}`} data-node-id={layout==='cards'?'2723:1823':layout==='columns'?'2716:872':'34:262'}>
    <aside className="sidebar" data-node-id="80:489">
      <p className="brand">OraclePay</p><p className="wallet-label">{t.wallet}</p>
      <nav aria-label={locale==='ru'?'Основная навигация':'Main navigation'}>{navigation.map(item=><button key={item} className={`nav-item ${item==='home'?'active':''}`} aria-current={item==='home'?'page':undefined} onClick={()=>item==='home'?(setSelected(null),setOutlined(null)):openDependency(item)}><Icon name={item}/><span>{t[item]}</span></button>)}</nav>
      <button className="nav-item signout" onClick={()=>openDependency('logout')}><Icon name="logout"/><span>{t.logout}</span></button>
    </aside>
    <div className="workspace" data-node-id="80:509"><header data-node-id="80:510"><span className="owner-name"><span className="owner-avatar" aria-hidden="true">{dashboard.owner.split(' ').map(part=>part[0]).slice(0,2).join('')}</span>{dashboard.owner}</span></header>
      <main data-node-id="80:513"><h1 data-node-id="80:520">{t.home}</h1>
        {layout==='columns'?<ColumnDashboard dashboard={dashboard} selected={selected} onSelect={selectAccount} onOpen={openDependency} history={history} locale={locale}/>:<><div className="accounts" data-node-id="2709:853">
          {(['fiat','crypto'] as const).map(kind=><section key={kind} className="account-group" aria-labelledby={`${kind}-heading`}><h2 id={`${kind}-heading`}>{kind==='fiat'?t.money:t.crypto}</h2><div className={`account-grid ${kind}`}>
            {dashboard.accounts.filter(a=>a.kind===kind).map(account=><AccountCard key={account.currency} account={account} selected={account.currency===outlined} onSelect={()=>selectAccount(account.currency)}/>)}
          </div></section>)}
        </div>
        {history}</>}
      </main>
    </div>
    <div className={`build-notice${notice?' visible':''}`} role="status">{notice}</div>
    {receiving&&<ReceivingDialog key={receiving} currency={receiving} owner={dashboard.owner} locale={locale} onDismiss={()=>setReceiving(null)}/>}
  </div>;
}
const dashboard = await mockDashboardService.getDashboard({sourceOnly:layout==='baseline'});
createRoot(document.getElementById('root')!).render(<StrictMode><App dashboard={dashboard}/></StrictMode>);
