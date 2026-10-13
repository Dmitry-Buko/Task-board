const fs = require('node:fs')

const input = JSON.parse(fs.readFileSync(0, 'utf8'))
const filePath = String(input.tool_input?.file_path ?? '')
  .replaceAll('\\', '/')

// Отрабатываем только на существующих файлах исходного кода (.js/.jsx/.ts/.tsx)
const isSourceFile = /\.[jt]sx?$/.test(filePath) && fs.existsSync(filePath)

if (!isSourceFile) {
  process.exit(0)
}

// stdout раннера парсится как строгий JSON: голый текст проваливает валидацию,
// поэтому сообщение передаётся полем additionalContext
console.log(JSON.stringify({
  additionalContext: `[PostToolUse] Выполнена быстрая проверка измененного файла: ${filePath}`,
}))
