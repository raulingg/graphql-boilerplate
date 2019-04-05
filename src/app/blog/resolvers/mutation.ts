import { GraphQLResolveInfo } from 'graphql'
import { ModuleContext } from '@graphql-modules/core'

export default {
  Mutation: {
    createPost: (_, args, ctx: ModuleContext, info: GraphQLResolveInfo) =>
      ctx.db.mutation.createPost(
        {
          data: {
            title: args.data.title,
            body: args.data.body,
            published: args.data.published,
            author: {
              connect: {
                id: ctx.user.id
              }
            }
          }
        },
        info
      ),
    updatePost: async (_, args, ctx: ModuleContext, info: GraphQLResolveInfo) =>
      ctx.db.mutation.updatePost(
        {
          where: {
            id: args.id
          },
          data: args.data
        },
        info
      ),
    deletePost: (_, args, ctx: ModuleContext, info: GraphQLResolveInfo) =>
      ctx.db.mutation.deletePost({ where: { id: args.id } }, info),
    createComment: async (
      _,
      args,
      ctx: ModuleContext,
      info: GraphQLResolveInfo
    ) => {
      const postExists = await ctx.db.exists.Post({
        id: args.data.post,
        published: true
      })

      if (!postExists) {
        throw new Error('Unable to find post')
      }

      return ctx.db.mutation.createComment(
        {
          data: {
            text: args.data.text,
            author: {
              connect: {
                id: ctx.user.id
              }
            },
            post: {
              connect: {
                id: args.data.post
              }
            }
          }
        },
        info
      )
    },
    updateComment: (_, args, ctx: ModuleContext, info: GraphQLResolveInfo) =>
      ctx.db.mutation.updateComment(
        {
          where: {
            id: args.id
          },
          data: args.data
        },
        info
      ),
    deleteComment: (_, args, ctx: ModuleContext, info: GraphQLResolveInfo) =>
      ctx.db.mutation.deleteComment({ where: { id: args.id } }, info)
  }
}
