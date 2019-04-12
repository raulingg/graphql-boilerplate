import bcrypt from 'bcryptjs'
import { generateToken } from '../utils'
import { GraphQLResolveInfo } from 'graphql'
import {
  UserWhereUniqueInput,
  UserUpdateInput,
  UserCreateInput,
  PostCreateInput,
  PostUpdateInput,
  CommentCreateInput,
  CommentUpdateInput
} from '../generated/prisma-client'
import IAppContext from '../interfaces/IAppContext'

const Mutation = {
  async signup(_, { data }: { data: UserCreateInput }, { db }: IAppContext) {
    const password = await bcrypt.hash(data.password, 10)
    const user = await db.mutation.createUser(
      {
        data: {
          ...data,
          password,
          role: 'User'
        }
      },
      '{id, role}'
    )

    return {
      token: await generateToken({ user: { id: user.id, role: user.role } })
    }
  },
  async login(_, args, { db }: IAppContext) {
    const user = await db.query.user(
      {
        where: {
          email: args.data.email
        }
      },
      '{ id, role, password}'
    )

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
  ) => db.mutation.deleteUser({ where }),
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
    db.mutation.deletePost({ where: { id } }),
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

export default Mutation
