import { Link } from 'react-router-dom'
import { Register } from '../components/Register'
import styles from './RegisterPage.module.css'

export function RegisterPage() {
  return (
    <main className={styles.page}>
      <div className={styles.heading}>
        <p className={styles.eyebrow}>Учебная доска</p>
        <h1 className={styles.title}>Регистрация</h1>
      </div>
      <Register onSubmit={async () => { /* реальной серверной авторизации в учебном проекте нет */ }} />
      <p className={styles.hint}>Уже есть аккаунт? <Link className={styles.switchLink} to="/login">Войти</Link></p>
      <Link className={styles.backLink} to="/">Назад к доске</Link>
    </main>
  )
}
