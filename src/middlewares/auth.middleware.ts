import { rule, shield, or } from 'graphql-shield'
import { getUserFromToken } from '../utils'
import IAppContext from '../types/IAppContext'

const AUTH_HEADER = 'authorization'

const isAuthenticated = rule()(async (parent, args, ctx: IAppContext) => {
  if (ctx.user) return true

  const authToken = ctx.request.request
    ? ctx.request.request.get(AUTH_HEADER)
    : ctx.request.connection.context.Authorization

  if (!authToken) return false

  try {
    ctx.user = await getUserFromToken(authToken)

    return true
  } catch (err) {
    console.log(err)

    return false
  }
})

const isGuest = rule()(async (parent, args, ctx: IAppContext) => {
  const authToken = ctx.request.request.get('authorization')

  return !Boolean(authToken)
})

const rules = shield({
  Query: {
    me: isAuthenticated,
    users: isAuthenticated,
    posts: or(isGuest, isAuthenticated),
    myPosts: isAuthenticated,
    postById: or(isGuest, isAuthenticated),
    comments: or(isGuest, isAuthenticated)
  },
  Mutation: {
    updateMe: isAuthenticated,
    updateUser: isAuthenticated,
    deleteUser: isAuthenticated,
    createPost: isAuthenticated,
    updatePost: isAuthenticated,
    deletePost: isAuthenticated,
    createComment: isAuthenticated,
    updateComment: isAuthenticated,
    deleteComment: isAuthenticated
  },
  Subscription: {
    myPost: isAuthenticated
  }
})

export default rules
