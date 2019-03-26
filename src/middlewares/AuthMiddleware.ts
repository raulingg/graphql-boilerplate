import { rule, shield, or } from 'graphql-shield'
import getUserFromRequest from '../utils/getUserFromRequest'

const isAuthenticated = rule()(async (parent, args, ctx, info) => {
  if (ctx.user && Boolean(ctx.user.id)) return true

  try {
    ctx.user = await getUserFromRequest(ctx.request)
  } catch (err) {
    console.log(err)
    return false
  }

  return true
})

const isGuest = rule()(async (parent, args, ctx, info) => {
  const header = ctx.request.request.get('authorization')

  return !Boolean(header)
})

const rules = shield({
  Query: {
    me: isAuthenticated,
    users: isAuthenticated,
    posts: or(isGuest, isAuthenticated),
    myPosts: isAuthenticated,
    postById: or(isGuest, isAuthenticated),
    comments: isAuthenticated
  },
  Mutation: {
    updateUser: isAuthenticated,
    deleteUser: isAuthenticated,
    createPost: isAuthenticated,
    updatePost: isAuthenticated,
    deletePost: isAuthenticated,
    createComment: isAuthenticated,
    updateComment: isAuthenticated,
    deleteComment: isAuthenticated
  }
})

export default rules
