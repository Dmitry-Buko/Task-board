import type { Task } from '../features/tasks/model/task'
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

  return (
    <section className={styles.stats} aria-label="Статистика доски">
      <div className={styles.stat}>Всего задач: {tasks.length}</div>
      <div className={styles.stat}>В работе: {tasks.filter((task) => task.status === 'in-progress').length}</div>
      <div className={styles.stat}>Готово: {tasks.filter((task) => task.status === 'done').length}</div>
      <div className={styles.stat}>Просрочено: {tasks.filter((task) => isOverdue(task, today)).length}</div>
    </section>
  )
}
