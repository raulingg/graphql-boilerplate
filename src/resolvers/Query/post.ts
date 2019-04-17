import IAppContext from '../../types/IAppContext'
import { GraphQLResolveInfo } from 'graphql'

const post = {
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
  }
}

export default post
