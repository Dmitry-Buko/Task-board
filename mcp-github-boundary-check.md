# Проверка границ MCP-сервера github (эквивалент /mcp)

Дата: 2026-10-15 (после перевода сервера в проектный конфиг с read-only).
Метод: чтение конфигов ZCode, лог подключений, живой опрос сервера
(`tools/list` по JSON-RPC с теми же флагами, что в конфиге) и смоук-вызовы.
Токен из отчёта вырезан; в файлах репозитория его нет.

## Конфигурация

Проектный конфиг `<repo>/.zcode/config.json` → `mcp.servers.github`
(коммитится в репозиторий, токена в нём нет):

```json
"github": {
  "type": "stdio",
  "command": "C:\\Users\\HP ZBook 17 G3\\.zcode\\mcp\\github-mcp-server.exe",
  "args": ["stdio", "--toolsets", "issues,repos", "--read-only"]
}
```

Токен передаётся через переменную среды пользователя Windows
`GITHUB_PERSONAL_ACCESS_TOKEN` (аналог `GITHUB_MCP_TOKEN` из задания;
подстановка `${...}` в конфигах ZCode не раскрывается, поэтому ссылка в
конфиге невозможна — токен живёт только в среде). Запись `github` из
user-конфига удалена, чтобы не перекрывала проектную (user overrides workspace).

## Подключение без ошибки авторизации

Лог `~/.zcode/cli/log/zcode-2026-10-15.jsonl`:

```
mcp.server.connected  mcpServerName=github  workspaceKey=D:\Redev\Задания\Task-board
transport=stdio  toolCount=19
```

Живые вызовы в сессии после перезапуска прошли успешно:

- `get_file_contents` package.json → содержимое получено;
- `list_issues` / `issue_read` → issue #1 прочитан.

## Инвентаризация инструментов (19, все — чтение)

issues: `issue_read`, `list_issues`, `list_issue_fields`, `list_issue_types`,
`search_issues`.

repos: `get_commit`, `get_file_contents`, `get_label`, `get_latest_release`,
`get_release_by_tag`, `get_tag`, `list_branches`, `list_commits`,
`list_releases`, `list_repository_collaborators`, `list_tags`,
`search_code`, `search_commits`, `search_repositories`.

Отсутствуют (отфильтрованы `--read-only` / `--toolsets`): `issue_write`,
`add_issue_comment`, `update_issue_comment`, `sub_issue_write`,
`assign_copilot_to_issue`, `request_copilot_review`, `create_branch`,
`create_or_update_file`, `push_files`, `delete_file`, `create_repository`,
`fork_repository`, `delete_repository`, `create_pull_request`,
`update_pull_request`, `update_pull_request_branch`, `merge_pull_request`,
`pull_request_review_write`, `add_comment_to_pending_review` — а также весь
набор pull_requests и users.

## Сверка с требованиями «безопасного» варианта

| Требование (задание, Claude) | Аналог в ZCode | Статус |
|---|---|---|
| Сервер называется `github` | `github` | ✅ |
| `.mcp.json` в корне проекта | `.zcode/config.json` → `mcp.servers` в корне проекта | ✅ |
| Официальный URL `api.githubcopilot.com` | регион-блокирован (403 до OAuth, curl 2026-10-14); локальный официальный бинарник `github-mcp-server` | ❌ по букве, ✅ по духу |
| Токен через `${GITHUB_MCP_TOKEN}` | переменная среды пользователя Windows `GITHUB_PERSONAL_ACCESS_TOKEN`; в конфиге и Git токена нет | ✅ по духу |
| `X-MCP-Toolsets: issues,repos` | флаг `--toolsets issues,repos` (19 read-only инструментов) | ✅ |
| `X-MCP-Readonly: "true"` | флаг `--read-only`: write-инструменты не экспортируются | ✅ |
| Только read-only инструменты в `/mcp` | инвентарь выше: 19/19 — чтение | ✅ |

## Вывод

Граница read-only выполняется: сервер отдаёт только инструменты чтения
issues и репозитория; создание/изменение issue, веток и файлов невозможно
ни на уровне сервера (инструменты отфильтрованы), ни на уровне токена
(fine-grained, Contents/Issues — Read-only). Токен отсутствует в файлах,
истории Git и этом отчёте.
