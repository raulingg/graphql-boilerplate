import { Injectable, ProviderScope } from '@graphql-modules/di'
import { GraphQLResolveInfo } from 'graphql'
import PrismaBinding from '../../../common/providers/prisma.provider'
import { hashPassword } from '../../../utils'
import {
  UserWhereUniqueInput,
  UserUpdateInput,
  UserCreateInput
} from '../../../generated/prisma-client'

@Injectable({ scope: ProviderScope.Application })
export default class UserProvider {
  constructor(private prisma: PrismaBinding) {}

  find(where: UserWhereUniqueInput, info: any): Promise<any> {
    return this.prisma.db.query.user({ where }, info)
  }

  get(args, info: GraphQLResolveInfo): Promise<any> {
    return this.prisma.db.query.users(args, info)
  }

  create(data: UserCreateInput, info: any) {
    return this.prisma.db.mutation.createUser({ data }, info)
  }

  async update(
    where: UserWhereUniqueInput,
    data: UserUpdateInput,
    info: GraphQLResolveInfo
  ): Promise<any> {
    if (data.password) {
      data.password = await hashPassword(data.password)
    }

    return this.prisma.db.mutation.updateUser(
      {
        where,
        data
      },
      info
    )
  }

  delete(where: UserWhereUniqueInput, info): Promise<any> {
    console.log(where)
    return this.prisma.db.mutation.deleteUser(where, info)
  }
}
