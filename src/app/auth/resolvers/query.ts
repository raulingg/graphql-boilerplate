import { ModuleContext } from '@graphql-modules/core'
import { GraphQLResolveInfo } from 'graphql'
import AuthProvider from '../providers/auth.provider'

export default {
  Query: {
    me: (_, __, { injector }: ModuleContext, info: GraphQLResolveInfo) =>
      injector.get(AuthProvider).me(info)
  }
}
