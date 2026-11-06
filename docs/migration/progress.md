# OraclePay: ход переноса

3 ноября 2026. **Frontend начат: основа и первая нейтральная Главная.** В `frontend/` созданы React/TypeScript/Vite, общие данные, адаптер, Inter, исходные SVG, оболочка, карточки счетов, история и фильтрация. Проверены сборка, типы, два теста модели и выбор девяти счетов в браузере. Исходящие переходы и реквизиты ещё не подключены; это частичная реализация.

После замечания пользователя подготовка перестала блокировать вёрстку: пакет 00 остаётся открытым, следующие семейства проверяются перед собственным переносом. Пользователь выбрал новые визуальные основы: **вариант 1 `2723:1823` — компактные карточки; вариант 2 `2716:872` — счета слева**. У первой ссылки номер в подписи расходился с адресом; пользователь явно подтвердил `2723:1823`. Эти композиции заменяют D1 как визуальную основу двух вариантов. D1 сохраняется как исходный ориентир поведения.

Текущая реализация и границы: [пакет Главной](batches/01-dashboard.md). Рабочая ветка `codex/dashboard-neutral`, результат локальный, без публикации и финансовых подключений.

Обе новые композиции уже доступны: `?layout=cards` и `?layout=columns` на локальном сервере. Проверены 18 выборов счетов, два снятия выбора, пустой CHF и сохранение контекста дочернего действия. Снимки лежат в `docs/migration/evidence/dashboard/`. Сборка и типы проходят. Темы и мобильная адаптация ещё не сделаны, исходящие связи остаются открытыми. Несогласованность состава истории в исходных альтернативах отражена в B00-025.

## Зафиксированный источник

- Сохранена полная локальная копия Figma: `figma-work/migration-baseline/raw/OraclePay-baseline-2026-11-03.fig`, 17 833 297 байт, SHA-256 `629f78e9181b2360ba15cc52b45d58bd64c49c92ef1c0e9198e2e282553cef09`. Точная облачная ревизия не подтверждена.
- Все 10 563 узла Product покрыты без пропусков: 9 562 явных узла из архива и 1 001 вложенный узел экземпляров из живого API. Сохранены геометрия, тексты, оформление, привязки и исходные реакции. Независимая проверка выполнила 134 237 сравнений полей с архивом.
- Для всех 1 424 актуальных локальных переменных сохранены значения и режимы. Дизайн и постоянные переменные при сборе не изменялись. Значения сеанса Present учитываются отдельно.
- Сохранены 69 PNG фреймов: рабочие экраны, примеры состояний, альтернативы и неразрешённые фрагменты. Это не 69 утверждённых страниц. Размеры и контрольные суммы записаны; визуальная приёмка всех фреймов не выполнена.
- В реестре ролей 181 узел, включая секции, документацию и референсы. Найдены 23 точки входа. Пять альтернатив главной, альтернативные форма и drawer сохранены отдельно от канонического D1.
- Созданы реестры экранов, состояний, полей, ассетов и 2 219 кандидатов реакций Product. Сохранены полные деревья действий и условий. Статический граф не заменяет прохождение прототипа.

## Проверено в Present

Present работает. Сохранены 255 наблюдений в шести проходах. Всего 264 native-снимка: ещё пять промежуточных кадров и четыре неуспешные попытки навигации сохранены отдельно и не считаются принятыми переходами. Все снимки просмотрены независимыми агентами. Это не 255 уникальных состояний и не полная приёмка сценариев.

- CHF: выбор показывает нулевой баланс и пустую историю; повторный клик возвращает общий список.
- Открыты девять контекстов реквизитов/адресов: EUR, USD, GBP, CHF, USDC, BTC, ETH, SOL, XRP. Для XRP есть tag; для GBP/CHF показана недоступность реквизитов. На проверенных снимках нет подмены контекста старыми банковскими полями.
- Проверены подписи при копировании IBAN и всех реквизитов EUR, их сброс при открытии USD. Системный буфер не проверялся: это интерактивный макет Figma.
- Клик по затемнению оставляет диалог EUR открытым; Escape закрывает его. Между контекстами использовались Escape и крестик.
- EUR «Пополнить» → EUR/Германия/SEPA → инструкции → крестик → стрелка назад. Сумма 250 EUR, комиссия 2,50, к зачислению 247,50. После возврата выбран EUR и виден OP-IN-002 «Ожидаем поступление»; баланс остаётся 12 450 EUR. Зачисление не наблюдалось.

### Второй проход: главная, история, входы в денежные сценарии

