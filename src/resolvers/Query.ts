import { GraphQLResolveInfo } from 'graphql'
import IAppContext from '../interfaces/IAppContext'

const Query = {
  me: (_, __, { db, user }: IAppContext, info: GraphQLResolveInfo) =>
    db.query.user(
      {
        where: {
          id: user.id
        }
      },
      info
    ),
  users: (_, args, { db }: IAppContext, info: GraphQLResolveInfo) =>
    db.query.users(args, info),
  posts: (_, args, { db, user }: IAppContext, info: GraphQLResolveInfo) => {
    if (!user || user.role !== 'Admin') {
      args.where = {
        ...args.where,
        published: true
      }
    }

    return db.query.posts(args, info)
  },
  myPosts(_, args, { db, user }: IAppContext, info: GraphQLResolveInfo) {
    args.where = {
      ...args.where,
      author: {
        id: user.id
      }
    }

    return db.query.posts(args, info)
  },
  postById: async (
    _,
    args,
    { db, user }: IAppContext,
    info: GraphQLResolveInfo
  ) => {
    const opArgs: any = {
      where: {
        id: args.id
      }
    }

    if (!user) opArgs.where.published = true
    else {
      if (user.role === 'User')
        opArgs.where.OR = [{ published: true }, { author: { id: user.id } }]
    }

    const posts = await db.query.posts(opArgs, info)

    if (posts.length === 0) {
      throw new Error('Post not found')
    }

    return posts[0]
  },
  comments: (_, args, { db }: IAppContext, info: GraphQLResolveInfo) =>
    db.query.comments(args, info)
}

export { Query as default }
