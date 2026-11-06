import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AuthError, createLocalAuthService } from './auth/service.ts';
import { accountKeys, actionAllowed, dashboardForSession, emptyRegistration, moneyAllowed, readAccounts, type RegistrationDraft } from './auth/account.ts';
import { authStorageKeys, readAccountSession, resolveAuthScreen } from './auth/routing.ts';
const personal: RegistrationDraft = { ...emptyRegistration, name: 'Мария Соколова', contact: 'maria@example.com' };
function memory() { const values = new Map<string,string>(); return { getItem: (key:string) => values.get(key) ?? null, setItem: (key:string,value:string) => { values.set(key,value); } }; }
const isError = (code:string) => (e:unknown) => e instanceof AuthError && e.code === code;
function setup() { const storage=memory(), confirmationStorage=memory();let now=1000; const options={storage,confirmationStorage,now:()=>now,delay:async()=>{}}; return {storage,confirmationStorage,options,service:createLocalAuthService(options),advance:(ms:number)=>{now+=ms;}}; }
async function confirm(service:ReturnType<typeof createLocalAuthService>,contact=personal.contact) { return service.verifyCode(await service.requestCode(contact),'123456'); }

test('unknown contact confirms before profile; complete personal identity survives sign-out and repeat login',async()=>{
 const {service,storage,confirmationStorage,options}=setup();
 const result=await confirm(service);assert.equal(result.kind,'local-onboarding');assert.deepEqual(readAccounts(storage),[]);
 const session=await service.completeRegistration(personal);assert.equal(session.kind,'local-registered');assert.equal(session.account.name,personal.name);assert.equal(session.account.kyc,'not-started');
 assert.equal(moneyAllowed(session),false);for(const action of ['fund','transfer','payments','cards','operation:1'])assert.equal(actionAllowed(session,action),false);
 for(const action of ['home','history','settings','help','logout','receiving-details'])assert.equal(actionAllowed(session,action),true);
 assert.equal(service.resumeOnboarding(),null);service.clear();
 const next=createLocalAuthService(options);assert.deepEqual(await confirm(next,'MARIA@example.com'),session);
 storage.setItem(authStorageKeys.session,JSON.stringify(session));assert.deepEqual(readAccountSession(storage,storage),session);
 assert.equal(confirmationStorage.getItem(accountKeys.confirmation),'null');
 const fixture={owner:'Alex',accounts:[{currency:'EUR' as const,kind:'fiat' as const,units:'1234',decimals:2,nodeId:'x'}],operations:[]};
 const dashboard=dashboardForSession(fixture,session);assert.equal(dashboard.owner,personal.name);assert.equal(dashboard.accounts[0].units,'0');assert.deepEqual(dashboard.operations,[]);assert.equal(fixture.accounts[0].units,'1234');
});
test('verified incomplete profile survives reload; drafts are isolated by normalized verified contact',async()=>{
 const {service,options}=setup();await confirm(service);service.saveProfileDraft({...personal,type:'business',organization:'Север',registrationNumber:'R 12/ABC'});
 const reloaded=createLocalAuthService(options);assert.equal(reloaded.resumeOnboarding()?.contact,personal.contact);assert.equal(reloaded.readProfileDraft().organization,'Север');
 reloaded.clear();assert.equal(createLocalAuthService(options).resumeOnboarding(),null);
 await confirm(reloaded,'other@example.com');assert.equal(reloaded.readProfileDraft().name,'');await assert.rejects(reloaded.completeRegistration(personal),isError('expired'));
 await confirm(reloaded,'MARIA@example.com');assert.equal(reloaded.readProfileDraft().organization,'Север');
 const session=await reloaded.completeRegistration(reloaded.readProfileDraft());assert.equal(session.account.type,'business');assert.equal(session.account.kyb,'not-started');
});
test('draft alone and legacy registration URL never bypass confirmation; grants expire and need fresh OTP',async()=>{
 const {service,confirmationStorage,advance,options}=setup();confirmationStorage.setItem(accountKeys.draft,JSON.stringify(personal));
 assert.equal(service.resumeOnboarding(),null);await assert.rejects(service.completeRegistration(personal),isError('expired'));
 assert.equal(resolveAuthScreen('register',true,false,false),'login');
 await confirm(service);const grant=service.resumeOnboarding()!;assert.equal(resolveAuthScreen('register',true,false,false,false,true),'register');
 advance(grant.expiresAt-1000);assert.equal(createLocalAuthService(options).resumeOnboarding(),null);await assert.rejects(service.completeRegistration(personal),isError('expired'));assert.deepEqual(readAccounts(options.storage),[]);
 await confirm(service);assert.equal((await service.completeRegistration(personal)).account.name,personal.name);
});
test('business validation and profile retry never create premature accounts',async()=>{
 const {service,storage}=setup();await confirm(service);
 await assert.rejects(service.completeRegistration({...personal,name:' '}),isError('registration-required'));
 await assert.rejects(service.completeRegistration({...personal,type:'business'}),isError('registration-required'));assert.deepEqual(readAccounts(storage),[]);
 const result=await service.completeRegistration({...personal,type:'business',organization:'Org',registrationNumber:'R 12/ABC'});assert.equal(result.account.registrationNumber,'R 12/ABC');
});
test('wrong, expired, stale and duplicate challenges do not grant profile or preview access',async()=>{
 const {service,advance,storage}=setup();const first=await service.requestCode(personal.contact);
 await assert.rejects(service.verifyCode(first,'000000'),isError('invalid-code'));assert.equal(service.resumeOnboarding(),null);
 await assert.rejects(service.resendCode(first),isError('too-soon'));advance(30000);const renewed=await service.resendCode(first);
 await assert.rejects(service.verifyCode(first,'123456'),isError('expired'));assert.equal((await service.verifyCode(renewed,'123456')).kind,'local-onboarding');
 await assert.rejects(service.verifyCode(renewed,'123456'),isError('expired'));const next=await service.requestCode('other@example.com');assert.equal(service.resumeOnboarding(),null);advance(300000);await assert.rejects(service.verifyCode(next,'123456'),isError('expired'));assert.deepEqual(readAccounts(storage),[]);
});
test('profile submit cancellation, double-submit and delay failure leave correct retry state',async()=>{
 const {storage,confirmationStorage}=setup();let delay=async()=>{};const service=createLocalAuthService({storage,confirmationStorage,delay:()=>delay()});await confirm(service);
 let finish!:()=>void;delay=()=>new Promise<void>(resolve=>{finish=resolve;});const submission=service.completeRegistration(personal);
 await assert.rejects(service.completeRegistration(personal),isError('too-soon'));service.clear();finish();await assert.rejects(submission,isError('expired'));assert.deepEqual(readAccounts(storage),[]);
 delay=async()=>{};await confirm(service);delay=async()=>{throw Error('offline');};await assert.rejects(service.completeRegistration(personal));assert.deepEqual(readAccounts(storage),[]);delay=async()=>{};assert.equal((await service.completeRegistration(personal)).account.name,personal.name);
});
test('storage failures at grant, draft, account and session boundaries fail closed and permit retry',async()=>{
 const storage=memory(),confirmationStorage=memory();let blocked=false;
 const confirmations={getItem:confirmationStorage.getItem,setItem:(k:string,v:string)=>{if(blocked)throw Error('quota');confirmationStorage.setItem(k,v);}};
 const service=createLocalAuthService({storage,confirmationStorage:confirmations,delay:async()=>{}});const challenge=await service.requestCode(personal.contact);blocked=true;
 await assert.rejects(service.verifyCode(challenge,'123456'),isError('unavailable'));assert.equal(service.resumeOnboarding(),null);blocked=false;await service.verifyCode(challenge,'123456');blocked=true;
 assert.throws(()=>service.saveProfileDraft(personal),isError('unavailable'));await assert.rejects(service.completeRegistration(personal),isError('unavailable'));assert.deepEqual(readAccounts(storage),[]);blocked=false;
 let registryBlocked=true;const failing={getItem:storage.getItem,setItem:(k:string,v:string)=>{if(registryBlocked)throw Error('quota');storage.setItem(k,v);}};
 const retry=createLocalAuthService({storage:failing,confirmationStorage,delay:async()=>{}});await assert.rejects(retry.completeRegistration(personal),isError('unavailable'));registryBlocked=false;assert.equal((await retry.completeRegistration(personal)).account.name,personal.name);
 for(const raw of ['{','null',JSON.stringify({kind:'local-registered',account:{...personal,kyc:'verified'}})]){storage.setItem(authStorageKeys.session,raw);assert.equal(readAccountSession(storage,storage),null);}
});
test('corrupt and inaccessible account registries cannot route unknown contact to fixture',async()=>{
 for(const storage of [{getItem:()=>'{',setItem:()=>{}},{getItem:()=>{throw Error('blocked');},setItem:()=>{}}]){
  const service=createLocalAuthService({storage,confirmationStorage:memory(),delay:async()=>{}});const challenge=await service.requestCode(personal.contact);await assert.rejects(service.verifyCode(challenge,'123456'),isError('unavailable'));assert.equal(service.resumeOnboarding(),null);
 }
});
test('phone and email never auto-link; account completing in another tab is reused without replacement',async()=>{
 const {service,options,storage}=setup();await confirm(service);const first=await service.completeRegistration(personal);
 const another=createLocalAuthService(options);assert.equal((await confirm(another,'+79991234567')).kind,'local-onboarding');assert.equal(another.readProfileDraft().name,'');
 const duplicate=createLocalAuthService({...options,confirmationStorage:memory()});await confirm(duplicate,'new@example.com');
 const concurrent=createLocalAuthService({...options,confirmationStorage:memory()});await confirm(concurrent,'new@example.com');await concurrent.completeRegistration({...personal,contact:'new@example.com',name:'Different owner'});
 await assert.rejects(duplicate.completeRegistration({...personal,contact:'new@example.com'}),isError('duplicate-contact'));
 assert.equal(readAccounts(storage)[0].name,first.account.name);assert.equal((await confirm(service,personal.contact)).kind,'local-registered');
});

