import AppError from '@shared/errors/AppError'

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider'
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService'
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeUserTokenRepository from '@modules/users/repositories/fakes/FakeUserTokenRepository'

let fakeUsersRepository: FakeUsersRepository
let fakeMailProvider: FakeMailProvider
let sendForgotPasswordEmail: SendForgotPasswordEmailService
let fakeUserTokenRepository: FakeUserTokenRepository

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeMailProvider = new FakeMailProvider()
    fakeUserTokenRepository = new FakeUserTokenRepository()
    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokenRepository,
    )
  })

  it('should be able to recover the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail')

    await fakeUsersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@exemple.com',
      password: '123456',
    })

    await sendForgotPasswordEmail.execute({ email: 'jhondoe@exemple.com' })

    expect(sendMail).toHaveBeenCalled()
  })

  it('should not be able to recover a non-existing user password', async () => {
    await expect(
      sendForgotPasswordEmail.execute({ email: 'jhondoe@exemple.com' }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('sould generate forgot password token', async () => {
    const generate = jest.spyOn(fakeUserTokenRepository, 'generate')

    const user = await fakeUsersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@exemple.com',
      password: '123456',
    })

    await sendForgotPasswordEmail.execute({ email: 'jhondoe@exemple.com' })

    expect(generate).toHaveBeenCalledWith(user.id)
  })
})
