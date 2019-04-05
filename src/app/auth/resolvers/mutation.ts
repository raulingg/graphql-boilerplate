import { GraphQLResolveInfo } from 'graphql'
import { ModuleContext } from '@graphql-modules/core'
import AuthProvider from '../providers/auth.provider'

export default {
  Mutation: {
    signup: async (
      _,
      args,
      { injector }: ModuleContext,
      info: GraphQLResolveInfo
    ) => injector.get(AuthProvider).signup(args.data, info),
    login: async (_, args, { injector }: ModuleContext) =>
      injector
        .get(AuthProvider)
        .loginWithCredentials(args.data.email, args.data.password)
  }
}
