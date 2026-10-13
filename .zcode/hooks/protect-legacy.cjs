const fs = require('node:fs')

const input = JSON.parse(fs.readFileSync(0, 'utf8'))
const filePath = String(input.tool_input?.file_path ?? '')
  .replaceAll('\\', '/')

// Новый файл в src/components/ создавать нельзя; существующие редактировать можно
const inComponents = filePath.startsWith('src/components/')
  || filePath.includes('/src/components/')

if (inComponents && !fs.existsSync(filePath)) {
  console.error('ОШИБКА: Нельзя создавать новые компоненты в src/components/. Используй src/features/<feature>/components.')
  process.exit(2)
}
