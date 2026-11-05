import { useEffect, useRef, useState } from 'react';
import type { Currency } from '../domain';
import type { Locale } from '../locales';
import { catalogs } from '../locales';
import { receivingDetails, receivingCopy, bankFields, bankClipboardText } from '../receiving';
import { Icon } from './Icon';
import './ReceivingDialog.css';

export function ReceivingDialog({currency,owner,locale,onDismiss}:{currency:Currency;owner:string;locale:Locale;onDismiss:()=>void}) {
  const dialog=useRef<HTMLDialogElement>(null);
  const request=useRef(0);
  const [feedback,setFeedback]=useState<{key:string;error:boolean}|null>(null);
  const details=receivingDetails[currency];
  const t=receivingCopy[locale];
  const asset=`${currency} · ${catalogs[locale].currency[currency]}`;

  useEffect(()=>{
    const element=dialog.current!;
    const trigger=document.activeElement instanceof HTMLElement?document.activeElement:null;
    element.showModal();
    return ()=>{request.current++;element.close();if(trigger?.isConnected)trigger.focus({preventScroll:true});};
  },[]);

  async function copy(key:string,value:string) {
    const current=++request.current;
    setFeedback(null);
    try {
      await navigator.clipboard.writeText(value);
      if(current===request.current)setFeedback({key,error:false});
    } catch {
      if(current===request.current)setFeedback({key,error:true});
    }
  }
  function message(key:string) {
    if(feedback?.key!==key)return '';
    return feedback.error?t.copyError:key==='all'?t.allCopied:t.copied;
  }
  function copyControl(key:string,value:string,label:string) {
    return <>
      <span className="receiving-copy-feedback" role="status" title={feedback?.key===key&&feedback.error?t.copyErrorHelp:undefined}>{message(key)}</span>
      <button className="receiving-icon-button" aria-label={`${t.copy} ${label}`} onClick={()=>void copy(key,value)}><Icon name="copy" size={24}/></button>
    </>;
  }

  return <dialog ref={dialog} className="receiving-dialog" aria-labelledby="receiving-title" data-node-id="2734:959" data-currency={currency} onCancel={event=>{event.preventDefault();onDismiss();}} onKeyDown={event=>{
    if(event.key!=='Tab')return;
    const controls=Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'));
    const first=controls[0],last=controls[controls.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
  }}>
    <div className="receiving-header"><h2 id="receiving-title">{details.kind==='crypto'?t.cryptoTitle:t.bankTitle}</h2><button className="receiving-icon-button" autoFocus aria-label={t.close} onClick={onDismiss}><Icon name="close" size={24}/></button></div>
    {details.kind==='crypto'?<div className="receiving-crypto" data-node-id="2734:985">
      <div className="receiving-network"><span>{t.network}</span><span>{details.network}</span></div>
      <div className="receiving-address-group"><p className="receiving-asset">{asset}</p><div className="receiving-address-row"><p>{details.address}</p>{copyControl('address',details.address,catalogs[locale].address)}</div></div>
      {details.tag&&<div className="receiving-network" data-node-id="2734:999"><span>{t.tag}</span><span>{details.tag}</span></div>}
      <p className="receiving-notice">{t.networkNotice}</p>
    </div>:<div className="receiving-bank" data-node-id="2734:966">
      <p className="receiving-currency">{asset}</p>
      {details.kind==='unavailable'?<p className="receiving-unavailable">{t.unavailable}</p>:<>
        {bankFields(currency,details,owner,locale).map(row=><div className="receiving-bank-row" key={row.key}>
          <span className="receiving-label">{row.label}</span><span className="receiving-value">{row.value}</span>{row.copy&&copyControl(row.key,row.value,row.label)}
        </div>)}
        <div className="receiving-footer"><button className="receiving-primary" onClick={()=>void copy('all',bankClipboardText(currency,details,owner,locale))}>{t.copyAll}</button><span role="status" title={feedback?.error?t.copyErrorHelp:undefined}>{message('all')}</span></div>
      </>}
    </div>}
  </dialog>;
}
