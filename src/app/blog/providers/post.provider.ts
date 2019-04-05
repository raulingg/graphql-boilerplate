import { Injectable, ProviderScope } from '@graphql-modules/di'
import { GraphQLResolveInfo } from 'graphql'
import PrismaBinding from '../../../common/providers/prisma.provider'
import {
  PostWhereUniqueInput,
  PostUpdateInput
} from '../../../generated/prisma-client'
import AuthProvider from '../../auth/providers/auth.provider'

@Injectable()
export default class PostProvider {
  constructor(
    private authProvider: AuthProvider,
    private prisma: PrismaBinding
  ) {}

  findById(id: string, info: GraphQLResolveInfo): Promise<any> {
    return this.prisma.db.query.post(
      {
        where: {
          id
        }
      },
      info
    )
  }

  get(args, info: GraphQLResolveInfo): Promise<any> {
    let currentUser

    try {
      currentUser = this.authProvider.getCurrentUser()
    } catch (error) {
      currentUser = null
    }

    if (!currentUser || currentUser.role !== 'Admin') {
      args.where = {
        ...args.where,
        published: true
      }
    }

    return this.prisma.db.query.posts(args, info)
  }

  async update(
    where: PostWhereUniqueInput,
    data: PostUpdateInput,
    info: GraphQLResolveInfo
  ): Promise<any> {
    return this.prisma.db.mutation.updatePost(
      {
        where,
        data
      },
      info
    )
  }

  delete(where: PostWhereUniqueInput, info): Promise<any> {
    return this.prisma.db.mutation.deletePost(where, info)
  }
}
