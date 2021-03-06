import { uuid } from 'uuidv4'

import IUserTokenRepository from '@modules/users/repositories/IUserTokenRepository'

import UserToken from '@modules/users/infra/typeorm/entities/UserToken'

class FakeUserTokenRepository implements IUserTokenRepository {
  private userTokens: UserToken[] = []

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken()

    Object.assign(userToken, {
      user_id,
      id: uuid(),
      token: uuid(),
      created_at: Date.now(),
      updated_at: Date.now(),
    })

    this.userTokens.push(userToken)

    return userToken
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = this.userTokens.find(
      findToken => findToken.token === token,
    )

    return userToken
  }
}

export default FakeUserTokenRepository
