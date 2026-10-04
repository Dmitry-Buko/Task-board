# AGENTS.md

Учебная канбан-доска задач (React + TypeScript + Vite) — стартовый шаблон курса Redev AI agents. **Поиск по задачам отсутствует намеренно**: его участник курса добавляет сам. Не «дополняйте» и не «чините» отсутствие поиска — это задание, а не баг.

CI (`.github/workflows/ci.yml`) на push/PR в main выполняет `npm run check` и `npm run build` на Node 22.

## Структура

- `src/app/` — точка входа `App`, `global.css`, интеграционные тесты `App.test.tsx`.
- `src/components/` — `TaskBoard` (главный контейнер всей логики доски) и `Legacy*`-компоненты.
- `src/features/tasks/` — модель `Task`, UI-компоненты формы/колонок/диалогов, демо-данные `seedTasks.ts`.
- `src/services/` — интерфейс `TaskRepository` и его localStorage-реализация.

# Работа с задачами

- Для отображения задач и вычисляемых показателей используй список,
  уже загруженный в `TaskBoard`; передавай его компонентам через props.
  Не читай `localStorage` напрямую в UI-компонентах. Для загрузки
  и изменения задач используй `TaskRepository`.

# Готовность

- Перед сдачей запусти `npm run check` и `npm run build`.

## Архитектурные правила

- **Паттерн «репозиторий»**: UI зависит только от интерфейса `TaskRepository` (`src/services/taskRepository.ts`). Реализация внедряется пропсом в `App`; компоненты не обращаются к хранилищу напрямую. Ошибки хранилища — через `TaskRepositoryError`.
- `createLocalStorageTaskRepository(storage, { createId, now })` получает `createId`/`now` через DI — в тестах подставляются детерминированные значения. В тестах также используются дубли репозитория на `vi.fn()` (см. `createRepositoryDouble` в `App.test.tsx`).
- Формат хранения: JSON-конверт `{ version: 1, tasks: Task[] }` под ключом `redev-task-board:v1`. Повреждённые данные молча восстанавливаются из `SEED_TASKS` с флагом `recovered: true` (UI показывает уведомление). При изменении схемы поднимайте `STORAGE_VERSION`.
- `LegacyTaskCard` **намеренно** читает localStorage напрямую, минуя репозиторий, и дублирует валидацию. Его поведение зафиксировано тестами в `App.test.tsx` — при рефакторинге хранилища проверяйте эти тесты. `LegacyBoardStats` хранилище не читает: принимает список задач через props из `TaskBoard` (правило раздела «Работа с задачами»).
- Перемещение задач — фиксированный цикл `todo → in-progress → done → todo` (см. `nextStatus` в `TaskBoard.tsx`).

## Конвенции кода

- Включён `verbatimModuleSyntax`: импорт только типов — строго `import type { ... }`.
- Компоненты — именованные экспорты без дефолтных; логика хуков по правилам `react-hooks`.
- Стили — CSS Modules (`*.module.css`), общие — `src/app/global.css`.
- Весь текст интерфейса, комменты README и тексты в тестах — **русские**; assertions завязаны на русские подписи (например, `Всего задач: 6`). Новые строки UI пишите по-русски.
- Тесты colocated с кодом (`*.test.ts` / `*.test.tsx`), окружение jsdom, setup в `src/test/setup.ts`.
- TypeScript strict-режим: `noUnusedLocals`/`noUnusedParameters` — неиспользуемые переменные ломают `typecheck`.

## Прочее

- Платформа разработки — Windows (Git Bash), путь репозитория содержит кириллицу (`Задания`) — заключайте пути в кавычки в shell-командах.
- Сброс демо-данных — действие «Восстановить пример» в UI (подтверждается диалогом).
