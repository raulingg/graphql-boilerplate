import { rule, shield, or } from 'graphql-shield'
import IAppContext from '../types/IAppContext'

const isAdmin = rule()(
  async (parent, args, ctx: IAppContext) =>
    Boolean(ctx.user) && ctx.user.role === 'Admin'
)

/**
 *
 * @param on Table o Collection name
 * @param relationship  Field name related to owner (i.e user, owner, author)
 */
const isOwner = (on: string, relationship: string) =>
  rule({ cache: 'no_cache' })(async (next, args, ctx: IAppContext) => {
    const { id: resourceId } = args || { id: null }

    if (!ctx.user) return false

    if (on === 'User') {
      return ctx.user.id === resourceId
    } else {
      const isOwner = await ctx.db.exists[on]({
        id: resourceId,
        [relationship]: { id: ctx.user.id }
      })
      return isOwner
    }
  })

const rules = shield({
  Query: {
    users: isAdmin
  },
  Mutation: {
    updateUser: isAdmin,
    deleteUser: isAdmin,
    updatePost: or(isAdmin, isOwner('Post', 'author')),
    deletePost: or(isAdmin, isOwner('Post', 'author')),
    updateComment: or(isAdmin, isOwner('Comment', 'author')),
    deleteComment: or(isAdmin, isOwner('Comment', 'author'))
  }
})

export default rules
