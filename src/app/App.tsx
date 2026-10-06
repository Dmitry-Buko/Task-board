import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { TaskBoard } from '../components/TaskBoard'
import { LoginPage } from '../features/tasks/pages/LoginPage'
import { RegisterPage } from '../features/tasks/pages/RegisterPage'
import { createLocalStorageTaskRepository } from '../services/localStorageTaskRepository'
import type { TaskRepository } from '../services/taskRepository'

interface AppProps {
  repository?: TaskRepository
}

export function App({
  repository = createLocalStorageTaskRepository(window.localStorage),
}: AppProps) {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<TaskBoard repository={repository} />} path="/" />
        <Route element={<LoginPage />} path="/login" />
        <Route element={<RegisterPage />} path="/register" />
        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </BrowserRouter>
  )
}