- Выбранный EUR → реквизиты → крестик: выбранный счёт и история EUR сохраняются.
- «Вся история» сохраняет EUR. Открыты ожидающая OP-IN-002 и завершённая OP-IN-001; суммы и статусы различаются корректно. Возврат стрелкой сохраняет EUR, а после выбора «Завершённые» — оба фильтра.
- Найдено расхождение B00-015: переход из истории через боковую «Главную» показывает общий список операций, сохраняя обводку EUR. Источник не исправлялся; решение нужно до реализации этого поведения.
- Вместе с первым проходом проверены 18/18 входов «Пополнить» / «Перевести» на девяти карточках и возвраты на выбранный счёт. Фиат ведёт в P1/P4, крипто — P5/P6. Это проверка входов, а не завершённых платежей; в run04 отдельно проверены скрытые действия D1 и запрещённый вход пополнения через каталог; все закрытые маршруты ещё не пройдены.
- USD/GBP/CHF открывают свои валюты и SWIFT; EUR — SEPA. В проверенных формах фиата 250 → комиссия 2,50; пополнение даёт net 247,50, перевод — total 252,50.
- CHF с нулевым балансом: «Продолжить» показывает ошибку недостаточности, «Исправить данные» скрывает её и сохраняет форму. Прокруткой достигнуты нижние действия; затем проверен возврат в CHF с пустой историей. Две попытки возврата у панели Figma не дали навигации и не используются как доказательство поломки продуктовой стрелки.
- USDC / Polygon, BTC / Bitcoin, ETH / Ethereum, SOL / Solana и XRP / XRP Ledger: проверены адреса/QR на входе получения, валюта, сеть и суммы на входе вывода. XRP показывает receiving tag 12850; поле тега другого получателя в выводе пустое. Ввод и валидация тега ещё не проверены.
- После возврата из USDC видны pending 100 и завершённое +99 USDC. Pending уже существовал на снимке09 до входа получения33; создание или зачисление этой операции не доказано. Для BTC/ETH/SOL/XRP история пуста.

Последовательность второго прохода: `figma-work/migration-baseline/evidence/run-02/actions.json`; результаты и ограничения — соседний `observations.json`. Статическая сверка 18 действий и независимый просмотр снимков — `docs/migration/reviews/2026-11-03-{d1-source-audit,run02-visual-review}.md`.

Таблица всех входов и возвратов со ссылками на снимки — [d1-entry-matrix.md](d1-entry-matrix.md). Независимая проверка интеграции подтвердила соответствие 140 файлов манифесту, 248 строк покрытия и ссылок на состояния: [run02-integration-review](reviews/2026-11-03-run02-integration-review.md). Совпадающие изображения сохранены как отдельные наблюдения, без утверждения, что они показывают уникальные состояния.

### Третий проход: вход, восстановление и регистрация

- Проверены вход по email с preset-кодом и выход через текстовую кнопку. Две ранние попытки выхода не дали навигации; они записаны отдельно, а успешный выход подтверждён снимком13. Причина ранних неуспехов не доказана.
- Пустой OTP вызывает ошибку; клик поля подставляет код и снимает ошибку. Наблюдались отсчёт, доступный повтор, очистка поля и новое пояснение после повторной отправки. Ранний клик не показал повторную отправку. Точная длительность отсчёта и доставка SMS/email не проверены.
- Телефонный вход открывает подтверждение со старым email в подписи — B00-016. Источник подтвердил фиксированный текст без привязки. «Изменить контакт» возвращает выбранный телефон; подтверждение телефонного входа до D1 отдельно не завершалось.
- Восстановление: пустая доступная почта → ошибка → подстановка адреса → сообщение о заявке → возврат в A1. Заявка не означает восстановленный доступ или заменённый контакт.
- Личная регистрация: пустые поля → ошибка → заполнение → подтверждение → возврат с сохранением данных → повтор → ограниченный кабинет. Все девять балансов нулевые, KYC «Не начата», денежные действия скрыты.
- KYC: открыть → закрыть без начала → открыть снова → имитация внешнего шага → «На рассмотрении» → обновить статус. После обновления блок проверки исчезает и денежные действия появляются; балансы и история остаются нулевыми/пустыми. Реальный провайдер не подключался.
- Бизнес-регистрация: сохранение имени, контакта и организационных полей при переключении «Для бизнеса → Для себя → Для бизнеса»; подтверждение приводит к раздельным KYC и KYB. Организация и номер уже подставлены сценарием, поэтому ошибка отсутствующих данных организации не пройдена.
- Бизнес: сначала KYB → «На рассмотрении» → «Подтверждена». Пока KYC «Не начата», денежные действия скрыты. Далее KYC → ожидание → обновление; действия появляются только после обеих проверок. Это наблюдение интерфейса прототипа, не проверка серверных разрешений.
- При подтверждённой KYB и неначатой KYC сохраняется старое пояснение о будущем результате организации — B00-017. Статический аудит подтвердил, что ограниченная ветка не заменяет пояснение. Источник не исправлялся.
- Figma Restart использован перед входом и бизнес-веткой. Возврат в guide наблюдался; равенство полного вектора runtime-переменных сохранённым defaults не измерялось. Перезапуски отделены от обычных клиентских переходов.

Доказательства: `evidence/run-03/actions.json` и `observations.json` внутри baseline. В 53 снимках — 50 наблюдений и три кадра без приёмки перехода. Независимые отчёты: [источник доступа](reviews/2026-11-03-access-source-audit.md), [просмотр всех снимков](reviews/2026-11-03-run03-visual-review.md).

