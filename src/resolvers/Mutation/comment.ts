import {
  CommentCreateInput,
  CommentUpdateInput
} from '../../generated/prisma-client'
import IAppContext from '../../types/IAppContext'
import { GraphQLResolveInfo } from 'graphql'

const comment = {
  createComment: async (
    _,
    { data }: { data: CommentCreateInput },
    { db, user }: IAppContext,
    info: GraphQLResolveInfo
  ) => {
    const postExists = await db.exists.Post({
      id: data.post,
      published: true
    })

    if (!postExists) {
      throw new Error('Unable to find post')
    }

    return db.mutation.createComment(
      {
        data: {
          text: data.text,
          author: {
            connect: {
              id: user.id
            }
          },
          post: {
            connect: {
              id: data.post
            }
          }
        }
      },
      info
    )
  },
  updateComment: (
    _,
    { id, data }: { id: string; data: CommentUpdateInput },
    { db }: IAppContext,
    info: GraphQLResolveInfo
  ) =>
    db.mutation.updateComment(
      {
        where: {
          id
        },
        data
      },
      info
    ),
  deleteComment: (_, { id }: { id: string }, { db }: IAppContext) =>
    db.mutation.deleteComment({ where: { id } })
}

export default comment
