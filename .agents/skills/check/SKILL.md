---
name: check
description: Прогон готовности к сдаче из AGENTS.md — npm run check и npm run build со сводкой по стадиям
disable-model-invocation: true
allowed-tools: Bash(npm run check:*), Bash(npm run build:*)
---

Цикл готовности к сдаче из AGENTS.md — его же гоняет CI на push/PR.
Запускай из корня репозитория.

1. !`npm run check` — lint, typecheck, тесты
2. !`npm run build` — прод-сборка (только если первая прошла)

`npm run check` — цепочка через «&&»: если упал lint, typecheck и тесты
не запускались — отметь их «не запускались», а не «ок».

В конце сводка:
- lint / typecheck / тесты / build — по строке на стадию: «ок», «упало» или «не запускались»;
- для упавших — первая ошибка с файлом:строкой, без пересказа всего лога;
- вердикт: «Готово к сдаче» или «Чинить: <стадия>».

Ничего не чинить и не коммитить — только отчёт.
