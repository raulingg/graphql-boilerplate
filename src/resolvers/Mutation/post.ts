import { PostCreateInput, PostUpdateInput } from '../../generated/prisma-client'
import IAppContext from '../../types/IAppContext'
import { GraphQLResolveInfo } from 'graphql'

const post = {
  createPost: (
    _,
    { data }: { data: PostCreateInput },
    { db, user }: IAppContext,
    info: GraphQLResolveInfo
  ) =>
    db.mutation.createPost(
      {
        data: {
          title: data.title,
          body: data.body,
          published: data.published,
          author: {
            connect: {
              id: user.id
            }
          }
        }
      },
      info
    ),
  updatePost: async (
    _,
    { id, data }: { id: string; data: PostUpdateInput },
    { db }: IAppContext,
    info: GraphQLResolveInfo
  ) =>
    db.mutation.updatePost(
      {
        where: {
          id
        },
        data
      },
      info
    ),
  deletePost: (_, { id }: { id: string }, { db }: IAppContext) =>
    db.mutation.deletePost({ where: { id } })
}

export default post
