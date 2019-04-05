import { GraphQLResolveInfo } from 'graphql'
import { ModuleContext } from '@graphql-modules/core'
import UserProvider from '../providers/user.provider'
import AuthProvider from '../../auth/providers/auth.provider'
import {
  UserWhereUniqueInput,
  UserUpdateInput
} from '../../../generated/prisma-client'

export default {
  Mutation: {
    updateMe: (
      _: any,
      { data }: { data: UserUpdateInput },
      { injector }: ModuleContext,
      info: GraphQLResolveInfo
    ) => {
      const currentUser = injector.get(AuthProvider).getCurrentUser()
      return injector
        .get(UserProvider)
        .update({ id: currentUser.id }, data, info)
    },
    updateUser: (
      _: any,
      { where, data }: { where: UserWhereUniqueInput; data: UserUpdateInput },
      { injector }: ModuleContext,
      info: GraphQLResolveInfo
    ) => injector.get(UserProvider).update(where, data, info),
    deleteUser: (
      _: any,
      { where }: { where: UserWhereUniqueInput },
      { injector }: ModuleContext,
      info: GraphQLResolveInfo
    ) => injector.get(UserProvider).delete(where, info)
  }
}
