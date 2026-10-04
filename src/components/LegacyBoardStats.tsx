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
