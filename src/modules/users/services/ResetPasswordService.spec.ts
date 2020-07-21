import AppError from '@shared/errors/AppError'

import ResetPasswordService from './ResetPasswordService'
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeHaskProvider from '@modules/users/providers/HashProvider/fakes/FakeHaskProvider'

import FakeUserTokenRepository from '@modules/users/repositories/fakes/FakeUserTokenRepository'

let fakeUsersRepository: FakeUsersRepository
let resetPasswordService: ResetPasswordService
let fakeUserTokenRepository: FakeUserTokenRepository
let fakeHaskProvider: FakeHaskProvider

describe('ResetPassword', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeUserTokenRepository = new FakeUserTokenRepository()
    fakeHaskProvider = new FakeHaskProvider()
    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokenRepository,
      fakeHaskProvider,
    )
  })

  it('should be able to reset the password ', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@exemple.com',
      password: '123456',
    })

    const { token } = await fakeUserTokenRepository.generate(user.id)

    const generateHash = jest.spyOn(fakeHaskProvider, 'generateHash')

    await resetPasswordService.execute({
      password: 'password',
      token,
    })

    const updatedUser = await fakeUsersRepository.findById(user.id)

    expect(generateHash).toBeCalledWith('password')
    expect(updatedUser?.password).toBe('password')
  })
  it('should not be able to reset the password with non-existing token', async () => {
    await expect(
      resetPasswordService.execute({
        password: '123456',
        token: 'non-existing-token',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to reset the password with non-existing token', async () => {
    const { token } = await fakeUserTokenRepository.generate(
      'non-existing-user',
    )

    await expect(
      resetPasswordService.execute({
        password: '123456',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to reset the password after 2h', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@exemple.com',
      password: '123456',
    })

    const { token } = await fakeUserTokenRepository.generate(user.id)

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date()

      return customDate.setHours(customDate.getHours() + 3)
    })

    await expect(
      resetPasswordService.execute({
        password: 'password',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
