> Latest colour rule: decorative colours follow the active theme everywhere. Orange permits green only in explicit successful-status UI; incoming amounts/icons are theme accents. See WALLET-HOME-2026-11-05.md, Theme isolation. This overrides historical mixed-theme or palette notes below.

> Active variants: green/cards and orange/columns only. Mixed was rejected and removed on 5 November 2026; mentions below are historical.

> Current themed Home: see [5 November visual redesign](WALLET-HOME-2026-11-05.md). The notes below describe the preceding implementation; neutral Figma geometry remains preserved separately.

## 5 November — source colors and circular actions

Green/Orange materials rebuilt from median samples in the supplied Pulse 10:31:50 image. Green: lime top, vertical light at65%, saturated right; orange: apricot left, creamy light in lower-right. The same CSS material now renders the active sidebar. Orange action surfaces are52px translucent white circles with labels below; green retains32px circles in its compact156px card. Long action fills removed. Inactive accounts remain white. Dark ink preserves contrast without altering the source lightness. Existing neutral composition and mixed material retained; mixed sidebar now shares its selected-card material. This is a reference-based CSS reconstruction, not source CSS or verified pixel equality.

## 5 November: third variant and column alignment

`?layout=cards&lang=ru&theme=mixed` adds the Pulse Today’s top insight green–orange surface ONLY to the active account. All inactive cards stay white; the same material follows selection into fiat and crypto accounts. Source: Behance 257293617, image e56018257293617.6ad5b6f7df88a.png. Soft orange area above/centre, green perimeter and base, milky inset edge; reconstructed CSS, not original source CSS. Dark text is intentional for readability. Existing green/cards and orange/columns remain separate. Orange main panel aligns to the first account card; history aligns to the crypto heading.

# OraclePay — оформление Главной

## Фоны и внешние рамки, 10:42

Два workspace используют светлый `--ambient-field`: мятно-кремовый или персиково-кремовый поверх основного фона. Header и main прозрачны относительно общей подложки. У цветных карточек и панели добавлен внешний полупрозрачный промежуток с тонким белым контуром через box-shadow; у диалога — такой же внешний приём. История и белые карточки остаются непрозрачными. Размеры, локальные цветовые поля под текстом, foreground и обработчики не менялись. Светлая декоративная рамка не возвращает чёрную обводку выбранности.

Просмотрены оба desktop-экрана и диалог, проверено закрытие Escape. Независимое визуальное ревью не обнаружило слияния рамок или ухудшения читаемости. Числовой контраст внутри цветных поверхностей относится к прежней проверке: его определяющие слои в этой правке не изменены. Новый фон вне карточек составлен из светлых цветов.

## Читаемость — последняя коррекция

Светлые белые надписи пользователь признал плохо читаемыми. Зелёный материал усилен до насыщенного изумрудного; текст непрозрачный белый, без размытой тени. Оранжевый остаётся чистым и ярким: крупный баланс белый, мелкие подписи и суммы в списке — тёмный тёплый текст `#281003`, действия на молочных подложках с тёмными иконками. Это намеренно заменяет требование одинакового белого foreground у всех размеров, поскольку оно давало недостаточный контраст.

Проверен фактический фон под DOM-областями текста и иконок: на время контрольного снимка скрывался только текст/глифы, градиенты и поверхности кнопок сохранялись, затем текст восстановлен. Расчёт по худшему пикселю области (браузерный JPEG, не lossless-аудит) сохранён в `docs/migration/evidence/dashboard/rendered-contrast-readable.json`. Область проверки — начальный USDC, RU desktop, оба варианта. Проверка не распространяется автоматически на весь сайт и все будущие состояния.

## Прямые зелёный и оранжевый образцы Pulse, 10:31:50

Для материала теперь используются раздельные `--pulse-field` из нового скриншота пользователя: в зелёном локальный вертикальный свет правее центра и насыщенный правый край, в оранжевом абрикосовый левый край и сливочно-золотистый свет правее центра внизу. Оттенки адаптированы к мятной/абрикосовой гамме OraclePay. Общий inset-свет, молочные контролы, прозрачная граница выбранности и геометрия сохранены. Это заменяет прежнюю общую карту трёх пятен, полученную из фиолетового образца.

## Последняя правка — скриншот 10:27

Цветная выбранность теперь без постоянной чёрной обводки: сохранён прозрачный border для стабильной геометрии, aria-pressed и отдельный keyboard focus. Материал состоит только из оттенков зелёного/оранжевого и белого; коричневые цветовые остановки удалены. Текст молочный, Iconity-глифы белые с прозрачностью, круги и кнопки имеют полупрозрачную заливку и мягкие внутренние блики. Чёрная основная кнопка внутри оранжевой панели удалена. Эти решения заменяют противоречащие описания ранних V3/Pulse-проходов ниже; прежний отчёт контраста к ним неприменим.

