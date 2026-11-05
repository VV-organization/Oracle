import type { Dashboard } from './domain.ts';

// D1 34:262, fresh design context 2026-11-03. Stored data is independent of UI locale.
export const sourceDashboardFixture: Dashboard = {
  owner: 'Алексей Морозов',
  accounts: [
    {currency:'EUR', kind:'fiat', units:'1245000', decimals:2, nodeId:'2709:857'},
    {currency:'USD', kind:'fiat', units:'1393529', decimals:2, nodeId:'2723:965'},
    {currency:'GBP', kind:'fiat', units:'1042414', decimals:2, nodeId:'2723:984'},
    {currency:'CHF', kind:'fiat', units:'0', decimals:2, nodeId:'2723:1003'},
    {currency:'USDC', kind:'crypto', units:'250000', decimals:2, nodeId:'2709:936'},
    {currency:'BTC', kind:'crypto', units:'3115971', decimals:8, nodeId:'2723:1367'},
    {currency:'ETH', kind:'crypto', units:'1071467', decimals:6, nodeId:'2723:1386'},
    {currency:'SOL', kind:'crypto', units:'246401', decimals:4, nodeId:'2723:1405'},
    {currency:'XRP', kind:'crypto', units:'192250', decimals:2, nodeId:'2723:1424'},
  ],
  operations: [
    {id:'OP-CR-IN-002',currency:'USDC',kind:'receiving',status:'pending',units:'10000',decimals:2,positive:false,date:'2026-10-29T11:40:00',showId:true,nodeId:'80:583'},
    {id:'history:crypto',currency:'USDC',kind:'receiving',status:'completed',units:'9900',decimals:2,positive:true,date:'2026-10-23T09:20:00',showAccount:true,nodeId:'401:301'},
    {id:'history:unknown',currency:'EUR',kind:'transfer',status:'unknown',units:'25000',decimals:2,positive:false,date:'2026-10-22T10:32:00',recipient:'Ирина Соколова',showAccount:true,nodeId:'80:593'},
    {id:'OP-IN-001',currency:'EUR',kind:'funding',status:'completed',units:'24750',decimals:2,positive:true,date:'2026-10-22T09:15:00',showAccount:true,nodeId:'80:588'},
  ],
};

// Additional fictional history requested by the user, 2026-11-03.
// These records have no Figma node IDs; the source snapshot above stays intact.
export const dashboardFixture: Dashboard = {
  ...sourceDashboardFixture,
  operations: ([
    ...sourceDashboardFixture.operations,
    {id:'OP-CR-OUT-003',currency:'USDC',kind:'transfer',status:'completed',units:'12500',decimals:2,positive:false,date:'2026-10-22T16:45:00',recipient:'Михаил Орлов',showAccount:true},
    {id:'OP-CR-OUT-004',currency:'USDC',kind:'transfer',status:'completed',units:'4850',decimals:2,positive:false,date:'2026-10-20T14:10:00',recipient:'Анна Белова',showAccount:true},
    {id:'OP-EUR-OUT-005',currency:'EUR',kind:'transfer',status:'completed',units:'8590',decimals:2,positive:false,date:'2026-10-21T12:30:00',recipient:'Денис Ковалёв',showAccount:true},
    {id:'OP-EUR-IN-006',currency:'EUR',kind:'funding',status:'completed',units:'120000',decimals:2,positive:true,date:'2026-10-20T10:05:00',showAccount:true},
    {id:'OP-USD-OUT-007',currency:'USD',kind:'transfer',status:'completed',units:'32000',decimals:2,positive:false,date:'2026-10-21T15:20:00',recipient:'Мария Лебедева',showAccount:true},
    {id:'OP-USD-IN-008',currency:'USD',kind:'funding',status:'completed',units:'85000',decimals:2,positive:true,date:'2026-10-20T09:15:00',showAccount:true},
    {id:'OP-GBP-OUT-009',currency:'GBP',kind:'transfer',status:'completed',units:'7500',decimals:2,positive:false,date:'2026-10-21T11:50:00',recipient:'Павел Волков',showAccount:true},
    {id:'OP-GBP-IN-010',currency:'GBP',kind:'receiving',status:'completed',units:'60000',decimals:2,positive:true,date:'2026-10-19T16:40:00',showAccount:true},
    {id:'OP-BTC-IN-011',currency:'BTC',kind:'receiving',status:'completed',units:'240000',decimals:8,positive:true,date:'2026-10-21T10:25:00',showAccount:true},
    {id:'OP-BTC-OUT-012',currency:'BTC',kind:'transfer',status:'completed',units:'85000',decimals:8,positive:false,date:'2026-10-18T18:10:00',recipient:'Артём Смирнов',showAccount:true},
    {id:'OP-ETH-IN-013',currency:'ETH',kind:'receiving',status:'completed',units:'125000',decimals:6,positive:true,date:'2026-10-21T09:30:00',showAccount:true},
    {id:'OP-ETH-OUT-014',currency:'ETH',kind:'transfer',status:'completed',units:'80000',decimals:6,positive:false,date:'2026-10-18T12:05:00',recipient:'Елена Новикова',showAccount:true},
    {id:'OP-SOL-IN-015',currency:'SOL',kind:'receiving',status:'completed',units:'35000',decimals:4,positive:true,date:'2026-10-20T17:35:00',showAccount:true},
    {id:'OP-SOL-OUT-016',currency:'SOL',kind:'transfer',status:'completed',units:'12500',decimals:4,positive:false,date:'2026-10-17T11:20:00',recipient:'Илья Соколов',showAccount:true},
    {id:'OP-XRP-IN-017',currency:'XRP',kind:'receiving',status:'completed',units:'25000',decimals:2,positive:true,date:'2026-10-19T10:45:00',showAccount:true},
    {id:'OP-XRP-OUT-018',currency:'XRP',kind:'transfer',status:'completed',units:'8500',decimals:2,positive:false,date:'2026-10-16T14:55:00',recipient:'Софья Миронова',showAccount:true},
  ] satisfies Dashboard['operations']).sort((a,b)=>b.date.localeCompare(a.date)),
};
