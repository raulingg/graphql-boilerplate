import { GraphQLResolveInfo } from 'graphql'

const Query = {
  me: (_: any, __: any, { db, user }: { db: any; user: any }) =>
    db.query.user({
      where: {
        id: user.id
      }
    }),
  users: (_: any, args: any, { db }: { db: any }, info: GraphQLResolveInfo) =>
    db.query.users(args, info),
  posts: (
    _: any,
    args: any,
    { db, user }: { db: any; user: any },
    info: GraphQLResolveInfo
  ) => {
    if (!user || user.role !== 'Admin') {
      args.where = {
        ...args.where,
        published: true
      }
    }

    return db.query.posts(args, info)
  },
  myPosts(
    _: any,
    args: any,
    { db, user }: { db: any; user: any },
    info: GraphQLResolveInfo
  ) {
    args.where = {
      ...args.where,
      author: {
        id: user.id
      }
    }

    return db.query.posts(args, info)
  },
  postById: async (
    _: any,
    args: any,
    { db, user }: { db: any; user: any },
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
  comments: (
    _: any,
    args: any,
    { db }: { db: any },
    info: GraphQLResolveInfo
  ) => db.query.comments(args, info)
}

export { Query as default }
