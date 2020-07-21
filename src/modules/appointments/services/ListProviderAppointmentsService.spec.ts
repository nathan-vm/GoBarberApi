import ListProviderAppointmentsService from './ListProviderAppointmentsService'

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider'
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository'
// import AppError from '@shared/errors/AppError'
let fakeAppointmentsRepository: FakeAppointmentsRepository
let fakeCacheProvider: FakeCacheProvider
let listProviderAppointments: ListProviderAppointmentsService

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository()
    fakeCacheProvider = new FakeCacheProvider()
    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    )
  })

  it('should be able to list the appointments on a specific day', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 11).getTime()
    })

    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      date: new Date(2020, 4, 20, 14, 0, 0),
      user_id: 'user_id',
    })

    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      date: new Date(2020, 4, 20, 15, 0, 0),
      user_id: 'user_id',
    })

    const appointments = await listProviderAppointments.execute({
      provider_id: 'provider_id',
      day: 20,
      month: 5,
      year: 2020,
    })

    expect(appointments).toEqual([appointment1, appointment2])
  })
})
