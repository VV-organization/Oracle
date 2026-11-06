import type { Currency } from './domain';
import type { Locale } from './locales';
import { catalogs } from './locales.ts';

export type BankDetails = {kind:'bank'; account:string; code:string; bank:string; bankAddress:string};
export type CryptoDetails = {kind:'crypto'; network:string; address:string; tag?:string};
export type ReceivingDetails = BankDetails | CryptoDetails | {kind:'unavailable'};

/** Fictional source data from Figma 2734:958 and nine receiving-link initializers. */
export const receivingDetails: Record<Currency, ReceivingDetails> = {
  EUR:{kind:'bank',account:'DE62 7814 2060 0083 7419 52',code:'NRBKDEB2',bank:'Nordrhein Bank',bankAddress:'Rheinuferstraße 18, 40213 Düsseldorf, Germany'},
  USD:{kind:'bank',account:'000123456789',code:'021000021',bank:'North River Bank',bankAddress:'100 River Street, New York, NY 10005, USA'},
  GBP:{kind:'unavailable'}, CHF:{kind:'unavailable'},
  USDC:{kind:'crypto',network:'Polygon',address:'0x4d9b61e7a082c3f56d8e42b17c905af63e2718b4'},
  BTC:{kind:'crypto',network:'Bitcoin',address:'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'},
  ETH:{kind:'crypto',network:'Ethereum',address:'0x4d9b61e7a082c3f56d8e42b17c905af63e2718b4'},
  SOL:{kind:'crypto',network:'Solana',address:'7YttLkHDo7eEVG8Qjpt3V2d91Xqp4u6PRB2fNTmqzFRc'},
  XRP:{kind:'crypto',network:'XRP Ledger',address:'rDsbeomae4FXwgQTJp9Rs64Qg9vDiTCdBv',tag:'12850'},
};

export const receivingCopy = {
  ru:{bankTitle:'Реквизиты счёта',cryptoTitle:'Адрес для получения',close:'Закрыть',recipient:'Получатель',accountNumber:'Номер счёта',bank:'Название банка',bankAddress:'Адрес банка',currency:'Валюта',network:'Сеть',tag:'Тег назначения',copy:'Скопировать',copyAll:'Скопировать все реквизиты',copied:'Скопировано',allCopied:'Реквизиты скопированы',copyError:'Не скопировано',copyErrorHelp:'Не удалось скопировать. Выделите и скопируйте данные вручную.',unissued:'Реквизиты ещё не выпущены. Сначала необходимо пройти проверку личности и, для бизнеса, организации.',unavailable:'Реквизиты для этого счёта пока недоступны',networkNotice:'Используйте только выбранный актив и указанную сеть.'},
  en:{bankTitle:'Account details',cryptoTitle:'Receiving address',close:'Close',recipient:'Recipient',accountNumber:'Account number',bank:'Bank name',bankAddress:'Bank address',currency:'Currency',network:'Network',tag:'Destination tag',copy:'Copy',copyAll:'Copy all account details',copied:'Copied',allCopied:'Account details copied',copyError:'Copy failed',copyErrorHelp:'Could not copy. Select and copy the details manually.',unissued:'Receiving details have not been issued yet. Identity verification and, for businesses, organization verification are required first.',unavailable:'Receiving details are not available for this account yet',networkNotice:'Only use the selected asset and the specified network.'},
} as const;

export function bankFields(currency:Currency, details:BankDetails, owner:string, locale:Locale) {
  const t=receivingCopy[locale];
  return [
    {key:'recipient',label:t.recipient,value:owner,copy:false},
    {key:'account',label:currency==='EUR'?'IBAN':t.accountNumber,value:details.account,copy:true},
    {key:'code',label:currency==='EUR'?'SWIFT / BIC':'Routing number',value:details.code,copy:true},
    {key:'bank',label:t.bank,value:details.bank,copy:false},
    {key:'bankAddress',label:t.bankAddress,value:details.bankAddress,copy:false},
  ];
}

export function bankClipboardText(currency:Currency, details:BankDetails, owner:string, locale:Locale) {
  const heading=`${receivingCopy[locale].currency}: ${currency} · ${catalogs[locale].currency[currency]}`;
  return [heading,...bankFields(currency,details,owner,locale).map(row=>`${row.label}: ${row.value}`)].join('\n');
}
