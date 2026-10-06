import { useId, useState } from 'react'
import styles from './Register.module.css'

interface RegisterProps {
  submitLabel?: string
  onSubmit(credentials: { email: string; password: string }): Promise<void>
}

export function Register({ submitLabel = 'Зарегистрироваться', onSubmit }: RegisterProps) {
  const emailId = useId()
  const passwordId = useId()
  const confirmPasswordId = useId()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [validationError, setValidationError] = useState<string>()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (password !== confirmPassword) {
      setValidationError('Пароли не совпадают')
      return
    }
    setValidationError(undefined)
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
        <input id={passwordId} type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" required />
      </div>
      <div className={styles.field}>
        <label htmlFor={confirmPasswordId}>Подтверждение пароля</label>
        <input id={confirmPasswordId} type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" required />
      </div>
      {validationError && <p className={styles.error} role="alert">{validationError}</p>}
      <button type="submit" className={styles.submit} disabled={isPending}>{submitLabel}</button>
    </form>
  )
}
