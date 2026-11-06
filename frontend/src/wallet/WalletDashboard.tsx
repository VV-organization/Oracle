import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import '@fontsource-variable/manrope';
import type { Account, Currency, Dashboard, Operation } from '../domain';
import { filterOperations, formatAmount } from '../domain';
import { catalogs, type Locale } from '../locales';
import { Icon } from '../components/Icon';
import { BrandLogo } from '../components/BrandLogo';
import './wallet.css';
import { walletCopy as words } from './copy';

type Props = {
  dashboard: Dashboard; locale: Locale; layout: 'cards'|'columns'; selected: Currency|null;
  onSelect: (currency: Currency)=>void; onReset: ()=>void;
  onOpen: (action:string,currency?:Currency)=>void;
};
const compactQuery='(max-width: 900px)';
function subscribeCompact(callback:()=>void){const media=window.matchMedia(compactQuery);media.addEventListener('change',callback);return ()=>media.removeEventListener('change',callback);}
const getCompact=()=>window.matchMedia(compactQuery).matches;
const nav = ['home','payments','cards','history','help','settings'] as const;

function Amount({account,locale}:{account:Pick<Account,'units'|'decimals'|'currency'>;locale:Locale}) {
 const value=formatAmount(account.units,account.decimals,account.currency,locale).slice(0,-account.currency.length).trim();
 return <><span className="wallet-number">{value}</span><span className="wallet-unit">{account.currency}</span></>;
}
function Identity({account,locale,showStamp=true}:{account:Account;locale:Locale;showStamp?:boolean}){
 return <span className="wallet-identity">{showStamp&&<span className="wallet-currency-stamp" aria-hidden="true">{account.currency}</span>}<span className="wallet-identity-copy"><strong>{account.currency}</strong><span>{catalogs[locale].currency[account.currency]}</span></span></span>;
}
function Actions({account,locale,onOpen}:{account:Account;locale:Locale;onOpen:Props['onOpen']}) {
 return <div className="wallet-actions">{(['fund','transfer'] as const).map(action=><button key={action} onClick={()=>onOpen(action,account.currency)} aria-label={`${catalogs[locale][action]} · ${account.currency}`}><span className="wallet-action-circle"><Icon name={action==='fund'?'plus':'transfer'} size={18}/></span><span>{catalogs[locale][action]}</span></button>)}</div>;
}
function AccountTile({account,locale,selected,onSelect,onOpen}:{account:Account;locale:Locale;selected:boolean;onSelect:()=>void;onOpen:Props['onOpen']}) {
 const t=catalogs[locale];
 return <article className={`wallet-account${selected?' is-selected':''}`} data-currency={account.currency}>
   <button className="wallet-account-select" aria-label={`${t.selectedHistory} · ${account.currency}`} aria-pressed={selected} onClick={onSelect}/>
   <div className="wallet-account-heading">
     <Identity account={account} locale={locale} showStamp={false}/>
     <button className="wallet-link wallet-details" onClick={()=>onOpen('receiving-details',account.currency)}>{account.kind==='fiat'?t.details:t.address}</button>
   </div>
   <div className="wallet-account-actions">{selected?<Actions account={account} locale={locale} onOpen={onOpen}/>:null}</div>
   <p className="wallet-balance"><Amount account={account} locale={locale}/></p>
 </article>;
}
function Ledger({operations,selected,locale,onReset,onOpen}:{operations:Operation[];selected:Currency|null;locale:Locale;onReset:()=>void;onOpen:Props['onOpen']}) {
 const t=catalogs[locale],w=words[locale];
 return <section className="wallet-ledger" aria-labelledby="wallet-history-title">
  <div className="wallet-section-heading"><div className="wallet-history-context"><h2 id="wallet-history-title">{w.recent}</h2><>{selected?<button className="wallet-filter" onClick={onReset} aria-label={w.clear}>{selected}<Icon name="close" size={12}/></button>:<span className="wallet-filter">{w.all}</span>}</></div><button className="wallet-link" onClick={()=>onOpen('history',selected??undefined)}>{t.allHistory}</button></div>
  <div className="wallet-ledger-surface">
   <div className="wallet-ledger-head" aria-hidden="true"><span>{t.operation}</span><span>{t.date}</span><span>{t.status}</span><span>{t.amount}</span></div>
   {operations.length?operations.map(op=>{
    const incoming=op.kind!=='transfer';
    const primary=op.kind==='transfer'?op.recipient:op.kind==='receiving'?`${t.receiving} ${op.currency}`:t.funding;
    const secondary=op.showId?op.id:op.kind==='transfer'?w.outgoing:w.incoming;
    const date=new Intl.DateTimeFormat(locale==='ru'?'ru-RU':'en-US',{day:'numeric',month:'short',timeZone:'UTC'}).format(new Date(`${op.date.slice(0,10)}T00:00:00Z`));
    return <button className="wallet-transaction" key={op.id} onClick={()=>onOpen(`operation:${op.id}`,op.currency)}>
     <span className="wallet-transaction-identity"><span className={`wallet-direction${incoming?' incoming':''}`}><Icon name="transfer" size={18}/></span><span className="wallet-operation-copy"><strong>{primary}</strong><span>{secondary}</span></span></span>
     <span className="wallet-date">{date}<span>{op.date.slice(11,16)} · {op.currency}</span></span>
     <span className="wallet-status" data-status={op.status}><span className="wallet-status-dot"/>{op.status==='completed'&&op.kind==='transfer'?t.executed:t[op.status]}</span>
     <span className="wallet-operation-amount" data-incoming={op.positive}>{op.positive?'+':''}<Amount account={op} locale={locale}/></span>
    </button>;
   }):<div className="wallet-empty" role="status"><span className="wallet-direction"><Icon name="history" size={24}/></span><strong>{t.empty}</strong><p>{t.emptyHelp}</p></div>}
  </div>
 </section>;
}
export function WalletDashboard({dashboard,locale,layout,selected,onSelect,onReset,onOpen}:Props){
 const t=catalogs[locale],w=words[locale];
 const compact=useSyncExternalStore(subscribeCompact,getCompact,()=>false);
 const presentation=compact?'cards':layout;
 const [menuOpen,setMenuOpen]=useState(false);
 const shellRef=useRef<HTMLDivElement>(null);
 useLayoutEffect(()=>{
  const root=shellRef.current;
  if(!root || !('IntersectionObserver' in window))return;
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  const targets=Array.from(root.querySelectorAll<HTMLElement>('.wallet-brand-block,.wallet-nav > .wallet-nav-item,.wallet-sidebar-bottom,.wallet-topbar,.wallet-page-heading,.wallet-group-heading,.wallet-account,.wallet-rail-account,.wallet-selected-panel,.wallet-panel-heading,.wallet-panel-balance,.wallet-actions > button,.wallet-section-heading,.wallet-ledger-surface,.wallet-ledger-head,.wallet-transaction,.wallet-empty'));
  const reveal=(node:HTMLElement)=>{node.dataset.walletReveal='visible';};
  const settle=(node:HTMLElement)=>{node.dataset.walletReveal='settled';};
  const observer=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{if(entry.isIntersecting){reveal(entry.target as HTMLElement);observer.unobserve(entry.target);}});
  },{threshold:0.08});
  targets.forEach(node=>{
   if(media.matches){settle(node);return;}
   if(node.dataset.walletReveal==='visible'||node.dataset.walletReveal==='settled')return;
   const siblings=targets.filter(other=>other.parentElement===node.parentElement);
   node.style.setProperty('--wallet-reveal-delay',`${Math.min(siblings.indexOf(node)*45,180)}ms`);
   node.dataset.walletReveal='pending';observer.observe(node);
  });
  const reduce=()=>{if(media.matches){targets.forEach(settle);observer.disconnect();}};
  const focus=(event:FocusEvent)=>{
   let node=(event.target as HTMLElement).closest<HTMLElement>('[data-wallet-reveal]');
   while(node){settle(node);observer.unobserve(node);node=node.parentElement?.closest<HTMLElement>('[data-wallet-reveal]')??null;}
  };
  const finish=(event:AnimationEvent)=>{
   const node=event.target as HTMLElement;
   if((event.animationName==='wallet-reveal'||event.animationName==='wallet-fade')&&node.dataset.walletReveal==='visible')settle(node);
  };
  media.addEventListener('change',reduce);root.addEventListener('focusin',focus);root.addEventListener('animationend',finish);
  return ()=>{observer.disconnect();media.removeEventListener('change',reduce);root.removeEventListener('focusin',focus);root.removeEventListener('animationend',finish);};
 },[presentation,selected]);
 const menuRef=useRef<HTMLElement>(null);
 const menuToggleRef=useRef<HTMLButtonElement>(null);
 useEffect(()=>{if(!compact)setMenuOpen(false);},[compact]);
 useEffect(()=>{
  if(!menuOpen||!compact)return;
  const previousOverflow=document.body.style.overflow;
  document.body.style.overflow='hidden';
  const menu=menuRef.current;
  const items=()=>Array.from(menu?.querySelectorAll<HTMLButtonElement>('button')??[]);
  items()[0]?.focus();
  const closeOnEscape=(event:KeyboardEvent)=>{
   if(event.key==='Escape'){event.preventDefault();setMenuOpen(false);}
   if(event.key==='Tab'){
    const controls=items(),first=controls[0],last=controls[controls.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
   }
  };
  document.addEventListener('keydown',closeOnEscape);
  return ()=>{
   document.removeEventListener('keydown',closeOnEscape);
   document.body.style.overflow=previousOverflow;
   if(getCompact())menuToggleRef.current?.focus();
   else menuRef.current?.querySelector<HTMLButtonElement>('[aria-current="page"]')?.focus();
  };
 },[menuOpen,compact]);
 const count=(kind:'fiat'|'crypto')=>dashboard.accounts.filter(a=>a.kind===kind).length;
 const account=dashboard.accounts.find(item=>item.currency===selected);
 const operations=filterOperations(dashboard.operations,selected).slice(0,4);
 const ledger=<Ledger operations={operations} selected={selected} locale={locale} onReset={onReset} onOpen={onOpen}/>;
 function go(item:typeof nav[number]){setMenuOpen(false);if(item==='home')onReset();else onOpen(item);}
 function changeLocale(next:Locale){const url=new URL(location.href);url.searchParams.set('lang',next);location.assign(url.href);}
 return <div ref={shellRef} className={`wallet-shell wallet-layout-${presentation}`}>
  <aside ref={menuRef} id="wallet-navigation" className={`wallet-sidebar${menuOpen?' is-open':''}`}>
   <div className="wallet-brand-block"><BrandLogo className="wallet-brand" /><p>{t.wallet}</p></div>
   <button className="wallet-mobile-close" onClick={()=>setMenuOpen(false)} aria-label={w.closeMenu}><Icon name="close"/></button>
   <nav className="wallet-nav" aria-label={locale==='ru'?'Основная навигация':'Main navigation'}>{nav.map((item,index)=><button className={`wallet-nav-item${item==='home'?' active':''}${index===4?' wallet-nav-secondary':''}`} key={item} aria-current={item==='home'?'page':undefined} onClick={()=>go(item)}><Icon name={item} size={19}/><span>{t[item]}</span></button>)}</nav>
   <div className="wallet-sidebar-bottom"><div className="wallet-languages" role="group" aria-label={w.language}>{(['ru','en'] as const).map(lang=><button key={lang} aria-pressed={locale===lang} onClick={()=>changeLocale(lang)}>{lang.toUpperCase()}</button>)}</div><button className="wallet-nav-item" onClick={()=>onOpen('logout')}><Icon name="logout" size={19}/><span>{t.logout}</span></button></div>
  </aside>
  {menuOpen&&<button className="wallet-menu-shade" aria-label={w.closeMenu} onClick={()=>setMenuOpen(false)}/>}
  <div className="wallet-workspace" inert={menuOpen&&compact}>
   <header className="wallet-topbar"><button ref={menuToggleRef} aria-controls="wallet-navigation" className="wallet-menu-toggle" aria-expanded={menuOpen} onClick={()=>setMenuOpen(!menuOpen)}>{w.menu}</button><span className="wallet-location">{t.home}<span>/</span>{w.overview}</span><span className="wallet-owner"><span className="wallet-avatar" aria-hidden="true">{dashboard.owner.split(' ').map(s=>s[0]).slice(0,2).join('')}</span><span>{dashboard.owner}</span></span></header>
   <main className="wallet-main">
    <div className="wallet-page-heading"><div><h1>{w.title}</h1><p>{w.subtitle}</p></div><span className="wallet-account-count">{locale==='ru'?`${count('fiat')} валюты · ${count('crypto')} криптоактивов`:`${count('fiat')} currencies · ${count('crypto')} crypto assets`}</span></div>
    {presentation==='cards'?<><div className="wallet-account-groups">{(['fiat','crypto'] as const).map(kind=><section className={`wallet-group ${kind}`} key={kind} aria-labelledby={`wallet-${kind}`}><div className="wallet-group-heading"><h2 id={`wallet-${kind}`}>{kind==='fiat'?t.money:t.crypto}</h2><span>{String(count(kind)).padStart(2,'0')}</span></div><div className="wallet-card-grid">{dashboard.accounts.filter(a=>a.kind===kind).map(a=><AccountTile key={a.currency} account={a} locale={locale} selected={selected===a.currency} onSelect={()=>onSelect(a.currency)} onOpen={onOpen}/>)}</div></section>)}</div>{ledger}</>:
     <div className="wallet-columns" data-selected={Boolean(account)}><div className="wallet-account-rail">{(['fiat','crypto'] as const).map(kind=><section className={`wallet-rail-group ${kind}`} key={kind} aria-labelledby={`wallet-${kind}`}><div className="wallet-group-heading"><h2 id={`wallet-${kind}`}>{kind==='fiat'?t.money:t.crypto}</h2><span>{String(count(kind)).padStart(2,'0')}</span></div><div className="wallet-rail-list">{dashboard.accounts.filter(a=>a.kind===kind).map(a=><button className={`wallet-rail-account${selected===a.currency?' is-selected':''}`} key={a.currency} aria-label={`${t.selectedHistory} · ${a.currency}`} aria-pressed={selected===a.currency} onClick={()=>onSelect(a.currency)}><Identity account={a} locale={locale}/><span className="wallet-rail-balance"><Amount account={a} locale={locale}/></span></button>)}</div></section>)}</div>
      <div className="wallet-detail-column">{account&&<section className="wallet-selected-panel"><div className="wallet-panel-heading" key={`heading-${account.currency}`}><Identity account={account} locale={locale}/><button className="wallet-link" onClick={()=>onOpen('receiving-details',account.currency)}>{account.kind==='fiat'?t.details:t.address}</button></div><div className="wallet-panel-balance" key={`balance-${account.currency}`}><span>{w.balance}</span><p><Amount account={account} locale={locale}/></p></div><Actions key={account.currency} account={account} locale={locale} onOpen={onOpen}/></section>}{ledger}</div>
     </div>}
   </main>
  </div>
 </div>;
}
