import { rule, shield, or } from 'graphql-shield'

const isAdmin = rule()(
  async (parent, args, ctx, info) =>
    Boolean(ctx.user) && ctx.user.role === 'Admin'
)

const isOwner = (on: string, field: string) =>
  rule({ cache: 'no_cache' })(async (next, args, ctx, info) => {
    const { id: resourceId } = args || { id: null }

    if (on === 'User') {
      return ctx.user.id === resourceId
    } else {
      const isOwner = await ctx.db.exists[on]({
        id: resourceId,
        [field]: { id: ctx.user.id }
      })
      return isOwner
    }
  })

const rules = shield({
  Query: {
    users: isAdmin
  },
  Mutation: {
    deleteUser: isAdmin,
    updatePost: or(isAdmin, isOwner('Post', 'author')),
    deletePost: or(isAdmin, isOwner('Post', 'author')),
    updateComment: or(isAdmin, isOwner('Comment', 'author')),
    deleteComment: or(isAdmin, isOwner('Comment', 'author'))
  }
})

export default rules