### Четвёртый проход: ошибки доступа и ограничения

- Открыты все 16 подготовленных состояний в категориях «Доступ» и «Проверки». Служебный Restart и выбор состояния отделены от обычной навигации пользователя. В 63 снимках сохранены 62 наблюдения и один промежуточный кадр.
- Неверный формат контакта исправляется подстановкой email. Истёкший код остаётся ошибочным при подтверждении; повторная отправка очищает его и ошибку. После истёкшей сессии можно снова открыть подтверждение входа. Естественное истечение срока и серверные ограничения не проверялись.
- Дубликат регистрации сохраняет контакт при переходе ко входу. После технической ошибки повтор открывает подтверждение контакта с сохранёнными данными.
- Блокировка скрывает денежные действия на главной. Каталог показывает запрет; нажатие «Пополнить себе» возвращает к объяснению ограничения. Поддержка открывается с темой «Ограничения аккаунта», стрелка возвращает в тот же контекст. История доступна.
- Приостановка и закрытие аккаунта показывают свои пояснения и сохраняют балансы/историю. Открытие этих состояний проверено; остальные действия каждого из них ещё не пройдены.
- При подтверждённой личности и ожидающей организации пояснение соответствует KYB. После обновления статуса денежные действия появляются. Обратная комбинация также показывает правильное ожидание личности.
- Дополнительные документы KYC и KYB: отправка без файла вызывает ошибку; выбор подставляет `документ.pdf`; повторная отправка переводит нужную проверку на рассмотрение и скрывает форму. Реальный файл не выбирался и не загружался. После выбора файла прежнее предупреждение остаётся до отправки (B00-019).
- Отказ KYC и отказ KYB ведут в поддержку с разными темами. Возврат сохраняет соответствующий отказ и ограничения. Обращения не отправлялись.
- Ограничение сервиса скрывает денежные действия и оставляет историю; поддержка и возврат сохраняют контекст.
- Найдено B00-018: fixture «Ссылки недоступны» всё же позволяет открыть форму, создать PL-1043 и увидеть её первой в списке. Статический аудит подтвердил отсутствующие guards в действиях создания. Это поведение прототипа; серверные разрешения не проверялись.

Таблица всех 16 входов со снимками: [access-state-matrix.md](access-state-matrix.md).

Доказательства: `evidence/run-04/actions.json` и `observations.json` внутри baseline. Независимый [визуальный отчёт](reviews/2026-11-03-run04-visual-review.md) охватывает все кадры. Подготовленные ошибки и имитация проверок не подтверждают работу доставки кодов, файлов, внешнего провайдера или денежных сервисов.

[Проверка интеграции](reviews/2026-11-03-run04-integration-review.md) подтвердила 256 изображений, 179 наблюдений и 360 строк покрытия. Ссылки, размеры и контрольные суммы согласованы; исходная копия `.fig` не изменилась. Причины расхождений подтверждены в [аудите ссылок](reviews/2026-11-03-no-links-source-audit.md) и [аудите доступа](reviews/2026-11-03-access-source-audit.md).

### Пятый проход: банковское пополнение и повтор

- Отдельный Restart и вход в готовый личный кабинет. До пополнения EUR 12 450,00; OP-IN-002 не показана. Ожидающая криптооперация уже присутствовала и не относится к созданному банковскому пополнению.
- Каталог «Пополнить себе» открывает P1 с EUR/Германия/SEPA. Раскрыты четыре фиатных баланса; USD меняет валюту и оставляет SWIFT, возврат на EUR восстанавливает SEPA/SWIFT. Список стран прокручивается; Швейцария оставляет SWIFT, Германия возвращает SEPA. У SWIFT срок до трёх рабочих дней, у SEPA до одного. Остальные сочетания стран и валют этим не проверены.
- Инструкция SEPA показывает получателя, IBAN, BIC, назначение TOPUP-002, сумму 250 EUR, комиссию 2,50 и net 247,50. Копирование показывает локальную подпись; системный буфер не проверялся. Крестик возвращает в форму, её стрелка в каталог. OP-IN-002 появляется в истории как «Ожидаем поступление», баланс не меняется.
- Повторное открытие инструкции из деталей сохраняет прежние реквизиты, но также старую подпись «Реквизиты скопированы» (B00-021). Escape закрывает диалог и сохраняет детали.
- Повтор той же формы открывает инструкцию уже поверх существующей OP-IN-002. Подпись копирования сброшена. После закрытия и возврата в истории одна видимая OP-IN-002 с прежними суммами. В прототипе используется один слот операции; это не проверка серверной защиты от дублей.
- «Проверить статус» имитирует подтверждение: OP-IN-002 становится «Выполнена», появляется номер PZ-261023-PAYIN-002, баланс EUR увеличивается до 12 697,50. Повторное открытие завершённой операции и возврат не меняют баланс. Реальный банк и платёжный сервис не подключались.
- Ссылка инструкции остаётся сразу после обновления статуса и исчезает после повторного открытия завершённых деталей (B00-022).
- Повтор после завершения с изменением SEPA на SWIFT переписывает ту же OP-IN-002: статус снова «Ожидаем поступление», текст говорит, что деньги не поступили, а прежний номер сервиса сохраняется. Баланс остаётся 12 697,50 (B00-020). Новая независимая операция не появляется. Источник подтверждает смешение прежних флагов завершения с новыми полями формы.
- После возврата из истории EUR на главную снова наблюдается B00-015: карточка EUR обведена, но список относится ко всем счетам. Единственный SWIFT оформлен как выбираемый вариант, что расходится с правилом фиксированных значений (B00-023).

