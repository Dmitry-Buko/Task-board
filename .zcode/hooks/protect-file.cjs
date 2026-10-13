const fs = require('node:fs')

const input = JSON.parse(fs.readFileSync(0, 'utf8'))
const filePath = String(input.tool_input?.file_path ?? '')
  .replaceAll('\\', '/')

// Учебная фикстура закрыта от правок; матчится и относительный, и абсолютный путь
if (filePath.endsWith('.zcode/hook-fixtures/protected.txt')) {
  console.error('Учебный файл защищён хуком')
  process.exit(2)
}
