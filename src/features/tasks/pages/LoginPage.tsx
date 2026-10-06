import { Link } from 'react-router-dom'
import { Login } from '../components/Login'
import styles from './LoginPage.module.css'

export function LoginPage() {
  return (
    <main className={styles.page}>
      <div className={styles.heading}>
        <p className={styles.eyebrow}>Учебная доска</p>
        <h1 className={styles.title}>Вход</h1>
      </div>
      <Login onSubmit={async () => { /* реальной серверной авторизации в учебном проекте нет */ }} />
      <p className={styles.hint}>Нет аккаунта? <Link className={styles.switchLink} to="/register">Зарегистрируйтесь</Link></p>
      <Link className={styles.backLink} to="/">Назад к доске</Link>
    </main>
  )
}