В `evidence/run-05/` сохранён 41 снимок: 40 наблюдений и один промежуточный кадр 06. Все снимки просмотрены независимо. [Визуальный отчёт](reviews/2026-11-03-run05-visual-review.md) и [аудит банковского источника](reviews/2026-11-03-bank-funding-source-audit.md) разделяют факты экрана и статическую логику. Произвольный ввод суммы, все ошибки и остальные банковские направления ещё не приняты.

### Шестой проход: оплата своей картой и перевод по номеру карты

- Пройдены две отдельные ветки, каждая после Restart и входа через guide. В обеих исходный баланс EUR — 12 450,00, сумма — 250,00, комиссия — 2,50, к зачислению — 247,50. Это подготовленные данные прототипа, а не проверка реальных тарифов.
- «Оплатить своей картой» открывает диалог «Продолжить пополнение». Если закрыть его до нажатия «Перейти к оплате», OP-IN-002 уже видна в истории в ожидании. В деталях есть предупреждение не оплачивать повторно, хотя платёжная страница ещё не открывалась. Баланс не меняется.
- Повторное открытие формы через EUR «Пополнить» возвращает банковский SEPA. После нового выбора своей карты диалог открывается поверх прежней операции. «Перейти к оплате» ведёт прямо в её ожидающие детали: платёжной страницы или выбора карты нет (B00-024). Источник подтверждает обычный переход к T2. Внешний сервис здесь ещё предстоит определить.
- Помощь из карточной операции сохраняет OP-IN-002 и тему «Статус операции»; стрелка возвращает к тем же деталям. Обращение не отправлялось.
- «Проверить статус» имитирует завершение. История показывает ту же OP-IN-002, EUR становится 12 697,50. Повторный просмотр и возврат не увеличивают баланс ещё раз. В реквизитах завершённой карточной операции остаётся текст «Карта выбирается на странице оплаты»; конкретная карта не выбиралась. На главной повторяется несогласованность обводки EUR и общей истории B00-015.
- «Перевод по номеру карты» — отдельный способ внутри той же категории. Он меняет основное действие на «Получить инструкции»; повторный клик категории сохраняет этот выбор. Диалог показывает Алексея Морозова и номер `4000 1234 5678 9021`, без IBAN, BIC и назначения банковского перевода.
- Копирование показывает подпись рядом с иконкой; Escape возвращает форму. На главной видна ожидающая операция без прироста баланса. Детали сохраняют номер карты и способ; повторное открытие инструкции сохраняет также старую подпись копирования (B00-021). Крестик возвращает в детали.
- Проверка статуса перевода по номеру карты имитирует завершение и прирост EUR на 247,50. Инструкция видна сразу после обновления, но исчезает после повторного входа (B00-022). Возврат сохраняет 12 697,50 и завершённую запись; второе зачисление при просмотре не наблюдалось.

В `evidence/run-06/` сохранены 36 наблюдений со снимками и порядком действий. [Независимый визуальный отчёт](reviews/2026-11-03-run06-visual-review.md), [разбор карточной логики](reviews/2026-11-03-card-funding-source-audit.md) и [матрица веток пополнения](funding-state-matrix.md) отделяют проверенные переходы от будущей интеграции. Не проверены реальные списания, подтверждения провайдера, произвольный ввод, все отрицательные исходы и серверная защита от дублей.

[Независимая проверка интеграции](reviews/2026-11-03-run06-integration-review.md) подтвердила 333 изображения, 255 наблюдений и 436 строк покрытия: ссылки, размеры и контрольные суммы согласованы, исходный `.fig` не изменён. Независимый просмотр помог уточнить обводку EUR при возврате в первом карточном сегменте; в реестр внесено подтверждённое снимком состояние. При следующих проходах нужно так же разделять сегменты после Restart и проверять кадр, а не выводить его содержание из имени файла.

Рецепты и изображения — в `figma-work/migration-baseline/states.json`. Native JPEG отражают видимую область и оболочку Figma; PNG фреймов предназначены для полной геометрии. Restart наблюдался; полная воспроизводимость всех сценариев после перезапуска ещё не принята.

## Что осталось до закрытия пакета 00

