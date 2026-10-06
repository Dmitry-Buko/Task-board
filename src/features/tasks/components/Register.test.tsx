import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Register } from './Register'

async function fillForm(user: ReturnType<typeof userEvent.setup>, password: string, confirmation: string) {
  await user.type(screen.getByLabelText('Email'), 'user@example.com')
  await user.type(screen.getByLabelText('Пароль'), password)
  await user.type(screen.getByLabelText('Подтверждение пароля'), confirmation)
}

describe('Register', () => {
  it('shows a validation message and skips onSubmit when passwords differ', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<Register onSubmit={onSubmit} />)

    await fillForm(user, 'secret-one', 'secret-two')
    await user.click(screen.getByRole('button', { name: 'Зарегистрироваться' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Пароли не совпадают')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits email and password when they match', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<Register onSubmit={onSubmit} />)

    await fillForm(user, 'secret-one', 'secret-one')
    await user.click(screen.getByRole('button', { name: 'Зарегистрироваться' }))

    expect(onSubmit).toHaveBeenCalledWith({ email: 'user@example.com', password: 'secret-one' })
  })

  it('shows an error and re-enables the button when onSubmit rejects', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockRejectedValue(new Error('сеть недоступна'))
    render(<Register onSubmit={onSubmit} />)

    await fillForm(user, 'secret-one', 'secret-one')
    await user.click(screen.getByRole('button', { name: 'Зарегистрироваться' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Не удалось отправить форму. Попробуйте ещё раз.')
    expect(screen.getByRole('button', { name: 'Зарегистрироваться' })).toBeEnabled()
  })
})
