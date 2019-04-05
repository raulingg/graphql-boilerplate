import { GraphQLResolveInfo } from 'graphql'
import { ModuleContext } from '@graphql-modules/core'
import PostProvider from '../providers/post.provider'

export default {
  Query: {
    posts: (_, args, { injector }: ModuleContext, info: GraphQLResolveInfo) =>
      injector.get(PostProvider).get(args, info),

    myPosts(_, args, ctx: ModuleContext, info: GraphQLResolveInfo) {
      args.where = {
        ...args.where,
        author: {
          id: ctx.user.id
        }
      }

      return ctx.db.query.posts(args, info)
    },
    postById: async (_, args, ctx: ModuleContext, info: GraphQLResolveInfo) => {
      const opArgs: any = {
        where: {
          id: args.id
        }
      }

      if (!ctx.user) opArgs.where.published = true
      else {
        if (ctx.user.role === 'User')
          opArgs.where.OR = [
            { published: true },
            { author: { id: ctx.user.id } }
          ]
      }

      const posts = await ctx.db.query.posts(opArgs, info)

      if (posts.length === 0) {
        throw new Error('Post not found')
      }

      return posts[0]
    },
    comments: (_, args, ctx: ModuleContext, info: GraphQLResolveInfo) =>
      ctx.db.query.comments(args, info)
  }
}