| Проверка | Статус |
| --- | --- |
| Полный обход 23 входов, условных веток, ошибок, ожидания и возврата | Входы и возвраты всех 18 денежных действий D1 проверены; основные цепочки доступа и KYC/KYB пройдены; 16 специальных состояний открыты, часть возвратов проверена; все ограниченные маршруты и полные платежи не приняты |
| Каждый интерактивный элемент → состояние → действие → результат | Реакции сохранены; нужны рецепты и фактическое прохождение |
| Редактор / Present / снимок | Данные узлов и переменных сверены; полная визуальная и поведенческая эквивалентность не доказана |
| Чистый повтор, таймеры, hover/pressed, клавиатура и фокус | Не проверено полностью |
| Роли O2/O3/O4 и двух Option / DE | У оверлеев есть входящие связи; исключать нельзя. Option / DE остаются открытыми фрагментами |
| Правила реального ввода, файлов, ошибок и точности | 100 кандидатов полей учтены; готовые подстановки Figma не определяют произвольную валидацию |
| SVG, шрифты и их лицензии/символы | Исходные данные сохранены; комплект frontend-ассетов ещё не собран |
| Approval и PDF | Есть в архиве; актуальность относительно Product отдельно не принята |
| Полная независимая приёмка | Проверены данные, граф и снимки шести проходов; пакет целиком ещё не принят |

## Следующий небольшой шаг реализации

Завершить перенос и проверку двух выбранных композиций Главной. Затем подключить девять контекстов реквизитов/адресов и остальные исходящие связи небольшими пакетами. Локальные способы пополнения проверяются перед реализацией соответствующего семейства, а не задерживают Главную. B00-015–024 остаются открытыми; неизвестные правила и исходы не заменяются догадками.

После изменения Figma оформлять разницу с этим снимком, не заменять эталон молча. Результат сохранён локально; публикации и подключения финансовых сервисов не было.

### Strict visual comparison - 3 November 2026

