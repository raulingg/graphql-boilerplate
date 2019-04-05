import { GraphQLResolveInfo } from 'graphql'
import { ModuleContext } from '@graphql-modules/core'
import AuthProvider from '../../auth/providers/auth.provider'
import UserProvider from '../providers/user.provider'

export default {
  Query: {
    users: (
      _: any,
      args: any,
      { injector }: ModuleContext,
      info: GraphQLResolveInfo
    ) => injector.get(UserProvider).get(args, info)
  }
}
