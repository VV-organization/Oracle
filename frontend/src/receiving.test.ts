import test from 'node:test';
import assert from 'node:assert/strict';
import { receivingDetails, bankClipboardText } from './receiving.ts';

test('bank copy preserves leading zeroes and distinguishes domestic USD from EUR',()=>{
  const usd=receivingDetails.USD,eur=receivingDetails.EUR;
  assert.equal(usd.kind,'bank'); assert.equal(eur.kind,'bank');
  if(usd.kind!=='bank'||eur.kind!=='bank')return;
  const text=bankClipboardText('USD',usd,'Алексей Морозов','en');
  assert.match(text,/Account number: 000123456789\nRouting number: 021000021/);
  assert.match(text,/Recipient: Алексей Морозов/);
  assert.doesNotMatch(text,/IBAN|SWIFT|Nordrhein/);
  const euro=bankClipboardText('EUR',eur,'Алексей Морозов','ru');
  assert.match(euro,/IBAN: DE62 7814 2060 0083 7419 52\nSWIFT \/ BIC: NRBKDEB2/);
  assert.equal(euro.split('\n').length,6);
});

test('unavailable bank contexts contain no receiving data and XRP retains its tag',()=>{
  assert.deepEqual(receivingDetails.GBP,{kind:'unavailable'});
  assert.deepEqual(receivingDetails.CHF,{kind:'unavailable'});
  const xrp=receivingDetails.XRP;
  assert.equal(xrp.kind,'crypto');
  if(xrp.kind==='crypto'){assert.equal(xrp.tag,'12850');assert.equal(xrp.network,'XRP Ledger');}
  const usdc=receivingDetails.USDC,eth=receivingDetails.ETH;
  if(usdc.kind==='crypto'&&eth.kind==='crypto'){assert.equal(usdc.address,eth.address);assert.notEqual(usdc.network,eth.network);}
});