Fresh source PNGs were exported at 1440x1000. Browser geometry and loaded SVG slots were checked at that same viewport; see evidence/dashboard/strict-card-geometry.json and strict-column-geometry.json. Corrected compact selection outline inset by 1px, action label leading (14.3px in a 15px slot), history underline font metrics, and the exposed bottom background (#f6f6f6). Result images: variant-1-audit.jpg and variant-2-audit.jpg. The browser returns JPEG, so these are not lossless pixel-diff proof. Build and two domain tests pass. Impeccable flagged Inter as common; it is intentionally retained to match the source. B00-025 resolved by user decision: keep account filtering, including content-dependent history height and position, as an approved exception to the source screenshots. Incomplete outgoing routes remain outside acceptance.

### Fictional history requested by the user - 3 November 2026

Added 16 fictional operations (20 total) across fiat and crypto accounts. The original four source records remain in sourceDashboardFixture for the historical baseline. Preview shows up to four recent rows after account filtering; CHF remains empty. Completed outgoing transfers use Completed / the RU equivalent, rather than Credited. All five crypto assets use wallet labels. Build and two tests pass; independent fixture review confirms unique IDs, descending dates and no invented Figma node IDs. Browser checks covered USDC/EUR/USD/BTC/CHF and English statuses. Filled USDC history matches source bounds: cards 280/617/1120/324; columns 616/535/784/340. Evidence: variant-1-history-filled.jpg, variant-2-history-filled.jpg. Earlier language treating filter approval as permission to move/resize history is superseded; the approved change concerns filtering and user-requested fictional content. The All history route remains unimplemented.

### Card spacing refinement - 3 November 2026

User supplied Figma 2790:1392: selected card uses a real 1px border, 12px padding and space-between. Cards-layout cards/fiat row now measure 156px high; selected content gaps measure 18.05px. Crypto grid uses five equal fractional columns, fixing the old 2px-short row. A stable native scrollbar gutter prevents width changes across filtered 0/2/4-row histories. At viewport1440, all section right edges are1385 (native gutter15); last crypto edge1384.992 is subpixel rounding. Seven selected states checked; both16px icons loaded and match source hashes. Column and historical baseline styles were not changed. Build passes. Evidence: card-spacing-checks.json and card-spacing-updated.jpg. This user-approved geometry supersedes the earlier compact144px cards.

### Iconity adoption - 3 November 2026

The user supplied the Iconity archive and explicitly chose archive-only glyphs. All current icon slots now use src/components/Icon.tsx in cards, columns and the historical composition. Nine local JSONs are unmodified archive exports; static SVGs use their own rest frames. Cards uses Coupon and plus uses Add_Circle because exact prior glyphs are absent. Hover plays one approximately280ms cycle, returns to rest, and cancels on pointer leave. Keyboard and reduced-motion paths stay static; JSON and the SVG renderer are lazy-loaded. Source paths/hashes/rest frames and limitations are documented in frontend/ICONS.md. The archive's HTML/AE/AI files were not executed. Historical baseline composition/data are retained, but its icons now follow the user's project-wide request.

Iconity verification: build and two domain tests pass. Actual browser interactions started all nine animations; plus/transfer replayed twice, and completion returned every icon to its static frame. Keyboard Tab focus did not animate. Both main compositions show nine loaded Iconity slots at20/16px; historical composition shows25 instances, all Iconity. Console errors: none. Reduced-motion behavior was reviewed in code/CSS, not emulated at OS/browser level. Independent review checked lifecycle, mappings, archive byte identity and static SVG validity. Temporary candidate assets and inspection HTML were removed. Evidence: iconity-interactions.json and iconity-dashboard.jpg.


### Receiving dialogs and colour previews — 5 November 2026

Implemented the next local package: nine receiving contexts shared across both layouts, real copy-all/individual clipboard actions, close/Escape, focus return and explicit Tab wrap. Fresh Figma context and live receiving initializers were read; no Figma mutation. Bank dialog matches720×478, crypto316high andXRP354high at1440×1000. See batches/02-receiving-details.md and evidence/dashboard/receiving-checks.json for coverage/limits. The source archive now supplies11Iconity glyphs, including copy_1 andClose_Circle.

Both layouts have green andorange previews via theme query parameter; default remainsneutral. Tokens/reference roles are canonical in frontend/DESIGN.md. Four screenshots and themes-geometry.json compare17cards-layout elements /18column-layout elements against neutral: same measured bounds and text. All9 contexts exercised in bothlayouts; EUR bulk copy RU/EN, IBAN, USD leadingzeroes, XRP address andCHFempty checked. Independent source/code and visual reviews found no blocking issues. Build and4tests pass.

Next: user reviews colour/composition; continue remaining neutral scenario packages while palette is pending. No palette approval inferred. Approval/PDF was not overwritten with these provisional alternatives. Financial actions/history detail still unimplemented; no backend/publication. Full mobile product layout still requires adaptation; new dialog is usable at390px. Browser JPEG is not a lossless pixel diff; clipboard denial not force-tested, no human usability observation.


### Reference-led colour refinement — 5 November 2026

User narrowed active review to cards/green and columns/orange, rejecting the muted initial colours. Reopened actual Solithic/Pulse/Budgetly/Zaptix images. Reworked colour relationships: cool green field, mint/emerald selected surface with milky inset light; peach-to-white orange environment, charcoal actions, selected lilac/peach/orange transition. No geometry/type/data/behaviour changes. Mismatched old coloured URLs normalise to the selected pairing, neutral mode retained. DESIGN.md now records current values and reference roles; no final palette approval inferred.

Refinement verification: both canonical coloured URLs render and old cross-pair URLs normalise correctly. Browser measured17/18elements against neutral: geometry/text unchanged. Open receiving dialog remains720×316 with loadedIconityassets. Contrast minima body5.80/5.72, secondary5.47/4.86, links6.25/4.81. Independent reference review confirmed stronger correspondence and flagged heavycharcoal actions as a point for subjective review, not a blocker. Build passes. Evidence: cards-green-v2.jpg, columns-orange-v2.jpg, theme-v2-checks.json, theme-v2-contrast.json.

## 2026-11-05 — Dashboard visual revision V3

V2 was rejected for visual quality despite technical checks. V3 revises hierarchy, typography, grouping, surfaces and history using the actual Solithic, Pulse, Budgetly and Zaptix images. Green selected balance now leads its currency code; orange balance/actions form one surface with a 40px gap before history. Neutral source styling remains separate; themed typography, radii and geometry intentionally differ. Home now clears both selection outline and history filter.

Independent design review requested stronger green saturation, selected-balance hierarchy and a smaller orange history gap; all three were corrected and sharp 1440x1000 screenshots reviewed again. No substantial remaining visual defect reported for those desktop states; user approval is still pending.

Verified RU desktop, EN overflow, BTC selection, Home reset, CHF empty history, address dialog and Escape. Four tests and production build passed, no browser errors observed. At a requested 390px viewport the layout still measures 1440px wide: mobile product composition remains unfinished. Evidence: cards-green-v3.jpg, columns-orange-v3.jpg, contrast-v3.json (minimum checked small-text combination 4.60:1). Result is local; remaining routes/backend not implemented. No independent human usability observation.

## 2026-11-05 — Pulse material from the user's 10:23 screenshot

Replaced V3 flat gradients on the selected green card and orange selected account/context with layered colour pools, diffuse milky inner rims, white foreground and translucent green action circles. Shared hue tokens preserve a common material; wide orange panel has explicit ellipse proportions to avoid a horizontal metallic stripe. Geometry and handlers unchanged. Checked both desktop variants, BTC selection and address dialog/Escape; production build passed. Independent material review corrected the earlier mistaken advice to remove all-edge glow and identified the orange metallic stripe, subsequently softened/localized. Source is the supplied screenshot plus stored Pulse images; no original CSS/effect parameters are available, so pixel identity has not been established. Existing contrast-v3.json is historical and does not verify the new white-on-gradient foreground.


## 2026-11-05 — Readability correction

User rejected white-on-pale material as unreadable. Green now uses saturated emerald with opaque white ink and no text glow. Orange keeps a clean orange/gold field, white large balance, dark small labels and dark actions on milky surfaces. Permanent selection outline remains transparent. Measured actual backgrounds with ink temporarily hidden; restored CSS and verified no diagnostic rules remain. Evidence: rendered-contrast-readable.json, green/orange-contrast-background.jpg and green/orange-readable-detail.jpg. Initial RU USDC estimates: small text >=4.59 green and >=4.65 orange; orange large balance3.28, icons>=3.95. JPEG estimates and conservative/recalculated final adjustments are documented, not claimed as a lossless or site-wide WCAG audit. Independent visual review confirms readability of checked states. Build passed. Local only.

### 2026-11-05 — Mixed active material and orange alignment
- Added cards/mixed as a third local variant; after user correction, only selected card is colored, all others white. Source is Pulse Today's top insight (e560182… PNG), rather than distributing colors to every account.
- Preserved existing two themes. Orange column panel top aligns to EUR card; history heading aligns to crypto heading.
- Browser: USDC → EUR changes selection/history, EUR receiving dialog opens and Escape closes. Selected border computed transparent. Main panel / EUR y=199; crypto/history y=490 at 1440 viewport.
- New mixed text contrast measured on ink-free browser JPEG, minimum6.32:1; this is scoped text evidence, not whole-app accessibility certification. Diagnostic CSS removed. Build passed.
- Evidence: mixed-pulse.jpg, mixed-pulse-detail.jpg, mixed-contrast.json, orange-aligned.jpg under evidence/dashboard. Local only; full mobile dashboard remains pending as before.

### 2026-11-05 — Direct Pulse colors / circular actions / active navigation
- Replaced rejected dark green/orange light maps with sampled source stops; source and conservative contrast evidence in pulse-sampled-colors.json. Same material applied to active navigation (including mixed).
- Orange actions now52px circles with white28–48% surfaces and labels below; no long filled buttons. Green circles remain32px within compact card. All inactive account surfaces white.
- Browser: reviewed both desktop layouts, switched USDC→EUR→USDC, verified white inactive card and filtered history, activated orange funding with Enter (existing unimplemented-flow notice shown). Existing column alignment retained: panel/EUR y199 and history/crypto y490.
- Build passed. Independent reviewer inspected four fresh captures and found no substantial visual mismatch with the requested material/circle/menu changes. Exact pixel equality not claimed; dark ink is intentional legibility adaptation. Full mobile and unimplemented financial routes remain outside this visual revision.
- Evidence: green-pulse-sampled(.jpg/-detail.jpg), orange-pulse-sampled(.jpg/-detail.jpg). Local only.

### 2026-11-05 — Column alignment recheck, deselected state
Confirmed the two user-requested alignments in the current orange view. Fixed history jumping to grid row1 when the selected account is toggled off: explicitly placed .column-history in row2. Browser measured equal panel/EUR tops and equal history/crypto heading tops, with and without selection. Independent source review confirmed the fix. Build passed; current local evidence is columns-alignment-confirmed.jpg.

### 2026-11-05 — Consistent action glyphs
Removed the black ring from the Iconity Add_Circle derivative, preserving its animated parent and the translucent white button circle. Shared plus/transfer assets now have equal 12px optical bounds and approximately 1.75px stroke in a 16px slot; static and animated view boxes match. Independent source review caught transfer animation clipping after normalization; scoped visible SVG overflow preserves its trajectory. Browser verified both action rest states, two paths per glyph, equal 16px slots, preserved 52px white circles and visible animated SVG overflow. Build passed. Evidence: action-icons-normalized.jpg. Shared component applies to all variants; local only.

### 2026-11-05 — Remove hard selected-card rim
User rejected the saturated contour around orange USDC. Background was painting beneath its transparent1px structural border beyond the inset light. Clipped active materials to padding-box and removed hard exterior rings, retaining soft inset light and exact geometry (orange USDC312×71.59375 at280,522 before/after). Independent review confirmed cause and flagged selected keyboardfocus suppression; explicit focus-visible outline now works only for keyboard. Browser checked BTC selection, keyboard return to USDC, focus style and resting screenshot selected-soft-edge.jpg. Build passed; local only.

### 2026-11-05 — Equal column account heights
All nine orange-column account cards now share312×64px bounds,8px vertical padding and4px internal gap; selection does not resize cards. Fiat list280px and crypto352px are content-sized. Right grid derives its first row from the shared64px token, retaining aligned crypto/history headings at y495. Browser verified USDC→BTC→USDC, all nine measured heights, and EN content without clipping. Independent review identified selector-specificity traps; group-qualified rules resolve them. Evidence: column-equal-card-heights.jpg. Neutral historical layout unchanged. Local only.

### 2026-11-05 — No-selection history starts at the top
New explicit user correction supersedes the earlier reserved empty panel slot: when no account is selected, orange column history moves to the top. Boolean(account) drives the layout state; null state uses one grid row and matching24px headings/8px gap. Browser measured left/right headings y167 and surfaces y199; selected state retains panel/EUR y199 and history/crypto headings y495. Toggled selected→null→selected→null successfully. Independent review confirmed alignment arithmetic and required min-height override. Build passed. Evidence: columns-no-selection-top-aligned.jpg. Local only.

### 2026-11-05 — Carry common corrections into green
User explicitly confirms common refinements apply to green too. Shared Iconity glyphs and soft active edges already apply. Fixed green/mixed card internals with one full-width grid column and17/51/26px rows,18px gaps,12px padding and uniform transparent1px borders. All cards remain156px; headings/balances now stay at13/117px from card top regardless of selection. Crypto amounts keep22px in both states. Browser verified USDC→BTC and keyboard deselection/reselection, stable history y577, all nine heights and header/requisites gaps. Screenshot: green-shared-refinements.jpg. Independent source review confirmed fixed geometry; build passed. Column-specific no-selection history behavior does not alter the green cards composition. Local only.

### 2026-11-05 — Selected panel matches both fiat-list edges
User requests matching bottom as well as top. Changed orange panel alignment from start to stretch in its existing280px grid row; space-between distributes its content. Browser measurements for USDC and EUR confirm both panel and fiat list top199/bottom479/height280. No-selection rules unaffected; green cards have no corresponding side panel. Independent source review confirmed the sizing mechanism. Build passed. Evidence: column-panel-both-edges-aligned.jpg. Local only.

### 2026-11-05 — Calm jade green
Reduced lime saturation/yellow in the green Pulse field with six jade stops; retained gradient geometry, soft rim and white circles. Applied via shared green material to selected cards and active navigation. Actual browser inspected EUR state, same156px height, and rendered CSS stops; independent visual reviewer confirms reduced acidity with preserved volume. Conservative authored-stop text contrast minimum4.875:1 for the two actual inks (scoped palette calculation, not full-app certification). Build passed. Evidence: green-calm-jade.jpg and green-calm-jade-contrast.json. Local only.

### 2026-11-05 — 40px right edge and header alignment
Fixed orange grid inherited space-between leaving its implicit column at738.43px rather than available856px (1512px viewport). Explicit minmax(0,1fr) now fills the width. Themed header padding-inline changed24→40px. Browser measured orange content left40/right40, panel/history right40 in selected and null states; owner right40 in both green and orange. Independent source review confirmed cause. Build passed. Evidence: orange-40px-edges.jpg, green-owner-40px.jpg. Local only.

### 2026-11-05 — History matches crypto stack boundaries
Matched column-history heading24px and gap8px to the left crypto group, removing28px vertical offset. Selected history min-height derives from5×64px cards plus4×8px gaps (352px); natural overflow is retained for future longer content. Browser confirms USDC list and crypto stack top527/bottom879, also emptyCHF samebounds; nullselection still moves history to y199. Independent review confirmed28px cause and cautioned against content clipping. Build passed. Evidence: history-crypto-edges-aligned.jpg. Local only.

### 2026-11-05 — Subtle link text and underline
User clarifies both text and underline should be translucent at rest and opaque on hover, without thicker lines. Shared themed links use opacity.85, underline35% and1px; hover uses opacity1/currentColor/1px, keyboardfocus restoresopacity1. Removed selected-card opaque-underline overrides. Independent specificity review preserved history offset:auto. Actual browser green/orange checks confirmed rest.85 vs hover1 and thickness1px in both; receiving dialogs still open/Escapeclose. Build verified. Evidence: link-subtle-text-and-underline.jpg. Local only.


### 2026-11-06 — 04b registration and restricted account context
Personal/business registration, OTP, preserved draft, duplicate handling, typed persisted identity, empty new wallet and money-action restrictions implemented locally. Independently reviewed; 21 tests/build pass; Chromium desktop/mobile RU/EN and storage failures verified. Found/fixed corrupt registry fallback, unavailable storage startup, session write failure, business sidebar label and narrow English type button wrapping. Source evidence, code and browser checks recorded in batches/04b-registration.md and reviews/2026-11-06-registration-browser.md. Next dependent work: verification 04g; not implemented or claimed completed. No push/publish.


### 2026-11-06 - 04c unified contact entry
User-approved replacement of separate login/signup: contact -> OTP -> existing account Home or confirmed new profile; per-contact drafts resume, expiring confirmation stays distinct from form data. Unknown contacts never receive seeded demo access. One executor and independent QA; found/fixed logout persistence fallback. 29 tests/build, 34 primary browser assertions, 18 negative assertions and 4 locale/viewport combinations pass. Report: reviews/2026-11-06-unified-entry-qa.md. Local only; no commit/push/publish. Real authentication/delivery/recovery/KYC remain external dependencies; approved reorder has not been synced to Figma exports.

### 2026-11-06 — Release verification before push
Independent QA found and main fixed stale account session during alternate-contact onboarding. Fresh 29 unit tests, 34 main browser checks, 18 edge checks, 10 account-switch checks and 4 locale/viewport combinations pass. Both standalone variants rebuilt. See reviews/2026-11-06-release-check.md. This is a checked local-adapter frontend snapshot, not production authentication or completed KYC/payment integration.
