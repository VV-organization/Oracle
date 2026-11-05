export type Locale = 'ru' | 'en';
export const catalogs = {
  ru: {
    home:'Главная', payments:'Платежи', cards:'Карты', history:'История операций', help:'Помощь', settings:'Настройки', logout:'Выйти',
    wallet:'Личный кошелёк', money:'Денежные счета', crypto:'Криптоактивы', details:'Реквизиты', address:'Адрес', fund:'Пополнить', transfer:'Перевести',
    recent:'Последние операции по всем счетам', selectedHistory:'Операции', allHistory:'Вся история', operation:'Операция / получатель', date:'Дата и счёт', amount:'Сумма', status:'Статус',
    empty:'Операций пока нет', emptyHelp:'Здесь появятся ваши пополнения, переводы и оплаты.', receiving:'Получение', sending:'Перевод', funding:'Пополнение',
    account:'Счёт', cryptoAccount:'Кошелёк', selectedCryptoAccount:'Криптосчет', selectedRecent:'Последние операции по счету', pending:'Ожидаем подтверждения сети', unknown:'Уточняем статус', completed:'Зачислено',
    executed:'Выполнена',
    boundary:'Этот раздел ещё не перенесён в текущую сборку. Выбранный счёт и данные сохранены.',
    currency:{EUR:'Евро',USD:'Доллар США',GBP:'Фунт стерлингов',CHF:'Швейцарский франк',USDC:'USD Coin',BTC:'Bitcoin',ETH:'Ethereum',SOL:'Solana',XRP:'XRP'},
  },
  en: {
    home:'Home',payments:'Payments',cards:'Cards',history:'Transaction history',help:'Help',settings:'Settings',logout:'Sign out',
    wallet:'Personal wallet',money:'Money accounts',crypto:'Crypto assets',details:'Account details',address:'Address',fund:'Add money',transfer:'Transfer',
    recent:'Recent transactions across all accounts',selectedHistory:'Transactions',allHistory:'All transactions',operation:'Transaction / recipient',date:'Date and account',amount:'Amount',status:'Status',
    empty:'No transactions yet',emptyHelp:'Your deposits, transfers and payments will appear here.',receiving:'Receive',sending:'Transfer',funding:'Deposit',
    account:'Account',cryptoAccount:'Wallet',selectedCryptoAccount:'Crypto account',selectedRecent:'Recent transactions for',pending:'Awaiting network confirmation',unknown:'Checking status',completed:'Credited',
    executed:'Completed',
    boundary:'This section has not been migrated into this build yet. Your selected account and data are preserved.',
    currency:{EUR:'Euro',USD:'US dollar',GBP:'Pound sterling',CHF:'Swiss franc',USDC:'USD Coin',BTC:'Bitcoin',ETH:'Ethereum',SOL:'Solana',XRP:'XRP'},
  },
} as const;
export function readLocale(): Locale {
  const requested = new URLSearchParams(location.search).get('lang');
  const stored = localStorage.getItem('oraclepay.locale');
  const locale = requested === 'en' || requested === 'ru' ? requested : stored === 'en' ? 'en' : 'ru';
  localStorage.setItem('oraclepay.locale', locale);
  document.documentElement.lang = locale;
  return locale;
}