test('corrupt form data falls back to an empty profile without becoming a verified contact',async()=>{
 const {service,confirmationStorage,options}=setup();
 confirmationStorage.setItem(accountKeys.drafts,'{');assert.equal(service.resumeOnboarding(),null);
 await confirm(service);assert.deepEqual(service.readProfileDraft(),{...emptyRegistration,contact:personal.contact});
 service.saveProfileDraft(personal);assert.equal(createLocalAuthService(options).readProfileDraft().name,personal.name);
});
test('suspending render work preserves a verified profile but invalidates pending operations',async()=>{
 const {service,options}=setup();await confirm(service);service.saveProfileDraft(personal);service.cancelPending();
 assert.equal(createLocalAuthService(options).resumeOnboarding()?.contact,personal.contact);
});
test('a caller cannot substitute the contact on a live challenge to select another owner',async()=>{
 const {service}=setup();const challenge=await service.requestCode(personal.contact);
 const result=await service.verifyCode({...challenge,contact:'someone-else@example.com'},'123456');assert.equal(result.contact,personal.contact);
});

test('logout deletion falls back to a null tombstone when browser removeItem fails',async()=>{
 const {setStoredValue}=await import('./auth/storage.ts');const values=new Map<string,string>([[authStorageKeys.session,'old-session']]);
 const storage={getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>{values.set(key,value);},removeItem:()=>{throw Error('remove blocked');}};
 assert.equal(setStoredValue(storage,authStorageKeys.session,null),true);assert.equal(readAccountSession(storage,storage),null);assert.equal(storage.getItem(authStorageKeys.session),'null');
 assert.equal(setStoredValue({...storage,setItem:()=>{throw Error('write blocked');}},authStorageKeys.session,null),false);
});
test('confirmation invalidation falls back to removal and stays invalid after adapter recreation',async()=>{
 const values=new Map<string,string>();let blocked=false;const confirmationStorage={getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>{if(blocked)throw Error('write blocked');values.set(key,value);},removeItem:(key:string)=>{values.delete(key);}};
 const options={storage:memory(),confirmationStorage,delay:async()=>{}};const service=createLocalAuthService(options);await confirm(service);blocked=true;
 assert.equal(service.clear(),true);assert.equal(createLocalAuthService(options).resumeOnboarding(),null);
});