## Уточнение материала Pulse после V3

По скриншоту пользователя от 5 ноября 10:23 прежние градиенты заменены единым материалом: три широких радиальных цветовых поля, тёмная нижняя левая область, светлая правая, мягкая молочная внутренняя кромка. Зелёная выбранная карточка и оранжевые выбранный счёт/панель используют одну карту света с разными `--pulse-*` токенами. Текст белый, круги действий полупрозрачные; интерфейс и иконки не размываются. Геометрия, обработчики и нейтральная тема не меняются. Это CSS-реконструкция по изображению, не извлечение оригинальных параметров эффекта; пиксельная идентичность не установлена. Ранее сохранённый contrast-v3.json относится к предыдущему материалу и не подтверждает контраст белого текста на новом градиенте.

5 ноября 2026, V3. Только **cards + green** и **columns + orange**. Пользователь ещё не утвердил направление. Общие данные, компоненты и сценарии сохранены. Нейтральный режим — отдельный эталон переноса Figma.

## Референсы

Просмотрены реальные изображения в `figma-work/reference-images/behance-2026-11-03/`. V1/V2 пользователь отклонил: простого изменения цветов недостаточно.

- Solithic: светлое прохладное зелёное поле, белые финансовые поверхности и иерархия.
- Pulse: локальный свет в выбранной карточке — лайм переходит в изумрудный. Убрана объёмная обводка по всем краям.
- Budgetly: крупный баланс, общая группа действий, графитовая основная и светлая вторичная кнопки.
- Zaptix: переход серо-сиреневого через персиковый к оранжевому в панели счёта.

Цвета адаптированы по изображениям, это не оригинальные HEX референсов. Чужие продукты, графики и декоративные блоки не добавлены.

## Визуальный слой

Inter с локальной кириллицей сохранён. Заголовок страницы 34/41, групп 16/24. Зелёный: выбранный баланс 26/26, код валюты 16; высота карточек 156px, padding 12px, равные ширины криптокарточек. Оранжевый: главный баланс 40/50, общая поверхность панели, горизонтальные кнопки 48px, промежуток 40px до истории. Радиусы 14–20px. История: тонкие разделители, тихие подписи, текстовые статусы на компактных плашках. Только Iconity; новых анимаций нет.

Это намеренные изменения типографики, группировки и отдельных размеров в цветных вариантах. Цветные экраны не объявляются геометрически 1:1 с прототипом. Нейтральные стили сохранены отдельно. Выбор счёта фильтрует историю и отмечается чёрной обводкой. Главная сбрасывает и фильтр, и обводку.

## Токены

Каноническая реализация — `src/themes.css`.

| Токен | Зелёный | Оранжевый |
| --- | --- | --- |
| `--canvas` | `#e9efeb` | `#f6f5f2` |
| `--canvas-top` | `#e4ece6` | `#f7ece1` |
| `--surface` | `#fff` | `#fff` |
| `--shell` | `#f8faf8` | `#fcfbf9` |
| `--subtle` | `#eff4f0` | `#f3f0eb` |
| `--secondary` | `#58675f` | `#655e56` |
| `--border` | `#dce5df` | `#e8e2da` |
| `--text` | `#1c3026` | `#292823` |
| `--strong` | `#193f30` | `#292b28` |
| `--on-strong` | `#fff` | `#fff` |
| `--accent-ink` | `#2c5a40` | `#9a420f` |
| `--active` | `#dfece2` | `#ffead8` |
| `--hover` | `#f2f7f3` | `#faf5ef` |
| `--action-hover` | `#d4e9d9` | `#f7ddc8` |
| `--selection` | `#c0dfc9` | `#fbd3b2` |
| `--scrollbar` | `#87998d` | `#9c9387` |
| `--success` | `#376048` | `#3f634a` |
| `--pending` | `#795319` | `#795319` |
| `--unknown` | `#635778` | `#635778` |
| `--success-bg` | `#e9f3ec` | `#ebf3e9` |
| `--pending-bg` | `#fbf1df` | `#fbf0dd` |
| `--unknown-bg` | `#f0edf5` | `#f0edf5` |

## Проверки и ограничения

Просмотрены оба RU-экрана 1440×1000; EN-подписи проверены на переполнение. Проверены выбор BTC, сброс Главной, пустая история CHF, адрес и Escape. Независимый дизайн-ревьюер повторно просмотрел оба чётких кадра после исправлений. Контраст — `docs/migration/evidence/dashboard/contrast-v3.json`; расчёт не заменяет визуальную приёмку.

Результат локальный. Полная мобильная композиция, остальные переходы и backend не готовы. Приложение сохраняет desktop min-width 1440px. Никакого независимого пользовательского теста не проводилось.
