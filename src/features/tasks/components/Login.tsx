import { useId, useState } from 'react'
import styles from './Login.module.css'

interface LoginProps {
  submitLabel?: string
  onSubmit(credentials: { email: string; password: string }): Promise<void>
}

export function Login({ submitLabel = 'Войти', onSubmit }: LoginProps) {
  const emailId = useId()
  const passwordId = useId()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsPending(true)
    try { await onSubmit({ email, password }) } finally { setIsPending(false) }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor={emailId}>Email</label>
        <input id={emailId} type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
      </div>
      <div className={styles.field}>
        <label htmlFor={passwordId}>Пароль</label>
        <input id={passwordId} type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
      </div>
      <button type="submit" className={styles.submit} disabled={isPending}>{submitLabel}</button>
    </form>
  )
}
