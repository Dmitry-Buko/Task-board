import type { Task, TaskPriority } from '../features/tasks/model/task'
import styles from './LegacyTaskCard.module.css'

interface LegacyTaskCardProps {
  task: Task
  onEdit(task: Task): void
  onMove(task: Task): void
  onDelete(task: Task): void
}

const priorityLabels: Record<TaskPriority, string> = { low: 'Низкий', medium: 'Средний', high: 'Высокий' }

export function LegacyTaskCard({ task, onEdit, onMove, onDelete }: LegacyTaskCardProps) {
  return (
    <article className={styles.card}>
      <h3 className={styles.title}>{task.title}</h3>
      {task.description && <p className={styles.description}>{task.description}</p>}
      <span className={`${styles.priority} ${styles[task.priority]}`}>{priorityLabels[task.priority]}</span>
      {task.dueDate && <p className={styles.dueDate}>Срок: {task.dueDate}</p>}
      <div className={styles.actions}>
        <button type="button" onClick={() => onEdit(task)} aria-label={`Редактировать: ${task.title}`}>Редактировать</button>
        <button type="button" onClick={() => onMove(task)} aria-label={`Переместить: ${task.title}`}>Переместить</button>
        <button type="button" onClick={() => onDelete(task)} aria-label={`Удалить: ${task.title}`} className={styles.delete}>
          <svg aria-hidden="true" focusable="false" className={styles.actionIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" x2="10" y1="11" y2="17" />
            <line x1="14" x2="14" y1="11" y2="17" />
          </svg>
          Удалить
        </button>
      </div>
    </article>
  )
}
