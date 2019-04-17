import {
  UserUpdateInput,
  UserWhereUniqueInput
} from '../../generated/prisma-client'
import IAppContext from '../../types/IAppContext'
import bcrypt from 'bcryptjs'
import { GraphQLResolveInfo } from 'graphql'

const user = {
  updateMe: async (
    _,
    { data }: { data: UserUpdateInput },
    { user, db }: IAppContext,
    info: GraphQLResolveInfo
  ) => {
    if (typeof data.password === 'string') {
      data.password = await bcrypt.hash(data.password, 10)
    }

    return db.mutation.updateUser(
      {
        where: {
          id: user.id
        },
        data
      },
      info
    )
  },
  updateUser: async (
    _,
    { where, data }: { where: UserWhereUniqueInput; data: UserUpdateInput },
    { db }: IAppContext,
    info: GraphQLResolveInfo
  ) => {
    if (typeof data.password === 'string') {
      data.password = await bcrypt.hash(data.password, 10)
    }

    return db.mutation.updateUser(
      {
        where,
        data
      },
      info
    )
  },
  deleteUser: (
    _,
    { where }: { where: UserWhereUniqueInput },
    { db }: IAppContext
  ) => db.mutation.deleteUser({ where })
}

export default user
