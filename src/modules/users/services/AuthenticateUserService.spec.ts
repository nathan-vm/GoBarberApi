import CreateUserService from './CreateUserService'
import AuthenticateUserService from './AuthenticateUserService'
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHaskProvider'
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider'

import AppError from '@shared/errors/AppError'

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let createUser: CreateUserService
let authenticateUser: AuthenticateUserService
let fakeCacheProvider: FakeCacheProvider

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()
    fakeCacheProvider = new FakeCacheProvider()

    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    )
    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    )
  })

  it('should be able to authenticate user', async () => {
    const user = await createUser.execute({
      name: 'Jhon Doe',
      email: 'jhondoe@exemple.com',
      password: 'senha123456',
    })

    const response = await authenticateUser.execute({
      email: 'jhondoe@exemple.com',
      password: 'senha123456',
    })

    expect(response).toHaveProperty('token')
    expect(response.user).toBe(user)
  })

  it('should be not able to authenticate with wrong password', async () => {
    await createUser.execute({
      name: 'Jhon Doe',
      email: 'jhondoe@exemple.com',
      password: 'senha123456',
    })

    await expect(
      authenticateUser.execute({
        email: 'jhondoe@exemple.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should be not able to authenticate with non existing user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'jhondoe@exemple.com',
        password: 'senha123456',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
