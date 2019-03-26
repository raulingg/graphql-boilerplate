import bcrypt from 'bcryptjs'
import { generateToken } from '../utils'
import hashPassword from '../utils/hashPassword'
import { Prisma } from '../generated/prisma-client'
import { GraphQLResolveInfo } from 'graphql'

const Mutation = {
  async register(
    _: any,
    args: any,
    { db }: { db: any },
    info: GraphQLResolveInfo
  ) {
    const password = await hashPassword(args.data.password)
    const user = await db.mutation.createUser({
      data: {
        ...args.data,
        password,
        role: 'User'
      }
    })

    console.log(user)

    return {
      token: await generateToken({ user: { id: user.id, role: user.role } })
    }
  },
  async login(_: any, args: any, { prisma }: { prisma: Prisma }) {
    const user = await prisma.user({
      email: args.data.email
    })

    if (!user) {
      throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(args.data.password, user.password)

    if (!isMatch) {
      throw new Error('Unable to login')
    }

    return {
      token: await generateToken({ user: { id: user.id, role: user.role } })
    }
  },
  deleteUser: (
    _: any,
    args: any,
    { db }: { db: any },
    info: GraphQLResolveInfo
  ) => db.mutation.deleteUser(args, info),
  updateUser: async (
    _: any,
    args: any,
    { user, db }: { db: any; user: any },
    info: GraphQLResolveInfo
  ) => {
    if (typeof args.data.password === 'string') {
      args.data.password = await hashPassword(args.data.password)
    }

    return db.mutation.updateUser(
      {
        where: {
          id: user.id
        },
        data: args.data
      },
      info
    )
  },
  createPost: (
    _: any,
    args: any,
    { db, user }: { db: any; user: any },
    info: GraphQLResolveInfo
  ) =>
    db.mutation.createPost(
      {
        data: {
          title: args.data.title,
          body: args.data.body,
          published: args.data.published,
          author: {
            connect: {
              id: user.id
            }
          }
        }
      },
      info
    ),
  deletePost: (_: any, args: any, { prisma }: { prisma: Prisma }) =>
    prisma.deletePost({ id: args.id }),
  updatePost: async (_: any, args: any, { db }: { db: any }, info: any) =>
    db.mutation.updatePost(
      {
        where: {
          id: args.id
        },
        data: args.data
      },
      info
    ),
  createComment: async (
    _: any,
    args: any,
    { db, user }: { db: any; user: any },
    info: any
  ) => {
    const postExists = await db.exists.Post({
      id: args.data.post,
      published: true
    })

    if (!postExists) {
      throw new Error('Unable to find post')
    }

    return db.mutation.createComment(
      {
        data: {
          text: args.data.text,
          author: {
            connect: {
              id: user.id
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
  deleteComment: (_: any, args: any, { prisma }: { prisma: Prisma }) =>
    prisma.deleteComment({ id: args.id }),
  updateComment: (_: any, args: any, { prisma }: { prisma: Prisma }) =>
    prisma.updateComment({
      where: {
        id: args.id
      },
      data: args.data
    })
}

export default Mutation
