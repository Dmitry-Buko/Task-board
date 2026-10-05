# Большой пример: подключение Counter к статистике доски

Реальный прогон в этом репозитории (октябрь 2026): компонент-счётчик
Counter создан по скиллу component, подключён к главной странице,
существующие тесты переведены на новую разметку. Обе стадии проверки зелёные.

## Задача

«Подключи Counter и я хочу его видеть на главной» — показать четыре
показателя статистики (Всего задач, В работе, Готово, Просрочено)
карточками-счётчиками вместо простых текстовых строк.

## Шаг 1. Компонент

`src/features/tasks/components/Counter.tsx` — «глупый» презентационный
компонент: сам ничего не считает и не знает, откуда берутся данные.

```tsx
import styles from './Counter.module.css'

interface CounterProps {
  label: string
  value: number
  tone?: 'default' | 'accent' | 'danger'
}

export function Counter({ label, value, tone = 'default' }: CounterProps) {
  return (
    <div
      className={tone === 'default' ? styles.counter : `${styles.counter} ${styles[tone]}`}
      aria-label={`${label}: ${value}`}
    >
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </div>
  )
}
```

Рядом `Counter.module.css` — карточка с рамкой и тенью, мелкая подпись
и крупное значение, тона `accent` (синий) и `danger` (красный),
мобильная адаптация на 639px.

Ключевой контракт для тестов — атрибут доступности:

```
aria-label={`${label}: ${value}`}   →   «Всего задач: 6»
```

## Шаг 2. Подключение через props

Правило AGENTS.md «Работа с задачами»: для показателей использовать список,
уже загруженный в `TaskBoard`, и передавать через props. Поэтому считает
`LegacyBoardStats`, а `TaskBoard` отдаёт ему `tasks` (этот пропс уже был).
`TaskBoard.tsx` в этом шаге не менялся вообще.

`src/components/LegacyBoardStats.tsx`:

```tsx
import type { Task } from '../features/tasks/model/task'
import { Counter } from '../features/tasks/components/Counter'
import styles from './LegacyBoardStats.module.css'

interface LegacyBoardStatsProps {
  tasks: Task[]
}

function formatDateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

// dueDate хранится как «ГГГГ-ММ-ДД», поэтому лексикографическое сравнение строк корректно.
function isOverdue(task: Task, today: string): boolean {
  return task.dueDate !== undefined && task.status !== 'done' && task.dueDate < today
}

export function LegacyBoardStats({ tasks }: LegacyBoardStatsProps) {
  const today = formatDateKey(new Date())
  const overdueCount = tasks.filter((task) => isOverdue(task, today)).length

  return (
    <section className={styles.stats} aria-label="Статистика доски">
      <Counter label="Всего задач" value={tasks.length} />
      <Counter label="В работе" value={tasks.filter((task) => task.status === 'in-progress').length} tone="accent" />
      <Counter label="Готово" value={tasks.filter((task) => task.status === 'done').length} />
      <Counter label="Просрочено" value={overdueCount} tone={overdueCount > 0 ? 'danger' : 'default'} />
    </section>
  )
}
```

Решения по тонам: «В работе» — постоянный `accent`, «Просрочено» —
`danger` только при счётчике больше нуля (нулевая просрочка — не плохая
новость, краснить её не нужно).

В `LegacyBoardStats.module.css` осталась только сетка на 4 колонки —
класс `.stat` удалён, потому что карточку теперь рисует сам `Counter`.

## Шаг 3. Тесты

Ассерты в `App.test.tsx` были завязаны на текст одним узлом:

```ts
expect(await screen.findByText('Всего задач: 6')).toBeInTheDocument()
```

Counter рендерит подпись и значение отдельными `<span>`, поэтому текст
целиком больше не совпадает ни с одним узлом. Зато совпадает `aria-label`,
и ассерты переведены на `ByLabelText` с теми же русскими строками:

```ts
expect(await screen.findByLabelText('Всего задач: 6')).toBeInTheDocument()
```

Всего затронуто 20 ассертов по четырём подписям («Всего задач»,
«В работе», «Готово», «Просрочено»). Строки не менялись — только способ
запроса. Это важно: ассерты остаются читаемой спецификацией интерфейса.

## Шаг 4. Проверка

```
npm run check   → lint ок, typecheck ок, 19 тестов зелёные
npm run build   → ок (33 модуля)
```

## Чек-лист на будущее

- Данные — только через props из `TaskBoard`; никакого localStorage в UI.
- Считающий код живёт рядом с данными (контейнер/статистика), компонент
  отображения остаётся презентационным.
- Русские строки UI и ассертов сохраняются дословно.
- Если разметка изменилась — проверь, чем теперь искать элемент:
  `ByLabelText` по aria-label, `ByRole` по роли, `ByText` по тексту.
- Негативные тона (`danger`) — только для ненулевых «плохих» значений.
- После wiring — полный прогон `check` + `build`, не только typecheck.
