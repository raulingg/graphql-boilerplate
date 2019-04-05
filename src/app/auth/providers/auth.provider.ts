import { Injectable, ProviderScope, Inject } from '@graphql-modules/di'
import { OnConnect } from '@graphql-modules/core'
import { getUserFromToken, generateToken, hashPassword } from '../../../utils'
import { ICurrentUser } from '..'
import { GraphQLResolveInfo } from 'graphql'
import bcrypt from 'bcryptjs'
import UserProvider from '../../user/providers/user.provider'

@Injectable({ scope: ProviderScope.Session })
export default class AuthProvider implements OnConnect {
  static HEADER_NAME: string = 'Authorization'
  currentUser?: ICurrentUser

  constructor(private userProvider: UserProvider) {}

  // This will be called once immediately after connection established and the session is constructed.
  async onConnect(connectionParams: any) {
    console.log('call onConnect ')
    const authToken = connectionParams[AuthProvider.HEADER_NAME]
    if (!authToken || this.currentUser) {
      return
    }
    try {
      this.currentUser = await this.authorizeWithToken(authToken)
    } catch (e) {
      console.log(e.message || e)
      throw new Error('Invalid token')
    }
  }

  async loginWithCredentials(email: string, password: string): Promise<any> {
    const user = await this.userProvider.find(
      { email },
      '{ id, role, password }'
    )

    if (!user) {
      throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      throw new Error('Unable to login')
    }

    return {
      token: await generateToken({ user: { id: user.id, role: user.role } })
    }
  }

  async signup(data: any, info: GraphQLResolveInfo): Promise<any> {
    const password = await hashPassword(data.password)
    const user = await this.userProvider.create(
      {
        ...data,
        password,
        role: 'User'
      },
      '{ id, role}'
    )

    return {
      token: await generateToken({ user: { id: user.id, role: user.role } })
    }
  }

  async authorizeWithToken(authToken: string): Promise<any> {
    this.currentUser = await getUserFromToken(authToken)

    return this.currentUser
  }

  me(info: GraphQLResolveInfo): Promise<any> {
    const currentUser = this.getCurrentUser()
    return this.userProvider.find({ id: currentUser.id }, info)
  }

  getCurrentUser(): ICurrentUser {
    if (this.currentUser) {
      return this.currentUser
    }

    throw new Error('User not found')
  }
}
