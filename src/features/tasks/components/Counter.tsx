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
