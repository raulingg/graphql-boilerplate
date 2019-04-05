import 'graphql-import-node'
import * as typeDefs from './schema.graphql'
import { GraphQLModule, ModuleContext } from '@graphql-modules/core'
import { Role } from '../../generated/prisma-client'
import resolvers from './resolvers'
import AuthProvider from './providers/auth.provider'
import CommonModule from '../../common'
import { ProviderScope } from '@graphql-modules/di'
import { Request, Response } from 'express'
import UserModule from '../user'

export interface ISession {
  request: Request
  response: Response
}

export interface ICurrentUser {
  id: string
  role: Role
}

const AuthModule = new GraphQLModule({
  name: 'AuthModule',
  imports: () => [CommonModule, UserModule],
  providers: () => [AuthProvider],
  typeDefs,
  resolvers,
  defaultProviderScope: ProviderScope.Session,
  async context(
    session: ISession,
    currentContext,
    { injector }: ModuleContext
  ) {
    let authToken: string | undefined = undefined

    try {
      authToken = session.request.get(AuthProvider.HEADER_NAME)

      if (authToken) {
        await injector.get(AuthProvider).authorizeWithToken(authToken)
      }
    } catch (e) {
      console.log(e.message)
      console.warn(`Unable to authenticate using auth token: ${authToken}`)
    }

    return { authToken }
  }
})

export default AuthModule
